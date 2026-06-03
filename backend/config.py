"""
VoiceLens-Web Configuration Module
轻量级语音交互LLM Web助手 - 配置管理
"""

import os
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class LLMConfig:
    """LLM API configuration"""
    provider: str = "zhipu"  # zhipu | openai | custom
    api_key: str = ""
    base_url: str = ""
    model: str = ""
    temperature: float = 0.7
    max_tokens: int = 4096
    top_p: float = 0.9
    system_prompt: str = "你是一个友善、智能的AI助手。请用简洁、自然的语言回答用户的问题。"
    
    # Provider presets
    PROVIDER_PRESETS = {
        "zhipu": {
            "base_url": "https://open.bigmodel.cn/api/paas/v4",
            "model": "GLM-5.1-130B",
        },
        "openai": {
            "base_url": "https://api.openai.com/v1",
            "model": "gpt-4o",
        },
    }
    
    def __post_init__(self):
        provider = self.provider or os.getenv("VOICELENS_LLM_PROVIDER", "zhipu")
        self.provider = provider
        
        if provider in self.PROVIDER_PRESETS:
            preset = self.PROVIDER_PRESETS[provider]
            if not self.base_url:
                self.base_url = preset["base_url"]
            if not self.model:
                self.model = preset["model"]
        
        # Override from environment variables
        self.api_key = self.api_key or os.getenv("VOICELENS_API_KEY", "")
        env_base_url = os.getenv("VOICELENS_BASE_URL", "")
        if env_base_url:
            self.base_url = env_base_url
        env_model = os.getenv("VOICELENS_MODEL", "")
        if env_model:
            self.model = env_model


@dataclass
class ServerConfig:
    """Server configuration"""
    host: str = "0.0.0.0"
    port: int = 8080
    debug: bool = False
    cors_origins: list = field(default_factory=lambda: ["*"])


@dataclass
class AppConfig:
    """Application configuration"""
    server: ServerConfig = field(default_factory=ServerConfig)
    llm: LLMConfig = field(default_factory=LLMConfig)
    session_ttl: int = 3600  # Session TTL in seconds
    max_history: int = 50  # Maximum conversation history messages
    
    @classmethod
    def from_env(cls) -> "AppConfig":
        """Create config from environment variables"""
        return cls(
            server=ServerConfig(
                host=os.getenv("VOICELENS_HOST", "0.0.0.0"),
                port=int(os.getenv("VOICELENS_PORT", "8080")),
                debug=os.getenv("VOICELENS_DEBUG", "").lower() == "true",
            ),
            llm=LLMConfig(),
        )