#!/usr/bin/env bash
# VoiceLens-Web 🎙️ - Quick Start Script
# 轻量级语音交互LLM Web助手 - 快速启动脚本

set -e

echo "🎙️ VoiceLens-Web v1.0.0"
echo "========================"

# Check Python version
PYTHON=$(command -v python3 || command -v python)
if [ -z "$PYTHON" ]; then
    echo "❌ Python 3.9+ is required but not found."
    exit 1
fi

echo "✅ Python: $($PYTHON --version)"

# Check if running in virtual environment
if [ -z "$VIRTUAL_ENV" ]; then
    echo "📦 Creating virtual environment..."
    $PYTHON -m venv .venv
    source .venv/bin/activate
else
    echo "📦 Using existing virtual environment: $VIRTUAL_ENV"
fi

# Install dependencies
echo "📥 Installing dependencies..."
pip install -q -r requirements.txt --break-system-packages 2>/dev/null || pip install -q -r requirements.txt

# Check API key
if [ -z "$VOICELENS_API_KEY" ]; then
    echo ""
    echo "⚠️  环境变量 VOICELENS_API_KEY 未设置"
    echo ""
    echo "  你可以通过以下方式设置："
    echo "  1. export VOICELENS_API_KEY='your-api-key-here'"
    echo "  2. 启动后在网页界面的设置中填入 API Key"
    echo ""
fi

echo ""
echo "🚀 启动 VoiceLens-Web 服务..."
echo "   访问地址: http://localhost:${VOICELENS_PORT:-8080}"
echo ""

# Start the server
$PYTHON -m backend.main