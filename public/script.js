// ========================================
// قيس Chat - WhatsApp-Style (API-Connected)
// ========================================

(function () {
    'use strict';

    // ========================================
    // DOM
    // ========================================
    const chatBody = document.getElementById('chatBody');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const typingIndicator = document.getElementById('typingIndicator');
    const profileStatus = document.getElementById('profileStatus');
    const emojiBtn = document.getElementById('emojiBtn');
    const emojiPicker = document.getElementById('emojiPicker');
    const splashScreen = document.getElementById('splashScreen');

    // ========================================
    // State
    // ========================================
    let conversationHistory = [];
    let isTyping = false;
    let lastSender = null; // Track for grouping bubbles

    // ========================================
    // Init
    // ========================================
    function init() {
        setupEventListeners();
        handleSplash();
    }

    function handleSplash() {
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            setTimeout(() => sendInitialGreeting(), 300);
        }, 2000);
    }

    // ========================================
    // Initial Greeting via API
    // ========================================
    async function sendInitialGreeting() {
        showTyping();

        const hour = new Date().getHours();
        let context;
        if (hour >= 5 && hour < 12) {
            context = 'شادية فتحت المحادثة الصبح. ابدأ بتحييها صباح الخير بأسلوبك.';
        } else if (hour >= 12 && hour < 17) {
            context = 'شادية فتحت المحادثة بعد الظهر. سلم عليها واسألها عن يومها.';
        } else if (hour >= 17 && hour < 21) {
            context = 'شادية فتحت المحادثة المسا. حييها مساء الخير بحب.';
        } else {
            context = 'شادية فتحت المحادثة بالليل. سلم عليها واسألها ليش سهرانة.';
        }

        try {
            const reply = await callChatAPI([{ role: 'user', content: context }]);
            hideTyping();
            addMessage(reply, 'received');
        } catch (err) {
            hideTyping();
            addMessage('هلا بعيوني شادية 💜 كيفك يا قلبي؟', 'received');
        }
    }

    // ========================================
    // API
    // ========================================
    async function callChatAPI(messages) {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'خطأ بالاتصال');
        }

        const data = await res.json();
        return data.reply;
    }

    // ========================================
    // Events
    // ========================================
    function setupEventListeners() {
        sendBtn.addEventListener('click', handleSend);

        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        });

        messageInput.addEventListener('input', autoResize);

        emojiBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            emojiPicker.classList.toggle('active');
        });

        document.querySelectorAll('.wa-emoji').forEach(item => {
            item.addEventListener('click', () => {
                messageInput.value += item.textContent;
                messageInput.focus();
                emojiPicker.classList.remove('active');
                autoResize();
            });
        });

        document.addEventListener('click', (e) => {
            if (!emojiPicker.contains(e.target) && e.target !== emojiBtn) {
                emojiPicker.classList.remove('active');
            }
        });
    }

    function autoResize() {
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
    }

    // ========================================
    // Send Message
    // ========================================
    async function handleSend() {
        const text = messageInput.value.trim();
        if (!text || isTyping) return;

        addMessage(text, 'sent');
        messageInput.value = '';
        messageInput.style.height = 'auto';

        conversationHistory.push({ role: 'user', content: text });

        showTyping();

        try {
            const reply = await callChatAPI(conversationHistory);
            hideTyping();
            addMessage(reply, 'received');
            conversationHistory.push({ role: 'assistant', content: reply });

            if (conversationHistory.length > 30) {
                conversationHistory = conversationHistory.slice(-30);
            }
        } catch (err) {
            hideTyping();
            addMessage('حصل خطأ يا قلبي 🥺 حاولي مرة تانية 💜', 'received');
        }
    }

    // ========================================
    // Add Message to DOM
    // ========================================
    function addMessage(text, type) {
        const isFirstInGroup = lastSender !== type;
        lastSender = type;

        const row = document.createElement('div');
        row.className = `wa-message-row ${type}`;
        if (isFirstInGroup) row.classList.add('first-in-group');

        const bubble = document.createElement('div');
        bubble.className = `wa-bubble wa-bubble-${type}`;

        // Message text
        const msgText = document.createElement('span');
        msgText.className = 'wa-msg-text';
        msgText.textContent = text;
        bubble.appendChild(msgText);

        // Meta (time + ticks)
        const meta = document.createElement('span');
        meta.className = 'wa-msg-meta';

        const time = document.createElement('span');
        time.className = 'wa-msg-time';
        const now = new Date();
        time.textContent = now.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        meta.appendChild(time);

        // Double ticks for sent messages
        if (type === 'sent') {
            const ticks = document.createElement('span');
            ticks.className = 'wa-ticks read';
            ticks.innerHTML = `<svg viewBox="0 0 16 11"><path d="M11.07 0.66L4.88 7.06L2.91 4.98L1.5 6.4L4.88 9.88L12.48 2.07L11.07 0.66Z" fill="currentColor"/><path d="M14.07 0.66L7.88 7.06L7.13 6.28L5.72 7.7L7.88 9.88L15.48 2.07L14.07 0.66Z" fill="currentColor"/></svg>`;
            meta.appendChild(ticks);
        }

        bubble.appendChild(meta);

        // Tail (only for first message in group)
        if (isFirstInGroup) {
            const tail = document.createElement('div');
            tail.className = type === 'sent' ? 'wa-bubble-tail-sent' : 'wa-bubble-tail-received';
            bubble.appendChild(tail);
        }

        row.appendChild(bubble);

        // Insert before typing indicator
        chatBody.insertBefore(row, typingIndicator);
        scrollToBottom();
    }

    // ========================================
    // Typing Indicator
    // ========================================
    function showTyping() {
        isTyping = true;
        typingIndicator.style.display = 'flex';
        profileStatus.textContent = 'يكتب...';
        profileStatus.className = 'wa-contact-status typing';
        scrollToBottom();
    }

    function hideTyping() {
        isTyping = false;
        typingIndicator.style.display = 'none';
        profileStatus.textContent = 'متصل';
        profileStatus.className = 'wa-contact-status online';
    }

    function scrollToBottom() {
        requestAnimationFrame(() => {
            chatBody.scrollTop = chatBody.scrollHeight;
        });
    }

    // ========================================
    // Go!
    // ========================================
    init();

})();
