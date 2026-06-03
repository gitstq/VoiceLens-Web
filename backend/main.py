"""
VoiceLens-Web 🎙️
Lightweight Voice-Interactive LLM Web Assistant
轻量级语音交互LLM Web助手
"""

import json
import logging
import pathlib
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, FileResponse, StreamingResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from backend.config import AppConfig
from backend.llm_client import LLMClient, SessionManager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("voicelens")

# Global state
config = AppConfig.from_env()
llm_client: LLMClient = None
session_manager = SessionManager(max_history=config.max_history)

# Frontend directory
FRONTEND_DIR = pathlib.Path(__file__).parent.parent / "frontend"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan"""
    global llm_client
    logger.info(f"🚀 VoiceLens-Web starting on {config.server.host}:{config.server.port}")
    logger.info(f"   LLM Provider: {config.llm.provider}")
    logger.info(f"   Model: {config.llm.model}")
    
    llm_client = LLMClient(config.llm)
    
    if not config.llm.api_key:
        logger.warning("⚠️  VOICELENS_API_KEY not set! Please set it before chatting.")
    
    if not FRONTEND_DIR.exists():
        logger.warning(f"Frontend directory not found: {FRONTEND_DIR}")
    
    yield
    
    await llm_client.close()
    logger.info("👋 VoiceLens-Web shutting down")


app = FastAPI(
    title="VoiceLens-Web",
    description="Lightweight Voice-Interactive LLM Web Assistant",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.server.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── API Routes ─────────────────────────────────────────────────────────


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "version": "1.0.0",
        "provider": config.llm.provider,
        "model": config.llm.model,
        "api_configured": bool(config.llm.api_key),
    }


@app.get("/api/config")
async def get_config():
    """Get public configuration (no secrets)"""
    return {
        "provider": config.llm.provider,
        "model": config.llm.model,
        "system_prompt": config.llm.system_prompt,
        "api_configured": bool(config.llm.api_key),
        "max_history": config.max_history,
    }


@app.post("/api/chat")
async def chat(request: Request):
    """
    Chat endpoint with streaming SSE response.
    
    Request body:
    {
        "message": "Hello!",
        "session_id": "uuid-or-auto",
        "temperature": 0.7 (optional)
    }
    """
    body = await request.json()
    message = body.get("message", "").strip()
    session_id = body.get("session_id", str(uuid.uuid4()))
    temperature = body.get("temperature")
    
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")
    if not config.llm.api_key:
        raise HTTPException(
            status_code=503,
            detail="API key not configured. Set VOICELENS_API_KEY environment variable."
        )
    
    # Save user message to history
    session_manager.add_message(session_id, "user", message)
    
    # Get conversation history
    history = session_manager.get_history(session_id)
    
    async def event_stream():
        """SSE event stream"""
        try:
            full_response = ""
            
            async for chunk in llm_client.chat_stream(
                messages=history,
                temperature=temperature,
            ):
                full_response += chunk
                yield f"data: {json.dumps({'type': 'chunk', 'content': chunk})}\n\n"
            
            # Save assistant response
            if full_response:
                session_manager.add_message(session_id, "assistant", full_response)
            
            yield f"data: {json.dumps({'type': 'done', 'session_id': session_id})}\n\n"
            
        except Exception as e:
            logger.exception(f"Stream error: {e}")
            yield f"data: {json.dumps({'type': 'error', 'content': str(e)[:500]})}\n\n"
    
    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/api/sessions")
async def list_sessions():
    """List all conversation sessions"""
    return {"sessions": session_manager.get_all_sessions()}


@app.delete("/api/sessions/{session_id}")
async def clear_session(session_id: str):
    """Clear a specific session"""
    session_manager.clear_history(session_id)
    return {"status": "ok"}


@app.post("/api/sessions/{session_id}/history")
async def get_history(session_id: str):
    """Get conversation history for a session"""
    history = session_manager.get_history(session_id)
    return {"history": history}


# ─── Frontend Routes ─────────────────────────────────────────────────────

# Serve static files (CSS, JS)
app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="frontend")


@app.get("/styles.css", response_class=FileResponse)
async def get_styles():
    return FileResponse(str(FRONTEND_DIR / "styles.css"))


@app.get("/app.js", response_class=FileResponse)
async def get_app_js():
    return FileResponse(str(FRONTEND_DIR / "app.js"))


@app.get("/", response_class=HTMLResponse)
async def index():
    """Serve the main application page"""
    index_path = FRONTEND_DIR / "index.html"
    if not index_path.exists():
        return HTMLResponse(content="<h1>Frontend not found</h1><p>Please build the frontend first.</p>", status_code=404)
    html_content = index_path.read_text(encoding="utf-8")
    # Inject version info
    html_content = html_content.replace(
        "{{VERSION}}", "1.0.0"
    ).replace(
        "{{YEAR}}", "2026"
    )
    return HTMLResponse(content=html_content)


# ─── Entry Point ─────────────────────────────────────────────────────────


def main():
    """Entry point for running the server"""
    import uvicorn
    
    uvicorn.run(
        "backend.main:app",
        host=config.server.host,
        port=config.server.port,
        reload=config.server.debug,
        log_level="info",
    )


if __name__ == "__main__":
    main()