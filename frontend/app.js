/**
 * VoiceLens-Web 🎙️ - Frontend Application
 * Lightweight Voice-Interactive LLM Web Assistant
 */

class VoiceLensApp {
    constructor() {
        // State
        this.sessionId = this._generateId();
        this.isListening = false;
        this.isProcessing = false;
        this.settings = this._loadSettings();
        this.ttsEnabled = true;
        this.recognition = null;
        this.currentStreamAbort = null;
        
        // DOM references
        this._initDOMElements();
        this._initEventListeners();
        this._initVoiceRecognition();
        this._checkHealth();
    }

    // ─── Initialization ───────────────────────────────────

    _generateId() {
        return 'sess-' + Date.now() + '-' + Math.random().toString(36).substr(2, 8);
    }

    _initDOMElements() {
        this.elements = {
            chatContainer: document.getElementById('chatContainer'),
            welcomeScreen: document.getElementById('welcomeScreen'),
            messageInput: document.getElementById('messageInput'),
            sendBtn: document.getElementById('sendBtn'),
            voiceBtn: document.getElementById('voiceBtn'),
            voiceIndicator: document.getElementById('voiceIndicator'),
            voiceStatusText: document.getElementById('voiceStatusText'),
            voiceStopBtn: document.getElementById('voiceStopBtn'),
            menuBtn: document.getElementById('menuBtn'),
            closeSidebar: document.getElementById('closeSidebar'),
            sidebar: document.getElementById('sidebar'),
            newChatBtn: document.getElementById('newChatBtn'),
            clearChatBtn: document.getElementById('clearChatBtn'),
            sessionList: document.getElementById('sessionList'),
            settingsBtn: document.getElementById('settingsBtn'),
            settingsModal: document.getElementById('settingsModal'),
            closeSettingsBtn: document.getElementById('closeSettingsBtn'),
            saveSettingsBtn: document.getElementById('saveSettingsBtn'),
            resetSettingsBtn: document.getElementById('resetSettingsBtn'),
            apiStatus: document.getElementById('apiStatus'),
            statusDot: document.getElementById('statusDot'),
            statusText: document.getElementById('statusText'),
            modelLabel: document.getElementById('modelLabel'),
            providerSelect: document.getElementById('providerSelect'),
            apiKeyInput: document.getElementById('apiKeyInput'),
            baseUrlInput: document.getElementById('baseUrlInput'),
            modelInput: document.getElementById('modelInput'),
            temperatureRange: document.getElementById('temperatureRange'),
            tempValue: document.getElementById('tempValue'),
            systemPromptInput: document.getElementById('systemPromptInput'),
            ttsToggle: document.getElementById('ttsToggle'),
        };
    }

    _initEventListeners() {
        const el = this.elements;

        // Send message
        el.sendBtn.addEventListener('click', () => this._sendMessage());
        el.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this._sendMessage();
            }
            this._autoResizeInput();
        });
        el.messageInput.addEventListener('input', () => this._autoResizeInput());

        // Voice
        el.voiceBtn.addEventListener('click', () => this._toggleVoice());
        el.voiceStopBtn.addEventListener('click', () => this._stopVoice());

        // Sidebar
        el.menuBtn.addEventListener('click', () => el.sidebar.classList.toggle('open'));
        el.closeSidebar.addEventListener('click', () => el.sidebar.classList.remove('open'));
        el.newChatBtn.addEventListener('click', () => this._newChat());
        el.clearChatBtn.addEventListener('click', () => this._clearChat());

        // Settings
        el.settingsBtn.addEventListener('click', () => this._openSettings());
        el.closeSettingsBtn.addEventListener('click', () => this._closeSettings());
        el.settingsModal.addEventListener('click', (e) => {
            if (e.target === el.settingsModal) this._closeSettings();
        });
        el.saveSettingsBtn.addEventListener('click', () => this._saveSettings());
        el.resetSettingsBtn.addEventListener('click', () => this._resetSettings());
        el.temperatureRange.addEventListener('input', () => {
            el.tempValue.textContent = el.temperatureRange.value;
        });

        // TTS
        el.ttsToggle.addEventListener('change', () => {
            this.ttsEnabled = el.ttsToggle.checked;
        });
    }

    _initVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Voice recognition not supported in this browser');
            this.elements.voiceBtn.style.display = 'none';
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'zh-CN';

        this.recognition.onresult = (event) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    final += transcript;
                } else {
                    interim += transcript;
                }
            }
            if (final) {
                this.elements.messageInput.value = final;
                this._autoResizeInput();
                this._stopVoice();
                this._sendMessage();
            } else if (interim) {
                this.elements.messageInput.value = interim;
                this.elements.voiceStatusText.textContent = `聆听中: ${interim}`;
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
            this._stopVoice();
            if (event.error === 'not-allowed') {
                this._showToast('请允许使用麦克风权限');
            } else if (event.error === 'no-speech') {
                // Silent - just stop
            } else {
                this._showToast(`语音识别错误: ${event.error}`);
            }
        };

        this.recognition.onend = () => {
            this._stopVoice();
        };
    }

    // ─── Health Check ─────────────────────────────────────

    async _checkHealth() {
        try {
            const res = await fetch('/api/health');
            const data = await res.json();
            
            this.elements.statusDot.className = data.api_configured ? 'status-dot connected' : 'status-dot';
            this.elements.statusText.textContent = data.api_configured 
                ? `${data.provider} · ${data.model}` 
                : '未配置 API Key';
            this.elements.modelLabel.textContent = `${data.provider} · ${data.model}`;
            
            if (data.api_configured) {
                this._applySettingsToUI({
                    provider: data.provider,
                    model: data.model,
                });
            }
        } catch (err) {
            this.elements.statusDot.className = 'status-dot disconnected';
            this.elements.statusText.textContent = '无法连接服务器';
        }
    }

    // ─── Send / Receive Messages ──────────────────────────

    async _sendMessage() {
        const text = this.elements.messageInput.value.trim();
        if (!text || this.isProcessing) return;

        this.elements.welcomeScreen.style.display = 'none';
        this._addMessage('user', text);
        this.elements.messageInput.value = '';
        this._autoResizeInput();
        this.isProcessing = true;
        this.elements.sendBtn.disabled = true;

        // Show typing indicator
        const typingEl = this._addTypingIndicator();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    session_id: this.sessionId,
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || `HTTP ${response.status}`);
            }

            // Remove typing, add AI message
            typingEl.remove();
            const aiMsgEl = this._addMessage('ai', '');
            const aiBubble = aiMsgEl.querySelector('.message-bubble');
            let fullContent = '';

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n\n');
                
                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    
                    try {
                        const data = JSON.parse(line.slice(6));
                        
                        if (data.type === 'chunk') {
                            fullContent += data.content;
                            aiBubble.innerHTML = this._renderMarkdown(fullContent);
                            this._scrollToBottom();
                        } else if (data.type === 'done') {
                            this.sessionId = data.session_id;
                        } else if (data.type === 'error') {
                            aiBubble.innerHTML = `<p style="color: var(--danger)">❌ ${data.content}</p>`;
                        }
                    } catch (e) {
                        console.warn('Parse error:', e);
                    }
                }
            }

            // TTS
            if (this.ttsEnabled && fullContent) {
                this._speakText(fullContent);
            }
        } catch (err) {
            typingEl.remove();
            this._addMessage('ai', `⚠️ 抱歉，出错了：${err.message}`);
        } finally {
            this.isProcessing = false;
            this.elements.sendBtn.disabled = false;
        }
    }

    // ─── UI Rendering ─────────────────────────────────────

    _addMessage(role, content) {
        const container = this.elements.chatContainer;
        
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${role}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = role === 'user' ? '👤' : '🎙️';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        if (role === 'user') {
            bubble.textContent = content;
        } else {
            bubble.innerHTML = this._renderMarkdown(content);
        }
        
        msgDiv.appendChild(avatar);
        msgDiv.appendChild(bubble);
        container.appendChild(msgDiv);
        
        this._scrollToBottom();
        return msgDiv;
    }

    _addTypingIndicator() {
        const container = this.elements.chatContainer;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar" style="background: var(--bg-tertiary); border: 1px solid var(--border-color);">🎙️</div>
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        `;
        container.appendChild(typingDiv);
        this._scrollToBottom();
        return typingDiv;
    }

    _renderMarkdown(text) {
        if (!text) return '';
        
        // Simple markdown rendering
        let html = text
            // Code blocks
            .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
                return `<pre><code>${this._escapeHtml(code.trim())}</code></pre>`;
            })
            // Inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Bold
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            // Line breaks
            .replace(/\n/g, '<br>');
        
        return html;
    }

    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    _scrollToBottom() {
        setTimeout(() => {
            this.elements.chatContainer.scrollTop = this.elements.chatContainer.scrollHeight;
        }, 10);
    }

    _autoResizeInput() {
        const el = this.elements.messageInput;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 120) + 'px';
        
        this.elements.sendBtn.disabled = !el.value.trim();
    }

    // ─── Voice ────────────────────────────────────────────

    _toggleVoice() {
        if (this.isListening) {
            this._stopVoice();
        } else {
            this._startVoice();
        }
    }

    _startVoice() {
        if (!this.recognition) {
            this._showToast('此浏览器不支持语音识别');
            return;
        }

        try {
            this.recognition.start();
            this.isListening = true;
            this.elements.voiceBtn.classList.add('listening');
            this.elements.voiceIndicator.classList.add('active');
            this.elements.voiceStatusText.textContent = '正在聆听...';
        } catch (err) {
            console.error('Voice start error:', err);
            this._showToast('无法启动语音识别');
        }
    }

    _stopVoice() {
        if (this.recognition) {
            try { this.recognition.stop(); } catch (e) {}
        }
        this.isListening = false;
        this.elements.voiceBtn.classList.remove('listening');
        this.elements.voiceIndicator.classList.remove('active');
    }

    // ─── TTS ─────────────────────────────────────────────

    _speakText(text) {
        if (!window.speechSynthesis) return;
        
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // Take first 500 chars for speech
        const speechText = text.replace(/<[^>]*>/g, '').substring(0, 500);
        if (!speechText) return;
        
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = 'zh-CN';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }

    // ─── Settings ─────────────────────────────────────────

    _loadSettings() {
        try {
            const saved = localStorage.getItem('voicelens-settings');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    }

    _saveSettings() {
        const el = this.elements;
        const settings = {
            provider: el.providerSelect.value,
            apiKey: el.apiKeyInput.value,
            baseUrl: el.baseUrlInput.value,
            model: el.modelInput.value,
            temperature: el.temperatureRange.value,
            systemPrompt: el.systemPromptInput.value,
            ttsEnabled: el.ttsToggle.checked,
        };
        
        localStorage.setItem('voicelens-settings', JSON.stringify(settings));
        this.settings = settings;
        this.ttsEnabled = settings.ttsEnabled;
        
        // Show user feedback
        this._showToast('✅ 设置已保存');
        this._closeSettings();
    }

    _applySettingsToUI(apiConfig) {
        if (apiConfig.provider) {
            this.elements.providerSelect.value = apiConfig.provider;
        }
        if (apiConfig.model) {
            this.elements.modelInput.value = apiConfig.model;
        }
    }

    _openSettings() {
        const el = this.elements;
        
        // Load saved settings into UI
        el.providerSelect.value = this.settings.provider || 'zhipu';
        el.apiKeyInput.value = this.settings.apiKey || '';
        el.baseUrlInput.value = this.settings.baseUrl || '';
        el.modelInput.value = this.settings.model || '';
        el.temperatureRange.value = this.settings.temperature || 0.7;
        el.tempValue.textContent = el.temperatureRange.value;
        el.systemPromptInput.value = this.settings.systemPrompt || '';
        el.ttsToggle.checked = this.settings.ttsEnabled !== false;
        
        el.settingsModal.classList.add('active');
    }

    _closeSettings() {
        this.elements.settingsModal.classList.remove('active');
    }

    _resetSettings() {
        localStorage.removeItem('voicelens-settings');
        this.settings = {};
        this.elements.providerSelect.value = 'zhipu';
        this.elements.apiKeyInput.value = '';
        this.elements.baseUrlInput.value = '';
        this.elements.modelInput.value = '';
        this.elements.temperatureRange.value = '0.7';
        this.elements.tempValue.textContent = '0.7';
        this.elements.systemPromptInput.value = '';
        this.elements.ttsToggle.checked = true;
        this._showToast('🔄 设置已重置');
    }

    // ─── Chat Management ─────────────────────────────────

    _newChat() {
        this.sessionId = this._generateId();
        this.elements.chatContainer.innerHTML = `
            <div class="welcome-screen" id="welcomeScreen">
                <div class="welcome-icon">🎙️</div>
                <h2>欢迎使用 VoiceLens-Web</h2>
                <p class="welcome-desc">轻量级语音交互AI助手，支持GLM-5.1等多款大模型</p>
                <div class="welcome-features">
                    <div class="feature-card"><span class="feature-icon">🎤</span><span class="feature-text">语音输入</span></div>
                    <div class="feature-card"><span class="feature-icon">🤖</span><span class="feature-text">智能对话</span></div>
                    <div class="feature-card"><span class="feature-icon">🔊</span><span class="feature-text">语音朗读</span></div>
                    <div class="feature-card"><span class="feature-icon">🌐</span><span class="feature-text">多模型支持</span></div>
                </div>
                <p class="welcome-tip">💡 点击麦克风按钮开始语音输入，或直接打字发送消息</p>
            </div>
        `;
        this.elements.welcomeScreen = document.getElementById('welcomeScreen');
    }

    _clearChat() {
        if (!confirm('确定要清空当前对话吗？')) return;
        
        // Remove all messages except welcome screen
        const messages = this.elements.chatContainer.querySelectorAll('.message, .typing-indicator');
        messages.forEach(el => el.remove());
        
        // Show welcome screen if hidden
        this.elements.welcomeScreen.style.display = '';
    }

    // ─── Toast ────────────────────────────────────────────

    _showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
            background: var(--bg-tertiary); color: var(--text-primary);
            padding: 10px 20px; border-radius: var(--radius-sm);
            border: 1px solid var(--border-color);
            font-size: 14px; z-index: 3000;
            box-shadow: var(--shadow); animation: messageIn 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// ─── Initialize ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    new VoiceLensApp();
});