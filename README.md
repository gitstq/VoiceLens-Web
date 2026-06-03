<div align="center">

# 🎙️ VoiceLens-Web

**Lightweight Voice-Interactive LLM Web Assistant**

[![GitHub Release](https://img.shields.io/github/v/release/gitstq/VoiceLens-Web?style=flat-square&logo=github&color=6c5ce7)](https://github.com/gitstq/VoiceLens-Web/releases)
[![Python](https://img.shields.io/badge/Python-3.9+-6c5ce7?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-6c5ce7?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-6c5ce7?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-6c5ce7?style=flat-square)](https://github.com/gitstq/VoiceLens-Web/pulls)

[简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · **English**

</div>

---

## 🎉 Introduction

**VoiceLens-Web** is a **lightweight, cross-platform voice-interactive AI assistant** that runs entirely in your web browser. It allows you to have natural voice conversations with **GLM-5.1 (ZhipuAI)** and other Large Language Models — no heavy desktop clients, no complex environment setup, just **one command to start**.

> 💡 **Inspired by** the trending [Open-LLM-VTuber](https://github.com/Open-LLM-VTuber/Open-LLM-VTuber) project, VoiceLens-Web takes a radically simplified approach: **no Live2D avatars, no desktop dependencies, no complex audio pipelines**. Instead, it leverages **browser-native Web Speech API** for both voice input (SpeechRecognition) and output (SpeechSynthesis), making it truly zero-install, zero-dependency for voice capabilities.

### Why VoiceLens-Web?

| Problem | Solution |
|---------|----------|
| 🐘 Heavy VTuber apps need complex setup | ✅ **One-command launch, pure web** |
| 🎤 Voice features require heavy Python libs | ✅ **Browser-native Web Speech API** |
| 🌐 Chinese LLM integration is tricky | ✅ **GLM-5.1 first-class support** |
| 📦 Cross-platform is hard | ✅ **Any device with a browser works** |
| 🔌 MCP/proxy/extra services needed | ✅ **Just a browser and an API key** |

---

## ✨ Core Features

- 🎤 **Voice Input** — Speak naturally, powered by browser Web Speech API. Click the mic and start talking.
- 🤖 **Multi-LLM Support** — First-class support for **GLM-5.1 (ZhipuAI)** + OpenAI-compatible APIs.
- 🔊 **Voice Output** — AI reads responses aloud using browser-native TTS (Text-to-Speech).
- ⚡ **Streaming Responses** — Real-time SSE (Server-Sent Events) streaming for instant replies.
- 💬 **Conversation History** — Auto-saved sessions, switch between conversations anytime.
- 🌙 **Beautiful Dark UI** — Modern, responsive design that works great on desktop and mobile.
- 🔧 **Customizable** — Adjust temperature, system prompt, API endpoint, and model name.
- 🐳 **Easy Deployment** — pip install + one command, or use Docker.

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.9+**
- A modern web browser (Chrome, Edge, or Safari recommended for voice features)
- An API key from [ZhipuAI (智谱AI)](https://open.bigmodel.cn/) or OpenAI

### Installation & Launch

```bash
# 1. Clone the repository
git clone https://github.com/gitstq/VoiceLens-Web.git
cd VoiceLens-Web

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set your API key (ZhipuAI / OpenAI)
export VOICELENS_API_KEY="your-api-key-here"

# 4. Start the server
python3 -m backend.main
```

> **💡 For repeat use, add `VOICELENS_API_KEY` to your shell profile (~/.bashrc or ~/.zshrc).**

### Or use the start script:

```bash
chmod +x start.sh && ./start.sh
```

### Access

Open your browser and go to: **http://localhost:8080**

---

## 📖 Usage Guide

### Basic Usage

1. **Type a message** — Enter text in the input box and press Enter or click ➤
2. **Use voice** — Click the 🎤 microphone button, speak naturally, and release
3. **Listen to replies** — AI responses are automatically read aloud (can be toggled in Settings)
4. **New conversation** — Click "✨ New Chat" in the sidebar

### Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `VOICELENS_API_KEY` | `""` | Your LLM API key (ZhipuAI or OpenAI) |
| `VOICELENS_BASE_URL` | Auto-detect | Custom API endpoint |
| `VOICELENS_MODEL` | `GLM-5.1-130B` | Model name |
| `VOICELENS_HOST` | `0.0.0.0` | Server bind address |
| `VOICELENS_PORT` | `8080` | Server port |
| `VOICELENS_DEBUG` | `false` | Enable debug mode |

### Settings Panel

Click ⚙️ in the top-right corner to open settings:

- **LLM Provider** — Switch between ZhipuAI, OpenAI, or custom
- **API Key** — Enter your key (or set via environment variable)
- **Temperature** — Adjust response creativity (0.0–2.0)
- **System Prompt** — Customize the AI's behavior
- **TTS Toggle** — Enable/disable voice output

### Supported LLM Providers

| Provider | API Base URL | Default Model |
|----------|-------------|---------------|
| 🏆 **ZhipuAI (智谱AI)** | `https://open.bigmodel.cn/api/paas/v4` | `GLM-5.1-130B` |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o` |
| Custom | Any OpenAI-compatible endpoint | User-defined |

---

## 💡 Design & Roadmap

### Design Philosophy

VoiceLens-Web was built around a simple principle: **voice interaction with LLMs should be effortless**. Key design decisions:

- **Browser-native voice** — Web Speech API eliminates Python audio dependencies, making the project truly lightweight and cross-platform
- **FastAPI + SSE** — Modern async Python backend with real-time streaming
- **No framework frontend** — Pure HTML/CSS/JS for zero build step, instant loading
- **GLM-5.1 first** — Optimized for Chinese LLM ecosystem while maintaining broad compatibility

### Technology Stack

```
Backend:    Python 3.9+ · FastAPI · Uvicorn · httpx (SSE streaming)
Frontend:   HTML5 · CSS3 (dark theme) · Vanilla JS · Web Speech API
Voice:      Web Speech Recognition (input) · Web Speech Synthesis (output)
LLM APIs:   ZhipuAI (GLM-5.1) · OpenAI-compatible · Custom endpoints
```

### Roadmap

- [x] **v1.0** — Voice input/output, streaming chat, GLM-5.1 support, conversation history
- [ ] **v1.1** — Markdown rendering improvements, code syntax highlighting
- [ ] **v1.2** — Docker support, docker-compose for easy deployment
- [ ] **v1.3** — Voice activity detection (VAD), push-to-talk improvements
- [ ] **v2.0** — Multi-modal support (image upload & vision), WebRTC voice streaming
- [ ] **v2.1** — MCP server integration, plugin system
- [ ] **v2.2** — Mobile app via PWA, offline mode

---

## 📦 Deployment Guide

### Production Deployment

```bash
# Using nohup (simple)
nohup python3 -m backend.main > voicelens.log 2>&1 &

# Using systemd (recommended for servers)
# Create /etc/systemd/system/voicelens.service
```

Example `voicelens.service`:

```ini
[Unit]
Description=VoiceLens-Web
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/VoiceLens-Web
Environment=VOICELENS_API_KEY=your-key
ExecStart=/usr/bin/python3 -m backend.main
Restart=always

[Install]
WantedBy=multi-user.target
```

### Docker (Coming in v1.2)

```bash
docker build -t voicelens-web .
docker run -d -p 8080:8080 -e VOICELENS_API_KEY=your-key voicelens-web
```

### Requirements

- **OS**: Linux, macOS, Windows (any system with Python 3.9+)
- **Browser**: Chrome 80+, Edge 80+, Safari 14+ (for voice features)
- **RAM**: ~50MB for the server (browser memory varies)
- **Network**: Internet connection for LLM API calls

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place!

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🎯 Open a Pull Request

Please make sure to follow the [Angular Commit Convention](https://www.conventionalcommits.org/).

### Report Issues

Found a bug? Have a feature request? [Open an issue](https://github.com/gitstq/VoiceLens-Web/issues) — we'd love to hear from you!

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

<div align="center">

**Made with 🎙️ and ❤️ for the open-source community**

[![GitHub Stars](https://img.shields.io/github/stars/gitstq/VoiceLens-Web?style=social)](https://github.com/gitstq/VoiceLens-Web)
[![GitHub Forks](https://img.shields.io/github/forks/gitstq/VoiceLens-Web?style=social)](https://github.com/gitstq/VoiceLens-Web)

</div>