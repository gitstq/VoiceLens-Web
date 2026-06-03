"""
VoiceLens-Web LLM Client Module
Lightweight LLM API client supporting GLM-5.1 (ZhipuAI), OpenAI, and custom endpoints
"""

import json
import logging
from typing import AsyncGenerator, Optional

import httpx

from backend.config import LLMConfig

logger = logging.getLogger(__name__)


class LLMClient:
    """Unified LLM API client with streaming support"""

    def __init__(self, config: LLMConfig):
        self.config = config
        self._client: Optional[httpx.AsyncClient] = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(timeout=60.0)
        return self._client

    async def chat_stream(
        self,
        messages: list[dict],
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> AsyncGenerator[str, None]:
        """
        Send a chat request and stream the response.
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            temperature: Override temperature
            max_tokens: Override max tokens
            
        Yields:
            Content chunks as strings
        """
        headers = {
            "Authorization": f"Bearer {self.config.api_key}",
            "Content-Type": "application/json",
        }
        
        # Build system prompt if needed
        full_messages = []
        if self.config.system_prompt and not any(
            m.get("role") == "system" for m in messages
        ):
            if self.config.provider == "zhipu":
                # Zhipu API uses first user message with system instruction
                pass  # Handle separately
            else:
                full_messages.append({
                    "role": "system",
                    "content": self.config.system_prompt
                })
        
        full_messages.extend(messages)
        
        body = {
            "model": self.config.model,
            "messages": full_messages,
            "temperature": temperature or self.config.temperature,
            "max_tokens": max_tokens or self.config.max_tokens,
            "top_p": self.config.top_p,
            "stream": True,
        }
        
        # Zhipu-specific: prepend system prompt to first user message
        if self.config.provider == "zhipu" and self.config.system_prompt:
            body["system_prompt"] = self.config.system_prompt
        
        api_url = f"{self.config.base_url.rstrip('/')}/chat/completions"
        
        client = await self._get_client()
        
        try:
            async with client.stream(
                "POST",
                api_url,
                headers=headers,
                json=body,
            ) as response:
                if response.status_code != 200:
                    error_text = await response.aread()
                    error_msg = f"API Error {response.status_code}: {error_text.decode()[:500]}"
                    logger.error(error_msg)
                    yield f"⚠️ {error_msg}"
                    return
                
                async for line in response.aiter_lines():
                    line = line.strip()
                    if not line:
                        continue
                    if not line.startswith("data: "):
                        continue
                    
                    data_str = line[6:]  # Remove "data: "
                    if data_str == "[DONE]":
                        break
                    
                    try:
                        chunk = json.loads(data_str)
                        choices = chunk.get("choices", [])
                        if not choices:
                            continue
                        
                        delta = choices[0].get("delta", {})
                        content = delta.get("content", "")
                        if content:
                            yield content
                    except json.JSONDecodeError:
                        logger.warning(f"Failed to parse chunk: {data_str[:100]}")
                        continue
                        
        except httpx.TimeoutException:
            yield "\n\n⏰ 请求超时，请检查网络连接或API服务状态。"
        except httpx.ConnectError:
            yield "\n\n🔌 无法连接到API服务器，请检查网络连接。"
        except Exception as e:
            logger.exception(f"Unexpected error in LLM chat: {e}")
            yield f"\n\n❌ 发生未知错误：{str(e)[:200]}"

    async def close(self):
        """Close the HTTP client"""
        if self._client:
            await self._client.aclose()
            self._client = None


class SessionManager:
    """Simple in-memory session manager for conversation history"""

    def __init__(self, max_history: int = 50):
        self._sessions: dict[str, list[dict]] = {}
        self.max_history = max_history

    def get_history(self, session_id: str) -> list[dict]:
        """Get conversation history for a session"""
        return self._sessions.get(session_id, [])

    def add_message(self, session_id: str, role: str, content: str):
        """Add a message to session history"""
        if session_id not in self._sessions:
            self._sessions[session_id] = []
        self._sessions[session_id].append({
            "role": role,
            "content": content,
        })
        # Trim history if too long
        if len(self._sessions[session_id]) > self.max_history:
            self._sessions[session_id] = self._sessions[session_id][-self.max_history:]

    def clear_history(self, session_id: str):
        """Clear conversation history for a session"""
        self._sessions[session_id] = []

    def get_all_sessions(self) -> list[dict]:
        """Get summary of all sessions"""
        return [
            {"id": sid, "message_count": len(msgs), "last_message": msgs[-1]["content"][:100] if msgs else ""}
            for sid, msgs in self._sessions.items()
            if msgs
        ]