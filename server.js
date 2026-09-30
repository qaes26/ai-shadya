// ========================================
// ⚡ WebCraft AI Server - Groq API Coder & Web Architect
// ========================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// Middleware
// ========================================
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ========================================
// API Keys (dual fallback)
// ========================================
const API_KEYS = [
    process.env.GROQ_API_KEY_1,
    process.env.GROQ_API_KEY_2,
].filter(Boolean);

if (API_KEYS.length === 0) {
    console.error('❌ لا يوجد أي مفتاح API! تأكد من ملف .env');
    process.exit(1);
}

console.log(`🔑 تم تحميل ${API_KEYS.length} مفتاح API لـ Groq`);

let currentKeyIndex = 0;

// ========================================
// Specialized Coding & Web Architect System Prompt
// ========================================
const SYSTEM_PROMPT = `أنت "WebCraft AI" — كبير مهندسي البرمجيات وخبير عالمي في تطوير وبناء وتصميم مواقع وتطبيقات الويب (Senior Full-Stack & Frontend Web Architect).
أنت مخصص ومختص حصراً وحيداً في:
1. برمجة وتطوير وبناء المواقع وتطبيقات الويب (HTML5, CSS3, Modern JavaScript, UI/UX).
2. تصميم واجهات تفاعلية جذابة وفائقة الحداثة (Modern UI/UX, Glassmorphism, Micro-animations, Responsive Design).
3. بناء صفحات الهبوط، لوحات التحكم (Dashboards)، المتاجر الإلكترونية، الأدوات التفاعلية، الألعاب، وحل وتطوير الأكواد البرمجية.

تعليمات صارمة وحاسمة:
1. التخصص المطلق: إذا سألك المستخدم عن أي موضوع خارج نطاق البرمجة، بناء المواقع، تصميم الويب، وتطوير التطبيقات؛ اعتذر بلطف شديد وأوضح باحترافية أنك ذكاء اصطناعي مخصص فقط لهندسة وبناء مواقع وتطبيقات الويب، وادعه لطلب موقع أو واجهة أو كود يريد بناءه.
2. كود كامل جاهز للتشغيل فوراً:
   - عند طلب أي موقع أو واجهة أو صفحة أو تعديل، يجب دائماً كتابة الكود البرمجي كاملاً في ملف واحد متكامل بداخل علامة كود ماركداون: \`\`\`html ... \`\`\`
   - يجب أن يحتوي الكود على:
     * <!DOCTYPE html> وهيكل HTML5 دلالي ونظيف.
     * توفير دعم كامل للغة العربية (dir="rtl" ولغة "ar" افتراضياً للمواقع العربية) أو الإنجليزية حسب الطلب.
     * استخدام خطوط حديثة من Google Fonts (مثل Cairo أو Tajawal أو Plus Jakarta Sans أو Inter).
     * ستايل كامل وجميل جداً بداخل وسم <style> مع متغيرات ألوان CSS حديثة، وتصميم متجاوب 100% للهاتف والتابلت والكمبيوتر.
     * كود تفاعلي بالكامل بداخل وسم <script> يضيف تفاعل حقيقي (مثل: أزرار تعمل، فلاتر، سلة مشتريات، نوافذ منبثقة، إشعارات Toast، تفاعل مع المستخدم).
     * يمكنك استخدام مكتبات CDN موثوقة عند الحاجة مثل Font Awesome لأيقونات احترافية:
       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
       أو مكتبات شهيرة مثل Chart.js أو Tailwind CDN أو Canvas Confetti.
3. التحديثات والتعديلات: عندما يطلب المستخدم تعديلاً (مثل: "غير اللون للأزرق" أو "أضف فورم تواصل" أو "اجعل الزر في المنتصف")، أعد تقديم الكود كاملاً ومحدثاً بداخل \`\`\`html ... \`\`\` حتى تعمل شاشة المعاينة الحية فوراً بدون أي أخطاء أو نقصان.
4. الشرح والأسلوب:
   - اكتب شرحاً عربياً مشجعاً ومختصراً وواضحاً يشرح ما قمت ببنائه وأبرز الميزات التي أضفتها للموقع وكيفية التفاعل معه.
   - تحدث بنبرة مهندس خبير ومبدع، فخور بجودة العمل والجمالية.`;

// ========================================
// Groq API Call with Model Fallback
// ========================================
async function callGroqCoder(messages, keyIndex = 0, retryCount = 0) {
    if (retryCount >= API_KEYS.length * 2) {
        throw new Error('جميع مفاتيح ونماذج الـ API تجاوزت الحد المسموح، يرجى المحاولة بعد لحظات');
    }

    const apiKey = API_KEYS[keyIndex % API_KEYS.length];
    
    // Primary model is openai/gpt-oss-120b (elite coding capacity), fallback to qwen/qwen3.8-27b
    const modelToUse = retryCount % 2 === 0 ? 'openai/gpt-oss-120b' : 'qwen/qwen3.8-27b';

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: modelToUse,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 4500,
                top_p: 0.95,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error(`⚠️ خطأ من المفتاح ${keyIndex + 1} مع الموديل ${modelToUse}: ${response.status} - ${errorData}`);
            
            // If rate limited or error, try next key or fallback model
            if (response.status === 429 || response.status === 401 || response.status === 403 || response.status === 503) {
                console.log(`🔄 جاري التبديل للمفتاح/الموديل التالي...`);
                return callGroqCoder(messages, (keyIndex + 1) % API_KEYS.length, retryCount + 1);
            }
            
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        currentKeyIndex = (keyIndex + 1) % API_KEYS.length;
        
        return data.choices[0].message.content;
    } catch (error) {
        console.error(`❌ خطأ في المعالجة:`, error.message);
        if (retryCount < API_KEYS.length * 2 - 1) {
            return callGroqCoder(messages, (keyIndex + 1) % API_KEYS.length, retryCount + 1);
        }
        throw error;
    }
}

// Helper to extract HTML code block from text
function extractHtmlCode(text) {
    if (!text) return null;
    const match = text.match(/```html\s*([\s\S]*?)\s*```/i);
    if (match && match[1]) {
        return match[1].trim();
    }
    // Fallback: check if entire response looks like HTML
    if (text.trim().startsWith('<!DOCTYPE html>') || text.trim().startsWith('<html')) {
        return text.trim();
    }
    return null;
}

// ========================================
// API Routes
// ========================================

// Chat endpoint for generating/editing code
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'قائمة الرسائل مطلوبة' });
        }

        // Keep last 12 messages for good context without token blowup
        const recentMessages = messages.slice(-12);
        const lastUserMsg = recentMessages[recentMessages.length - 1]?.content || '';

        console.log(`💻 طلب جديد لبناء/تعديل كود: "${lastUserMsg.substring(0, 70)}..."`);
        
        const startTime = Date.now();
        const reply = await callGroqCoder(recentMessages, currentKeyIndex);
        const durationMs = Date.now() - startTime;
        
        const extractedCode = extractHtmlCode(reply);
        console.log(`✅ تم توليد الرد في ${durationMs}ms | كود مستخرج: ${extractedCode ? 'نعم (' + extractedCode.length + ' حرف)' : 'لا'}`);

        res.json({ 
            reply,
            code: extractedCode,
            durationMs,
            model: 'openai/gpt-oss-120b'
        });
    } catch (error) {
        console.error('❌ خطأ في السيرفر:', error.message);
        res.status(500).json({ 
            error: 'حدث خطأ أثناء معالجة طلبك البرمجي، يرجى المحاولة مجدداً',
            details: error.message 
        });
    }
});

// Quick starter templates endpoint
app.get('/api/templates', (req, res) => {
    res.json({
        templates: [
            {
                id: 'cafe',
                title: 'مقهى وكافيه فاخر (Aroma Café)',
                category: 'صفحة هبوط ومطعم',
                prompt: 'قم بإنشاء صفحة هبوط فخمة لمقهى وكافيه حديث اسمه "Aroma Café" مع قائمة مشروبات تفاعلية وزر لطلب فوري وسلايدر آراء عملاء وتصميم بنفسجي وأسود عصري.'
            },
            {
                id: 'portfolio',
                title: 'بورتفوليو مبرمج مستقبلي (Dev Portfolio)',
                category: 'موقع شخصي',
                prompt: 'قم بإنشاء بورتفوليو شخصي لمطور ويب ومصمم واجهات بتصميم سايبربانك داكن وعصري، مع معرض مشاريع تفاعلي وفلترة، وقسم للمهارات مع نسب تفاعلية، ونموذج تواصل فعال.'
            },
            {
                id: 'dashboard',
                title: 'لوحة تحكم إحصائيات حديثة (SaaS Dashboard)',
                category: 'تطبيق ويب',
                prompt: 'قم بإنشاء لوحة تحكم إحصائيات Analytics Dashboard داكنة وفخمة مع بطاقات مؤشرات أداء (KPIs) بمؤشرات نمو، ورسم بياني باستخدام Chart.js، وجدول أحدث العمليات مع أزرار تفاعلية.'
            },
            {
                id: 'game',
                title: 'لعبة تفاعلية (Neon Tic-Tac-Toe & Sound)',
                category: 'ألعاب ويب',
                prompt: 'قم ببرمجة لعبة X-O (Tic-Tac-Toe) متطورة بتصميم نيون مستقبلي، تدعم اللعب ضد ذكاء اصطناعي ذكي أو لاعبين اثنين، مع تأثيرات صوتية ومؤثرات فوز بالكونفيتي (confetti) وعداد نقاط.'
            },
            {
                id: 'calc',
                title: 'حاسبة مالية واستثمارية متطورة (FinCalc)',
                category: 'أدوات تفاعلية',
                prompt: 'قم بإنشاء حاسبة تمويل واستثمار متطورة بحساب الفائدة المركبة والأقساط الشهرية مع شريط تمرير (sliders) ديناميكي ورسم بياني تفاعلي يوضح نمو رأس المال.'
            }
        ]
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        name: 'WebCraft AI Studio',
        keys: API_KEYS.length,
        timestamp: new Date().toISOString()
    });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ========================================
// Start Server
// ========================================
app.listen(PORT, () => {
    console.log('');
    console.log('⚡ ═══════════════════════════════════════════════════');
    console.log(`⚡  WebCraft AI - استوديو بناء وبرمجة المواقع الذكي`);
    console.log(`⚡  الرابط: http://localhost:${PORT}`);
    console.log(`⚡  مفاتيح Groq المحملة: ${API_KEYS.length}`);
    console.log(`⚡  الموديل الأساسي: openai/gpt-oss-120b (Coder)`);
    console.log('⚡ ═══════════════════════════════════════════════════');
    console.log('');
});
