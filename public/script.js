// ========================================
// قيس Chat - WhatsApp Mobile (API)
// ========================================
(function () {
    'use strict';

    const $ = (s) => document.querySelector(s);
    const chatBody = $('#chatBody');
    const messageInput = $('#messageInput');
    const sendBtn = $('#sendBtn');
    const typing = $('#typingIndicator');
    const status = $('#profileStatus');
    const emojiBtn = $('#emojiBtn');
    const emojiPicker = $('#emojiPicker');
    const splash = $('#splashScreen');

    let history = [];
    let busy = false;
    let lastSender = null;

    // ---- Init ----
    function init() {
        events();
        setTimeout(() => {
            splash.classList.add('hidden');
            setTimeout(greet, 300);
        }, 2000);
    }

    // ---- Greeting ----
    async function greet() {
        showTyping();
        const h = new Date().getHours();
        let ctx;
        if (h >= 5 && h < 12) ctx = 'شادية فتحت المحادثة الصبح. حييها صباح الخير.';
        else if (h < 17) ctx = 'شادية فتحت المحادثة بعد الظهر. سلم عليها.';
        else if (h < 21) ctx = 'شادية فتحت المحادثة المسا. حييها مساء الخير.';
        else ctx = 'شادية فتحت المحادثة بالليل. سلم عليها واسألها ليش سهرانة.';

        try {
            const r = await api([{ role: 'user', content: ctx }]);
            hideTyping();
            addMsg(r, 'in');
        } catch {
            hideTyping();
            addMsg('هلا بعيوني شادية 💜 كيفك يا قلبي؟', 'in');
        }
    }

    // ---- API ----
    async function api(msgs) {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: msgs }),
        });
        if (!res.ok) throw new Error('API error');
        return (await res.json()).reply;
    }

    // ---- Events ----
    function events() {
        sendBtn.addEventListener('click', send);
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
        });
        messageInput.addEventListener('input', () => {
            messageInput.style.height = 'auto';
            messageInput.style.height = Math.min(messageInput.scrollHeight, 100) + 'px';
        });
        emojiBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            emojiPicker.classList.toggle('active');
        });
        document.querySelectorAll('.wa-egrid span').forEach(e => {
            e.addEventListener('click', () => {
                messageInput.value += e.textContent;
                messageInput.focus();
                emojiPicker.classList.remove('active');
            });
        });
        document.addEventListener('click', (e) => {
            if (!emojiPicker.contains(e.target) && e.target !== emojiBtn)
                emojiPicker.classList.remove('active');
        });
    }

    // ---- Send ----
    async function send() {
        const t = messageInput.value.trim();
        if (!t || busy) return;

        addMsg(t, 'out');
        messageInput.value = '';
        messageInput.style.height = 'auto';
        history.push({ role: 'user', content: t });
        showTyping();

        try {
            const r = await api(history);
            hideTyping();
            addMsg(r, 'in');
            history.push({ role: 'assistant', content: r });
            if (history.length > 30) history = history.slice(-30);
        } catch {
            hideTyping();
            addMsg('حصل خطأ يا قلبي 🥺 حاولي مرة تانية 💜', 'in');
        }
    }

    // ---- Add Message ----
    function addMsg(text, type) {
        const isGap = lastSender !== type;
        lastSender = type;

        const row = document.createElement('div');
        row.className = 'wa-row ' + type;
        if (isGap) row.classList.add('gap');

        const bbl = document.createElement('div');
        bbl.className = 'wa-bbl ' + type;

        const txt = document.createElement('span');
        txt.className = 'wa-txt';
        txt.textContent = text;
        bbl.appendChild(txt);

        // Meta
        const meta = document.createElement('span');
        meta.className = 'wa-meta';

        const time = document.createElement('span');
        time.className = 'wa-time';
        time.textContent = new Date().toLocaleTimeString('ar-EG', {
            hour: '2-digit', minute: '2-digit', hour12: true
        });
        meta.appendChild(time);

        if (type === 'out') {
            const ticks = document.createElement('span');
            ticks.className = 'wa-ticks read';
            ticks.innerHTML = '<svg viewBox="0 0 16 11"><path d="M11.07.66L4.88 7.06 2.91 4.98 1.5 6.4l3.38 3.48L12.48 2.07zM14.07.66L7.88 7.06l-.75-.78L5.72 7.7l2.16 2.18L15.48 2.07z" fill="currentColor"/></svg>';
            meta.appendChild(ticks);
        }

        bbl.appendChild(meta);

        // Tail
        if (isGap) {
            const tail = document.createElement('div');
            tail.className = 'wa-tail ' + type;
            bbl.appendChild(tail);
        }

        row.appendChild(bbl);
        chatBody.insertBefore(row, typing);
        scroll();
    }

    // ---- Typing ----
    function showTyping() {
        busy = true;
        typing.style.display = 'flex';
        status.textContent = 'يكتب...';
        status.className = 'wa-status typing';
        scroll();
    }

    function hideTyping() {
        busy = false;
        typing.style.display = 'none';
        status.textContent = 'متصل';
        status.className = 'wa-status online';
    }

    function scroll() {
        requestAnimationFrame(() => chatBody.scrollTop = chatBody.scrollHeight);
    }

    init();
})();
