<div align="center">

# 🎙️ VoiceLens-Web

**輕量級語音互動LLM Web助手**

[![GitHub Release](https://img.shields.io/github/v/release/gitstq/VoiceLens-Web?style=flat-square&logo=github&color=6c5ce7)](https://github.com/gitstq/VoiceLens-Web/releases)
[![Python](https://img.shields.io/badge/Python-3.9+-6c5ce7?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-6c5ce7?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-6c5ce7?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-6c5ce7?style=flat-square)](https://github.com/gitstq/VoiceLens-Web/pulls)

**English** · [简体中文](README.zh-CN.md) · **繁體中文**

</div>

---

## 🎉 項目介紹

**VoiceLens-Web** 是一款 **輕量級、跨平台的語音互動AI助手**，完全運行在你的瀏覽器中。它讓你輕鬆與 **GLM-5.1（智譜AI）** 以及其他大型語言模型進行自然的語音對話——無需笨重的桌面客戶端，不用複雜的環境配置，只需 **一行指令即可啟動**。

> 💡 **靈感來源** 於 GitHub 熱門項目 [Open-LLM-VTuber](https://github.com/Open-LLM-VTuber/Open-LLM-VTuber)。VoiceLens-Web 採取了極簡化的路線：**無需 Live2D 虛擬角色、無需桌面依賴、無需複雜的音訊處理管線**。它利用**瀏覽器原生的 Web Speech API** 同時實現語音輸入（語音辨識）和語音輸出（語音合成），真正做到語音功能零安裝、零依賴。

### 為什麼選擇 VoiceLens-Web？

| 痛點 | 解決方案 |
|------|---------|
| 🐘 重型VTuber應用配置複雜 | ✅ **一行指令啟動，純Web運行** |
| 🎤 語音功能依賴重量級Python庫 | ✅ **瀏覽器原生Web Speech API** |
| 🌐 國內大模型整合麻煩 | ✅ **GLM-5.1 一級支援** |
| 📦 跨平台相容困難 | ✅ **有瀏覽器就能用** |
| 🔌 需要MCP/代理等額外服務 | ✅ **只要瀏覽器 + API Key** |

---

## ✨ 核心特性

- 🎤 **語音輸入** — 自然說話即可，點擊麥克風按鈕開始，瀏覽器原生支援
- 🤖 **多模型支援** — **GLM-5.1（智譜AI）** 一級支援 + OpenAI 相容 API
- 🔊 **語音輸出** — AI 使用瀏覽器原生 TTS 朗讀回覆內容
- ⚡ **串流回應** — 基於 SSE 的即時串流輸出，回應迅速
- 💬 **對話記錄** — 自動儲存會話記錄，隨時切換歷史對話
- 🌙 **精美暗色 UI** — 現代化響應式設計，桌面端和行動端完美適配
- 🔧 **高度可自訂** — 可調溫度、系統提示詞、API 位址、模型名稱
- 🐳 **輕鬆部署** — pip 安裝 + 一條指令啟動，支援容器化部署

---

## 🚀 快速開始

### 環境需求

- **Python 3.9+**
- 現代瀏覽器（推薦 Chrome、Edge 或 Safari 以獲得語音功能支援）
- [智譜AI](https://open.bigmodel.cn/) 或 OpenAI 的 API Key

### 安裝與啟動

```bash
# 1. 克隆倉庫
git clone https://github.com/gitstq/VoiceLens-Web.git
cd VoiceLens-Web

# 2. 安裝依賴
pip install -r requirements.txt

# 3. 設定 API Key（智譜AI / OpenAI）
export VOICELENS_API_KEY="你的-api-key"

# 4. 啟動伺服器
python3 -m backend.main
```

> **💡 長期使用可以將 `VOICELENS_API_KEY` 加入 shell 設定檔 (~/.bashrc 或 ~/.zshrc)。**

### 或者使用啟動腳本：

```bash
chmod +x start.sh && ./start.sh
```

### 存取

打開瀏覽器，前往：**http://localhost:8080**

---

## 📖 詳細使用指南

### 基本使用

1. **打字輸入** — 在輸入框中輸入文字，按 Enter 或點擊 ➤ 發送
2. **語音輸入** — 點擊 🎤 麥克風按鈕，自然說話，系統會自動辨識並發送
3. **收聽回覆** — AI 的回覆會自動朗讀（可在設定中關閉）
4. **新建對話** — 點擊側邊欄的「✨ 新建對話」

### 設定選項

| 變數 | 預設值 | 說明 |
|------|--------|------|
| `VOICELENS_API_KEY` | `""` | LLM API Key（智譜AI或OpenAI） |
| `VOICELENS_BASE_URL` | 自動偵測 | 自訂 API 位址 |
| `VOICELENS_MODEL` | `GLM-5.1-130B` | 模型名稱 |
| `VOICELENS_HOST` | `0.0.0.0` | 伺服器綁定位址 |
| `VOICELENS_PORT` | `8080` | 伺服器埠號 |
| `VOICELENS_DEBUG` | `false` | 啟用偵錯模式 |

### 設定面板

點擊右上角 ⚙️ 開啟設定：

- **LLM 提供商** — 切換智譜AI、OpenAI 或自訂
- **API Key** — 輸入你的 Key（或透過環境變數設定）
- **溫度** — 調整回答的創造性（0.0–2.0）
- **系統提示詞** — 自訂 AI 的角色和行為
- **TTS 開關** — 啟用/關閉語音朗讀

### 支援的 LLM 提供商

| 提供商 | API 位址 | 預設模型 |
|--------|---------|---------|
| 🏆 **智譜AI (ZhipuAI)** | `https://open.bigmodel.cn/api/paas/v4` | `GLM-5.1-130B` |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o` |
| 自訂 | 任意相容 OpenAI 的位址 | 使用者自訂 |

---

## 💡 設計思路與迭代規劃

### 設計理念

VoiceLens-Web 圍繞一個簡單的原則構建：**與大模型的語音互動應該毫不費力**。關鍵設計決策：

- **瀏覽器原生語音** — 使用 Web Speech API 消除了 Python 音訊依賴，使專案真正輕量化和跨平台
- **FastAPI + SSE** — 現代化非同步 Python 後端，支援即時串流傳輸
- **無框架前端** — 純 HTML/CSS/JS，零構建步驟，即時載入
- **GLM-5.1 優先** — 針對國內大模型生態最佳化，同時保持廣泛相容性

### 技術棧

```
後端:      Python 3.9+ · FastAPI · Uvicorn · httpx (SSE 串流)
前端:      HTML5 · CSS3 (暗色主題) · 原生 JS · Web Speech API
語音:      Web Speech Recognition (輸入) · Web Speech Synthesis (輸出)
LLM API:   智譜AI (GLM-5.1) · OpenAI 相容 · 自訂端點
```

### 後續規劃

- [x] **v1.0** — 語音輸入/輸出、串流對話、GLM-5.1 支援、對話記錄
- [ ] **v1.1** — Markdown 渲染最佳化、程式碼語法高亮
- [ ] **v1.2** — Docker 支援、docker-compose 一鍵部署
- [ ] **v1.3** — 語音活動偵測 (VAD)、按鍵說話最佳化
- [ ] **v2.0** — 多模態支援（圖片上傳與視覺辨識）、WebRTC 語音串流
- [ ] **v2.1** — MCP 伺服器整合、外掛系統
- [ ] **v2.2** — 透過 PWA 支援行動端應用、離線模式

---

## 📦 打包與部署指南

### 生產環境部署

```bash
# 使用 nohup（簡單方式）
nohup python3 -m backend.main > voicelens.log 2>&1 &

# 使用 systemd（伺服器推薦）
# 建立 /etc/systemd/system/voicelens.service
```

`voicelens.service` 範例：

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

### Docker 部署（v1.2 支援）

```bash
docker build -t voicelens-web .
docker run -d -p 8080:8080 -e VOICELENS_API_KEY=your-key voicelens-web
```

### 環境需求

- **作業系統**: Linux、macOS、Windows（任何支援 Python 3.9+ 的系統）
- **瀏覽器**: Chrome 80+、Edge 80+、Safari 14+（語音功能需要）
- **記憶體**: 伺服器約 50MB（瀏覽器記憶體另計）
- **網路**: 需要連網呼叫 LLM API

---

## 🤝 貢獻指南

歡迎任何形式的貢獻！讓開源社群變得更好！

1. 🍴 Fork 本倉庫
2. 🌿 建立你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 💾 提交你的改動 (`git commit -m 'feat: 新增某個很棒的功能'`)
4. 📤 推送到分支 (`git push origin feature/AmazingFeature`)
5. 🎯 提交 Pull Request

請遵循 [Angular 提交規範](https://www.conventionalcommits.org/)。

### 問題反饋

發現了 Bug？有新功能建議？[提交 Issue](https://github.com/gitstq/VoiceLens-Web/issues) — 期待你的反饋！

---

## 📄 開源協議

本項目採用 **MIT 協議** 開源。詳見 [LICENSE](LICENSE) 文件。

---

<div align="center">

**用 🎙️ 和 ❤️ 為開源社群打造**

[![GitHub Stars](https://img.shields.io/github/stars/gitstq/VoiceLens-Web?style=social)](https://github.com/gitstq/VoiceLens-Web)
[![GitHub Forks](https://img.shields.io/github/forks/gitstq/VoiceLens-Web?style=social)](https://github.com/gitstq/VoiceLens-Web)

</div>