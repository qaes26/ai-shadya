// ===================================================================
// WebCraft AI ⚡ Client Application Script
// ===================================================================

(function () {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================
    const chatForm = document.getElementById('chatForm');
    const promptInput = document.getElementById('promptInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const suggestionsContainer = document.getElementById('suggestionsContainer');

    const livePreviewIframe = document.getElementById('livePreviewIframe');
    const previewFrameContainer = document.getElementById('previewFrameContainer');
    const generatingOverlay = document.getElementById('generatingOverlay');
    const generatingStatusText = document.getElementById('generatingStatusText');
    const reloadPreviewBtn = document.getElementById('reloadPreviewBtn');
    const screenSizeTag = document.getElementById('screenSizeTag');
    const browserUrlText = document.getElementById('browserUrlText');

    const viewModePreview = document.getElementById('viewModePreview');
    const viewModeCode = document.getElementById('viewModeCode');
    const codeEditorContainer = document.getElementById('codeEditorContainer');
    const codeTextarea = document.getElementById('codeTextarea');
    const runCodeChangesBtn = document.getElementById('runCodeChangesBtn');
    const copyCodeEditorBtn = document.getElementById('copyCodeEditorBtn');

    const deviceSwitcher = document.getElementById('deviceSwitcher');
    const mobileTabs = document.getElementById('mobileTabs');
    const previewBadge = document.getElementById('previewBadge');

    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const downloadHtmlBtn = document.getElementById('downloadHtmlBtn');
    const openExternalBtn = document.getElementById('openExternalBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const newChatBtn = document.getElementById('newChatBtn');

    const templatesBtn = document.getElementById('templatesBtn');
    const templatesModal = document.getElementById('templatesModal');
    const closeTemplatesModal = document.getElementById('closeTemplatesModal');
    const templatesGrid = document.getElementById('templatesGrid');
    const toastContainer = document.getElementById('toastContainer');

    // ========================================
    // Default Starter Website (Loaded in preview on launch)
    // ========================================
    const DEFAULT_SHOWCASE_HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebCraft AI Studio Showcase</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        :root {
            --bg-body: #0b0f19;
            --primary: #6366f1;
            --primary-gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
            --card-bg: rgba(22, 29, 45, 0.7);
            --border: rgba(255, 255, 255, 0.1);
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background-color: var(--bg-body);
            background-image: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%);
            color: var(--text-main);
            font-family: 'Cairo', sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
        }
        header {
            padding: 20px 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--border);
            backdrop-filter: blur(10px);
        }
        .logo {
            font-size: 1.4rem;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 10px;
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .badge {
            background: rgba(99, 102, 241, 0.2);
            border: 1px solid rgba(99, 102, 241, 0.4);
            color: #818cf8;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        .hero {
            padding: 60px 20px 40px;
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
        }
        .hero h1 {
            font-size: 2.8rem;
            font-weight: 900;
            line-height: 1.2;
            margin-bottom: 16px;
        }
        .hero h1 span {
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .hero p {
            font-size: 1.15rem;
            color: var(--text-muted);
            margin-bottom: 30px;
            line-height: 1.6;
        }
        .cta-btn {
            background: var(--primary-gradient);
            border: none;
            color: #fff;
            padding: 12px 28px;
            border-radius: 12px;
            font-family: 'Cairo', sans-serif;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .cta-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(99, 102, 241, 0.6);
        }
        .interactive-section {
            max-width: 900px;
            margin: 20px auto 60px;
            padding: 0 20px;
            width: 100%;
        }
        .grid-features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 24px;
            backdrop-filter: blur(12px);
            transition: all 0.3s ease;
        }
        .card:hover {
            border-color: var(--primary);
            transform: translateY(-4px);
        }
        .card-icon {
            width: 46px;
            height: 46px;
            border-radius: 12px;
            background: rgba(99, 102, 241, 0.15);
            color: #818cf8;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            margin-bottom: 14px;
        }
        .card h3 {
            font-size: 1.1rem;
            margin-bottom: 8px;
        }
        .card p {
            font-size: 0.9rem;
            color: var(--text-muted);
            line-height: 1.5;
        }
        .live-counter-box {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            max-width: 480px;
            margin: 0 auto;
        }
        .counter-val {
            font-size: 3rem;
            font-weight: 900;
            color: #818cf8;
            margin: 10px 0;
        }
        .counter-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
        }
        .counter-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid var(--border);
            color: #fff;
            padding: 8px 18px;
            border-radius: 8px;
            font-family: 'Cairo', sans-serif;
            font-weight: 700;
            cursor: pointer;
            transition: 0.2s;
        }
        .counter-btn:hover {
            background: var(--primary);
        }
        footer {
            margin-top: auto;
            text-align: center;
            padding: 24px;
            font-size: 0.85rem;
            color: var(--text-muted);
            border-top: 1px solid var(--border);
        }
    </style>
</head>
<body>
    <header>
        <div class="logo">
            <i class="fa-solid fa-bolt-lightning"></i>
            <span>WebCraft Studio</span>
        </div>
        <div class="badge">
            <i class="fa-solid fa-circle-check"></i> شاشة العرض الحية جاهزة
        </div>
    </header>

    <main class="hero">
        <h1>اصنع أي موقع تتخيله <br><span>بالذكاء الاصطناعي فوراً</span></h1>
        <p>هذه هي شاشة المعاينة الحية! اكتب فكرتك في لوحة المحادثة على اليمين وشاهد كيف يتحول كلامك إلى موقع تفاعلي كامل بدقائق.</p>
        <button class="cta-btn" onclick="alert('⚡ رائع! اطلب أي موقع تريده من لوحة الشات وسأقوم ببرمجته فوراً.')">
            <i class="fa-solid fa-wand-magic-sparkles"></i> جرّب التفاعل الحي
        </button>
    </main>

    <section class="interactive-section">
        <div class="grid-features">
            <div class="card">
                <div class="card-icon"><i class="fa-solid fa-mobile-screen"></i></div>
                <h3>متجاوب تماماً مع الهواتف</h3>
                <p>جميع المواقع التي يتم إنشاؤها تدعم مختلف مقاسات الهواتف والأجهزة اللوحية والشاشات الكبيرة تلقائياً.</p>
            </div>
            <div class="card">
                <div class="card-icon"><i class="fa-solid fa-code"></i></div>
                <h3>كود برمجي نظيف وقابل للتعديل</h3>
                <p>HTML5, CSS3, و JavaScript مدمجة في ملف واحد يمكنك نسخه أو تحميله أو تعديله وتشغيله فوراً.</p>
            </div>
            <div class="card">
                <div class="card-icon"><i class="fa-solid fa-bolt"></i></div>
                <h3>محرك فائق السرعة</h3>
                <p>مدعوم بنموذج Groq 120B Coder فائق الذكاء لإنشاء واجهات دقيقة وجميلة في ثوانٍ معدودة.</p>
            </div>
        </div>

        <div class="live-counter-box">
            <h3>عداد تفاعلي تجريبي</h3>
            <div class="counter-val" id="demoCounter">0</div>
            <div class="counter-actions">
                <button class="counter-btn" onclick="updateCounter(1)">+ زيادة</button>
                <button class="counter-btn" onclick="updateCounter(-1)">- إنقاص</button>
                <button class="counter-btn" onclick="resetCounter()">تصفير</button>
            </div>
        </div>
    </section>

    <footer>
        تم التوليد والتطوير بواسطة WebCraft AI ⚡
    </footer>

    <script>
        let count = 0;
        function updateCounter(val) {
            count += val;
            document.getElementById('demoCounter').innerText = count;
        }
        function resetCounter() {
            count = 0;
            document.getElementById('demoCounter').innerText = count;
        }
    </script>
</body>
</html>`;

    // ========================================
    // State
    // ========================================
    let conversationHistory = [];
    let currentCode = DEFAULT_SHOWCASE_HTML;
    let isGenerating = false;
    let currentDevice = 'desktop'; // 'desktop' | 'tablet' | 'mobile'
    let currentViewMode = 'preview'; // 'preview' | 'code'
    let statusInterval = null;

    // Loading status cycling messages
    const loadingStatusMessages = [
        '⚙️ جاري تحليل الفكرة وتصميم المعمارية البرمجية...',
        '🎨 بناء هيكل HTML وتنسيقات CSS العصرية...',
        '⚡ كتابة الوظائف التفاعلية بـ JavaScript...',
        '📱 ضبط التجاوب الكامل مع الهواتف والشاشات...',
        '🚀 تجميع الكود وتحديث شاشة العرض الحية...'
    ];

    // ========================================
    // Toast Notification
    // ========================================
    function showToast(message, icon = 'fa-circle-check') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ========================================
    // Render HTML in Live Preview Iframe
    // ========================================
    function renderPreview(htmlContent) {
        if (!htmlContent) return;
        currentCode = htmlContent;
        codeTextarea.value = htmlContent;

        try {
            livePreviewIframe.srcdoc = htmlContent;
        } catch (e) {
            console.error('Error rendering iframe:', e);
        }
    }

    // ========================================
    // Device Switcher
    // ========================================
    function setDeviceMode(mode) {
        currentDevice = mode;
        previewFrameContainer.classList.remove('mode-desktop', 'mode-tablet', 'mode-mobile');
        previewFrameContainer.classList.add(`mode-${mode}`);

        // Update switcher buttons
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.device === mode);
        });

        // Update size tag
        if (mode === 'desktop') {
            screenSizeTag.textContent = '100%';
        } else if (mode === 'tablet') {
            screenSizeTag.textContent = '768px';
        } else if (mode === 'mobile') {
            screenSizeTag.textContent = '375px';
        }
    }

    // ========================================
    // View Mode Toggle (Preview vs Code)
    // ========================================
    function setViewMode(mode) {
        currentViewMode = mode;
        if (mode === 'preview') {
            viewModePreview.classList.add('active');
            viewModeCode.classList.remove('active');
            previewFrameContainer.style.display = 'flex';
            codeEditorContainer.classList.add('hidden');
        } else {
            viewModePreview.classList.remove('active');
            viewModeCode.classList.add('active');
            previewFrameContainer.style.display = 'none';
            codeEditorContainer.classList.remove('hidden');
            codeTextarea.value = currentCode;
        }
    }

    // ========================================
    // Mobile Tab Navigation
    // ========================================
    function setMobileTab(tab) {
        document.body.classList.remove('tab-chat', 'tab-preview', 'tab-code');
        document.body.classList.add(`tab-${tab}`);

        document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        if (tab === 'preview') {
            previewBadge.classList.remove('visible');
            setViewMode('preview');
        } else if (tab === 'code') {
            setViewMode('code');
        }
    }

    // ========================================
    // Markdown-like Text Formatter for Chat
    // ========================================
    function formatMessageContent(rawText) {
        // Remove the ```html ... ``` block from the chat bubble to keep chat clean,
        // because the code is rendered in the live preview and code editor!
        let cleanText = rawText.replace(/```html[\s\S]*?```/gi, '');
        
        // Escape basic HTML
        let escaped = cleanText
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Bold formatting
        escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Bullet points
        escaped = escaped.replace(/^[•\-\*]\s*(.+)$/gm, '<li>$1</li>');
        escaped = escaped.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // Newlines to paragraphs / breaks
        const paragraphs = escaped.split(/\n\n+/).filter(Boolean);
        if (paragraphs.length > 0) {
            return paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
        }
        return `<p>${escaped.replace(/\n/g, '<br>')}</p>`;
    }

    // Append a message to chat UI
    function appendMessage(role, text, codeBlock = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;

        const isAssistant = role === 'assistant';
        const avatarIcon = isAssistant ? '<i class="fa-solid fa-bolt-lightning"></i>' : '<i class="fa-solid fa-user"></i>';
        const authorName = isAssistant ? 'WebCraft AI • مطور الويب' : 'أنت';

        let innerHTML = `
            <div class="message-avatar">${avatarIcon}</div>
            <div class="message-body">
                <div class="message-author">${authorName}</div>
                <div class="message-content">
                    ${formatMessageContent(text)}
                </div>
        `;

        // If code was generated, add an action card to the bubble
        if (codeBlock) {
            innerHTML += `
                <div class="code-action-card">
                    <div class="card-header-row">
                        <span class="card-title"><i class="fa-solid fa-code"></i> تم تحديث واجهة الموقع</span>
                        <span class="card-badge"><i class="fa-solid fa-check"></i> جاهز للمعاينة</span>
                    </div>
                    <div class="card-actions-row">
                        <button class="card-btn preview-btn" data-action="preview">
                            <i class="fa-solid fa-display"></i> عرض في المعاينة
                        </button>
                        <button class="card-btn copy-btn" data-action="copy">
                            <i class="fa-regular fa-copy"></i> نسخ الكود
                        </button>
                    </div>
                </div>
            `;
        }

        innerHTML += `</div>`;
        messageDiv.innerHTML = innerHTML;

        // Card button actions
        if (codeBlock) {
            const previewBtn = messageDiv.querySelector('[data-action="preview"]');
            const copyBtn = messageDiv.querySelector('[data-action="copy"]');

            if (previewBtn) {
                previewBtn.addEventListener('click', () => {
                    renderPreview(codeBlock);
                    setViewMode('preview');
                    if (window.innerWidth <= 900) {
                        setMobileTab('preview');
                    }
                });
            }

            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(codeBlock).then(() => {
                        showToast('تم نسخ الكود البرمجي بنجاح!');
                    });
                });
            }
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ========================================
    // Status Overlay Animations
    // ========================================
    function startLoadingAnimation() {
        generatingOverlay.classList.add('active');
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

        let stepIndex = 0;
        generatingStatusText.textContent = loadingStatusMessages[0];
        statusInterval = setInterval(() => {
            stepIndex = (stepIndex + 1) % loadingStatusMessages.length;
            generatingStatusText.textContent = loadingStatusMessages[stepIndex];
        }, 2200);
    }

    function stopLoadingAnimation() {
        generatingOverlay.classList.remove('active');
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        if (statusInterval) {
            clearInterval(statusInterval);
            statusInterval = null;
        }
    }

    // ========================================
    // Send Prompt & Generate Code
    // ========================================
    async function handleSendPrompt(customPrompt = null) {
        const text = customPrompt || promptInput.value.trim();
        if (!text || isGenerating) return;

        promptInput.value = '';
        promptInput.style.height = 'auto';

        // Add to history and UI
        conversationHistory.push({ role: 'user', content: text });
        appendMessage('user', text);

        isGenerating = true;
        startLoadingAnimation();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: conversationHistory })
            });

            if (!response.ok) {
                throw new Error(`خطأ في السيرفر: ${response.status}`);
            }

            const data = await response.json();
            const reply = data.reply;
            const code = data.code;

            conversationHistory.push({ role: 'assistant', content: reply });
            appendMessage('assistant', reply, code);

            if (code) {
                renderPreview(code);
                showToast('🚀 تم تحديث واجهة الموقع بنجاح!');
                
                // Show notification badge on mobile
                if (window.innerWidth <= 900) {
                    previewBadge.classList.add('visible');
                    // Automatically switch to live preview on mobile so the user instantly sees the site!
                    setMobileTab('preview');
                }
            }

        } catch (error) {
            console.error('Error generating code:', error);
            appendMessage('assistant', `⚠️ عذراً، حدث خطأ أثناء معالجة الطلب: ${error.message}. يرجى المحاولة مرة أخرى.`);
            showToast('حدث خطأ في الاتصال، حاول ثانية', 'fa-triangle-exclamation');
        } finally {
            isGenerating = false;
            stopLoadingAnimation();
        }
    }

    // ========================================
    // Event Listeners
    // ========================================

    // Chat form submit
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSendPrompt();
    });

    // Auto-grow textarea & Enter hotkey
    promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendPrompt();
        }
    });

    promptInput.addEventListener('input', () => {
        promptInput.style.height = 'auto';
        promptInput.style.height = Math.min(promptInput.scrollHeight, 140) + 'px';
    });

    // Suggestions chips
    if (suggestionsContainer) {
        suggestionsContainer.addEventListener('click', (e) => {
            const chip = e.target.closest('.suggestion-chip');
            if (chip && chip.dataset.prompt) {
                handleSendPrompt(chip.dataset.prompt);
            }
        });
    }

    // Device switcher (Desktop/Tablet/Mobile)
    if (deviceSwitcher) {
        deviceSwitcher.addEventListener('click', (e) => {
            const btn = e.target.closest('.device-btn');
            if (btn && btn.dataset.device) {
                setDeviceMode(btn.dataset.device);
            }
        });
    }

    // View mode toggles
    viewModePreview.addEventListener('click', () => setViewMode('preview'));
    viewModeCode.addEventListener('click', () => setViewMode('code'));

    // Mobile tabs
    if (mobileTabs) {
        mobileTabs.addEventListener('click', (e) => {
            const btn = e.target.closest('.mobile-tab-btn');
            if (btn && btn.dataset.tab) {
                setMobileTab(btn.dataset.tab);
            }
        });
    }

    // Run Code Changes button in Code editor
    runCodeChangesBtn.addEventListener('click', () => {
        const editedCode = codeTextarea.value;
        renderPreview(editedCode);
        setViewMode('preview');
        showToast('تم تطبيق تعديلات الكود على المعاينة الحية!');
    });

    // Copy Code Buttons
    copyCodeBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(currentCode).then(() => {
            showToast('تم نسخ الكود البرمجي بالكامل!');
        });
    });

    copyCodeEditorBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(codeTextarea.value).then(() => {
            showToast('تم نسخ كود المحرر!');
        });
    });

    // Download HTML File
    downloadHtmlBtn.addEventListener('click', () => {
        const blob = new Blob([currentCode], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `webcraft-site-${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('تم بدء تحميل ملف HTML بنجاح! 📥');
    });

    // Open External in new tab
    openExternalBtn.addEventListener('click', () => {
        const blob = new Blob([currentCode], { type: 'text/html;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
    });

    // Reload Preview iframe
    reloadPreviewBtn.addEventListener('click', () => {
        livePreviewIframe.srcdoc = currentCode;
        showToast('تم تحديث شاشة العرض الحية');
    });

    // Fullscreen Preview
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            previewFrameContainer.requestFullscreen().catch(err => {
                console.error('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen();
        }
    });

    // New Chat / Reset
    newChatBtn.addEventListener('click', () => {
        if (confirm('هل تريد بدء مشروع ومحادثة جديدة؟')) {
            conversationHistory = [];
            chatMessages.innerHTML = '';
            
            // Re-render welcome message
            const welcome = document.createElement('div');
            welcome.className = 'message assistant-message';
            welcome.innerHTML = `
                <div class="message-avatar"><i class="fa-solid fa-bolt-lightning"></i></div>
                <div class="message-body">
                    <div class="message-author">WebCraft AI • مهندس الويب الذكي</div>
                    <div class="message-content">
                        <p>مشروع جديد بدأ! ✨ اطلب أي موقع، واجهة، صفحة هبوط، أو لعبة وسأقوم ببرمجتها فوراً.</p>
                    </div>
                </div>
            `;
            chatMessages.appendChild(welcome);
            renderPreview(DEFAULT_SHOWCASE_HTML);
            showToast('تم إعادة تعيين المشروع بنجاح');
        }
    });

    // ========================================
    // Templates Modal
    // ========================================
    async function loadTemplates() {
        try {
            const res = await fetch('/api/templates');
            const data = await res.json();
            templatesGrid.innerHTML = '';

            data.templates.forEach(t => {
                const card = document.createElement('div');
                card.className = 'template-card';
                card.innerHTML = `
                    <div class="template-card-header">
                        <span class="template-card-title">${t.title}</span>
                        <span class="template-card-category">${t.category}</span>
                    </div>
                    <div class="template-card-desc">${t.prompt}</div>
                    <div class="template-card-btn">
                        <span>إنشاء هذا الموقع</span> <i class="fa-solid fa-arrow-left"></i>
                    </div>
                `;
                card.addEventListener('click', () => {
                    templatesModal.classList.remove('open');
                    handleSendPrompt(t.prompt);
                });
                templatesGrid.appendChild(card);
            });
        } catch (e) {
            console.error('Error loading templates:', e);
        }
    }

    templatesBtn.addEventListener('click', () => {
        templatesModal.classList.add('open');
        loadTemplates();
    });

    closeTemplatesModal.addEventListener('click', () => {
        templatesModal.classList.remove('open');
    });

    templatesModal.addEventListener('click', (e) => {
        if (e.target === templatesModal) {
            templatesModal.classList.remove('open');
        }
    });

    // ========================================
    // Initialization
    // ========================================
    function init() {
        setDeviceMode('desktop');
        renderPreview(DEFAULT_SHOWCASE_HTML);

        // Set default mobile tab if on phone
        if (window.innerWidth <= 900) {
            setMobileTab('chat');
        }
    }

    init();
})();
