<div align="center">

# 🎙️ VoiceLens-Web

**轻量级语音交互LLM Web助手**

[![GitHub Release](https://img.shields.io/github/v/release/gitstq/VoiceLens-Web?style=flat-square&logo=github&color=6c5ce7)](https://github.com/gitstq/VoiceLens-Web/releases)
[![Python](https://img.shields.io/badge/Python-3.9+-6c5ce7?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-6c5ce7?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-6c5ce7?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-6c5ce7?style=flat-square)](https://github.com/gitstq/VoiceLens-Web/pulls)

**English** · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md)

</div>

---

## 🎉 项目介绍

**VoiceLens-Web** 是一款 **轻量级、跨平台的语音交互AI助手**，完全运行在你的浏览器中。它让你能够与 **GLM-5.1（智谱AI）** 以及其他大语言模型进行自然的语音对话——无需笨重的桌面客户端，无需复杂的环境配置，只需 **一行命令即可启动**。

> 💡 **灵感来源** 于 GitHub 热门项目 [Open-LLM-VTuber](https://github.com/Open-LLM-VTuber/Open-LLM-VTuber)。VoiceLens-Web 采取了极其简化的路线：**无需 Live2D 虚拟形象、无需桌面依赖、无需复杂的音频处理管线**。它利用**浏览器原生的 Web Speech API** 同时实现语音输入（语音识别）和语音输出（语音合成），真正做到语音功能零安装、零依赖。

### 为什么选择 VoiceLens-Web？

| 痛点 | 解决方案 |
|------|---------|
| 🐘 重型VTuber应用配置复杂 | ✅ **一行命令启动，纯Web运行** |
| 🎤 语音功能依赖重量级Python库 | ✅ **浏览器原生Web Speech API** |
| 🌐 国内大模型集成麻烦 | ✅ **GLM-5.1 一级支持** |
| 📦 跨平台兼容困难 | ✅ **有浏览器就能用** |
| 🔌 需要MCP/代理等额外服务 | ✅ **只要浏览器 + API Key** |

---

## ✨ 核心特性

- 🎤 **语音输入** — 自然说话即可，点击麦克风按钮开始，浏览器原生支持
- 🤖 **多模型支持** — **GLM-5.1（智谱AI）** 一级支持 + OpenAI 兼容 API
- 🔊 **语音输出** — AI 使用浏览器原生 TTS 朗读回复内容
- ⚡ **流式响应** — 基于 SSE 的实时流式输出，响应迅速
- 💬 **对话历史** — 自动保存会话记录，随时切换历史对话
- 🌙 **精美暗色 UI** — 现代化响应式设计，桌面端和移动端完美适配
- 🔧 **高度可定制** — 可调温度、系统提示词、API 地址、模型名称
- 🐳 **轻松部署** — pip 安装 + 一条命令启动，支持容器化部署

---

## 🚀 快速开始

### 环境要求

- **Python 3.9+**
- 现代浏览器（推荐 Chrome、Edge 或 Safari 以获得语音功能支持）
- [智谱AI](https://open.bigmodel.cn/) 或 OpenAI 的 API Key

### 安装与启动

```bash
# 1. 克隆仓库
git clone https://github.com/gitstq/VoiceLens-Web.git
cd VoiceLens-Web

# 2. 安装依赖
pip install -r requirements.txt

# 3. 设置 API Key（智谱AI / OpenAI）
export VOICELENS_API_KEY="你的-api-key"

# 4. 启动服务器
python3 -m backend.main
```

> **💡 长期使用可以将 `VOICELENS_API_KEY` 添加到 shell 配置文件 (~/.bashrc 或 ~/.zshrc)。**

### 或者使用启动脚本：

```bash
chmod +x start.sh && ./start.sh
```

### 访问

打开浏览器，访问：**http://localhost:8080**

---

## 📖 详细使用指南

### 基本使用

1. **打字输入** — 在输入框中输入文字，按 Enter 或点击 ➤ 发送
2. **语音输入** — 点击 🎤 麦克风按钮，自然说话，系统会自动识别并发送
3. **收听回复** — AI 的回复会自动朗读（可在设置中关闭）
4. **新建对话** — 点击侧边栏的"✨ 新建对话"

### 配置选项

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `VOICELENS_API_KEY` | `""` | LLM API Key（智谱AI或OpenAI） |
| `VOICELENS_BASE_URL` | 自动检测 | 自定义 API 地址 |
| `VOICELENS_MODEL` | `GLM-5.1-130B` | 模型名称 |
| `VOICELENS_HOST` | `0.0.0.0` | 服务器绑定地址 |
| `VOICELENS_PORT` | `8080` | 服务器端口 |
| `VOICELENS_DEBUG` | `false` | 启用调试模式 |

### 设置面板

点击右上角 ⚙️ 打开设置：

- **LLM 提供商** — 切换智谱AI、OpenAI 或自定义
- **API Key** — 输入你的 Key（或通过环境变量设置）
- **温度** — 调整回答的创造性（0.0–2.0）
- **系统提示词** — 自定义 AI 的角色和行为
- **TTS 开关** — 启用/关闭语音朗读

### 支持的 LLM 提供商

| 提供商 | API 地址 | 默认模型 |
|--------|---------|---------|
| 🏆 **智谱AI (ZhipuAI)** | `https://open.bigmodel.cn/api/paas/v4` | `GLM-5.1-130B` |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o` |
| 自定义 | 任意兼容 OpenAI 的地址 | 用户自定义 |

---

## 💡 设计思路与迭代规划

### 设计理念

VoiceLens-Web 围绕一个简单的原则构建：**与大模型的语音交互应该毫不费力**。关键设计决策：

- **浏览器原生语音** — 使用 Web Speech API 消除了 Python 音频依赖，使项目真正轻量化和跨平台
- **FastAPI + SSE** — 现代化异步 Python 后端，支持实时流式传输
- **无框架前端** — 纯 HTML/CSS/JS，零构建步骤，即时加载
- **GLM-5.1 优先** — 针对国内大模型生态优化，同时保持广泛兼容性

### 技术栈

```
后端:      Python 3.9+ · FastAPI · Uvicorn · httpx (SSE 流式)
前端:      HTML5 · CSS3 (暗色主题) · 原生 JS · Web Speech API
语音:      Web Speech Recognition (输入) · Web Speech Synthesis (输出)
LLM API:   智谱AI (GLM-5.1) · OpenAI 兼容 · 自定义端点
```

### 后续规划

- [x] **v1.0** — 语音输入/输出、流式对话、GLM-5.1 支持、对话历史
- [ ] **v1.1** — Markdown 渲染优化、代码语法高亮
- [ ] **v1.2** — Docker 支持、docker-compose 一键部署
- [ ] **v1.3** — 语音活动检测 (VAD)、按键说话优化
- [ ] **v2.0** — 多模态支持（图片上传与视觉识别）、WebRTC 语音流
- [ ] **v2.1** — MCP 服务器集成、插件系统
- [ ] **v2.2** — 通过 PWA 支持移动端应用、离线模式

---

## 📦 打包与部署指南

### 生产环境部署

```bash
# 使用 nohup（简单方式）
nohup python3 -m backend.main > voicelens.log 2>&1 &

# 使用 systemd（服务器推荐）
# 创建 /etc/systemd/system/voicelens.service
```

`voicelens.service` 示例：

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

### Docker 部署（v1.2 支持）

```bash
docker build -t voicelens-web .
docker run -d -p 8080:8080 -e VOICELENS_API_KEY=your-key voicelens-web
```

### 环境要求

- **操作系统**: Linux、macOS、Windows（任何支持 Python 3.9+ 的系统）
- **浏览器**: Chrome 80+、Edge 80+、Safari 14+（语音功能需要）
- **内存**: 服务器约 50MB（浏览器内存另计）
- **网络**: 需要联网调用 LLM API

---

## 🤝 贡献指南

欢迎任何形式的贡献！让开源社区变得更好！

1. 🍴 Fork 本仓库
2. 🌿 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 💾 提交你的改动 (`git commit -m 'feat: 添加某个很棒的特性'`)
4. 📤 推送到分支 (`git push origin feature/AmazingFeature`)
5. 🎯 提交 Pull Request

请遵循 [Angular 提交规范](https://www.conventionalcommits.org/)。

### 问题反馈

发现了 Bug？有新功能建议？[提交 Issue](https://github.com/gitstq/VoiceLens-Web/issues) — 期待你的反馈！

---

## 📄 开源协议

本项目采用 **MIT 协议** 开源。详见 [LICENSE](LICENSE) 文件。

---

<div align="center">

**用 🎙️ 和 ❤️ 为开源社区打造**

[![GitHub Stars](https://img.shields.io/github/stars/gitstq/VoiceLens-Web?style=social)](https://github.com/gitstq/VoiceLens-Web)
[![GitHub Forks](https://img.shields.io/github/forks/gitstq/VoiceLens-Web?style=social)](https://github.com/gitstq/VoiceLens-Web)

</div>