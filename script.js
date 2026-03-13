// 1. 随机分组（0: 对照组, 1: 解释性说明组, 2: 情景化提示组）
const userGroup = Math.floor(Math.random() * 3);
const groupNames = [
    "对照组（无额外提示）",
    "解释性说明组（图标悬浮提示）",
    "情景化提示组（实时检测）"
];

// 2. 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 显示分组提示
    const groupTipEl = document.getElementById('group-tip');
    groupTipEl.textContent = `当前分组：${groupNames[userGroup]}`;
    groupTipEl.style.backgroundColor = userGroup === 0 ? "#e9ecef" : (userGroup === 1 ? "#e8f4f8" : "#fdf2f8");

    // 初始化优化图标（仅解释性说明组显示）
    if (userGroup === 1) {
        initOptimizeIcons();
    }

    // 绑定生成按钮点击事件
    document.getElementById('generate-btn').addEventListener('click', generate科普短文);
});

// 3. 初始化优化图标（解释性说明组）
function initOptimizeIcons() {
    const optimizeIconsEl = document.getElementById('optimize-icons');
    optimizeIconsEl.innerHTML = `
        <div class="tooltip-btn" onclick="optimizeContent('popularity')">
            <i class="fa-solid fa-lightbulb" aria-hidden="true"></i>
            <span class="tooltip">让内容更通俗，避免专业术语</span>
        </div>
        <div class="tooltip-btn" onclick="optimizeContent('wordcount')">
            <i class="fa-solid fa-scissors" aria-hidden="true"></i>
            <span class="tooltip">将内容压缩至100-120字区间</span>
        </div>
        <div class="tooltip-btn" onclick="optimizeContent('logic')">
            <i class="fa-solid fa-sitemap" aria-hidden="true"></i>
            <span class="tooltip">让因果/步骤更易理解</span>
        </div>
    `;
}

// 4. 生成科普短文（核心API调用逻辑）
async function generate科普短文() {
    const inputText = document.getElementById('abstract-input').value.trim();
    const outputContentEl = document.getElementById('output-content');
    
    // 输入校验
    if (!inputText) {
        alert("请先输入学术论文摘要！");
        return;
    }

    // 加载状态
 try {
    // ========== DeepSeek API 配置 ==========
    const apiUrl = "https://api.deepseek.com"; // DeepSeek的base_url
    const apiKey = "sk-a05915657f7841b382145bc4c2e45749"; // 替换成你的实际api_key
    // =======================================

    // 调用DeepSeek API
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}` // DeepSeek鉴权格式
        },
        body: JSON.stringify({
            model: "deepseek-chat", // DeepSeek默认模型，可根据需要调整
            messages: [
                {
                    role: "user",
                    content: `将以下学术摘要改写为面向非专业人士的科普短文，要求逻辑严密、字数严格控制在100-120字之间：\n${inputText}`
                }
            ],
            temperature: 0.7, // 可调整，0-1之间，越低越稳定
            max_tokens: 200
        })
    });

    if (!response.ok) {
        throw new Error(`API请求失败：${response.status}`);
    }

    const result = await response.json();
    // ========== DeepSeek 返回格式适配 ==========
    const generatedText = result.choices[0].message.content || "生成失败";
    // ===========================================

    // 显示生成结果
    outputContentEl.textContent = generatedText;

    // 情景化提示组：实时检测并提示
    if (userGroup === 2) {
        checkAndShowContextTip(generatedText);
    }
} catch (error) {
    outputContentEl.textContent = `生成失败：${error.message}`;
    console.error("API调用错误：", error);
}
        // 显示生成结果
        outputContentEl.textContent = generatedText;

        // 情景化提示组：实时检测并提示
        if (userGroup === 2) {
            checkAndShowContextTip(generatedText);
        }
    } catch (error) {
        outputContentEl.textContent = `生成失败：${error.message}`;
        console.error("API调用错误：", error);
    }
}

try {
    // ========== DeepSeek API 配置 ==========
    const apiUrl = "https://api.deepseek.com"; // DeepSeek的base_url
    const apiKey = "sk-a05915657f7841b382145bc4c2e45749"; // 替换成和上面相同的api_key
    // =======================================

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}` // DeepSeek鉴权格式
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                {
                    role: "user",
                    content: optimizePrompt // 优化提示词（代码中已自动生成）
                }
            ],
            temperature: 0.7,
            max_tokens: 200
        })
    });

    if (!response.ok) {
        throw new Error(`优化请求失败：${response.status}`);
    }

    const result = await response.json();
    // ========== DeepSeek 返回格式适配 ==========
    const optimizedText = result.choices[0].message.content || "优化失败";
    // ===========================================
    document.getElementById('output-content').textContent = optimizedText;
} catch (error) {
    alert(`优化失败：${error.message}`);
    console.error("优化API调用错误：", error);
}

    try {
        // ========== 重点：替换为你的API地址 ==========
        const apiUrl = "https://api.deepseek.com"; // 同样替换成你的AI接口地址
        // ===========================================

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: optimizePrompt,
                max_tokens: 200
            })
        });

        if (!response.ok) {
            throw new Error(`优化请求失败：${response.status}`);
        }

        const result = await response.json();
        const optimizedText = result.data || result.choices[0].text || "优化失败";
        document.getElementById('output-content').textContent = optimizedText;
    } catch (error) {
        alert(`优化失败：${error.message}`);
        console.error("优化API调用错误：", error);
    }
}

// 6. 情景化提示检测（情景化提示组）
function checkAndShowContextTip(text) {
    const contextTipEl = document.getElementById('context-tip');
    contextTipEl.style.display = "none"; // 先隐藏

    // 检测字数
    const wordCount = text.length; // 简单按字符数统计，可根据需要调整为汉字数
    if (wordCount < 100 || wordCount > 120) {
        contextTipEl.innerHTML = `
            检测到当前字数为【${wordCount}字】，未在100-120字要求范围内。
            <button onclick="optimizeContent('wordcount')">调整字数</button>
            <button onclick="document.getElementById('context-tip').style.display='none'">忽略</button>
        `;
        contextTipEl.style.display = "block";
        return;
    }

    // 简单检测专业术语密度（示例：可根据需要扩展术语库）
    const professionalTerms = ["量子力学", "神经网络", "区块链", "人工智能", "算法", "模型", "参数"];
    let termCount = 0;
    professionalTerms.forEach(term => {
        if (text.includes(term)) termCount++;
    });
    if (termCount > 3) {
        contextTipEl.innerHTML = `
            检测到内容中包含较多专业术语，可能不利于非专业人士理解。
            <button onclick="optimizeContent('popularity')">优化通俗度</button>
            <button onclick="document.getElementById('context-tip').style.display='none'">忽略</button>
        `;
        contextTipEl.style.display = "block";
        return;
    }
}
