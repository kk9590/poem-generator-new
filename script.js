// 原有词库
const nouns = [
    "余烬", "雷声", "瀑布", "裂缝", "海水", "街道", "花园", "尘埃", "屋顶", "阁楼", 
    "波浪", "火焰", "寂静", "春天", "野草", "月亮", "谎言", "思绪", "永恒", "泥土",
    "宇宙", "空气", "时间", "灵感", "日出", "黄昏", "黎明", "晚霞", "明日", "过去", 
    "玫瑰", "沙滩", "路灯", "光线", "尘埃", "自由", "答案", "春雨", "汉堡", "长凳", 
    "世界", "弹壳", "答案", "浪声", "雨水", "琴键", "落叶", "种子", "窗户", "规则",
    "蜡笔", "梦境", "旋律", "泪水", "希望", "理智", "小狗", "小猫", "城市", "记忆",
    "偏见", "钥匙", "纽扣", "视线", "繁星", "浪潮", "夜空", "欲望", "暮色", "微风", 
    "翅膀", "羽毛", "灵魂", "悲痛", "盔甲", "抽屉", "意义", "海洋", "信封", "伤疤", 
    "灰尘", "焦虑", "未来", "凌晨", "傍晚", "日落", "话语", "湖底", "寒风", "风铃", 
    "岩石", "影子", "清风", "积水", "掌心", "蝴蝶", "落叶", "雨声", "烟雾", "花瓣", 
    "泡沫", "雪花", "积雪", "星星", "阴影", "旷野", "睡莲", "秋天", "情欲", "镜子", 
     
];

const verbs = [ // 动词词库（模式A使用）
    "跳跃", "沉思", "晃动", "沉默", "漂浮", "遗忘", "喧闹", "燃烧", "静默", "逃离", 
    "灼热", "柔软", "破碎", "亲吻", "迷恋", "模糊", "枯萎", "叹息", "轻盈", "相信", 
    "流淌", "闪耀", "落泪", "共鸣", "潮湿", "旋转", "选择", "叛逆", "交谈", "追逐", 
    "等待", "逃避", "不朽", "点亮", "扬起", "寻找", "经历", "漂泊", "溢出", "绽放", 
    "缠绵", "呼吸", "堂皇", "反思", "打湿", "起身", "承诺", "孤独", "粉红", "知晓", 
    "昏暗", "滞后", "思考", "涂画", "嘲弄", "陌生", "消退", "纵容", "存在", "入睡", 
    "惋惜", "倾斜", "呐喊", "等待", "到达", "感激", "约会", "泛滥", "凌乱", "倾听", 
    "单薄", "残缺", "完整", "修复", "妄想", "书写", "淹没", "灿烂", "奔跑", "降落", 
    "拥抱", "暂停", "幻想", "闪烁", "走过", "深陷", "挣脱", "眺望", "抬头", "轰鸣", 
    "混淆", "摇摆", "跳舞", "吻别", "喧嚣", "落下", "流动", "指引", "撕扯", "迷茫", 
    "仰望", "点燃", "抓住", "飞过", "空无", "眨眼", "纷飞", "永恒"
    
];

const highlights = [
    "一种异乎寻常。", "无法停止", "夜晚继续扩张", "一切皆为无物。",
    "梦境还是现实？", "几乎消失不见", "时间仿佛被定格", "安静突然来临",
    "转瞬即逝的。", "近乎完美。", "点燃世界", "小鸟抖落星辰",
    "大海的野心", "“去看海吧”", "等待。", "是这样吗？",
    "一切照旧。", "声音的颗粒感", "远离纷扰。", "拥抱自由。",
    "无动于衷。", "没有什么不可以", "你是否会有所怀念", "LOVE",
    "Memory is vivid.", "If it were meant to come.", "It's a joke.", "I guess.",
    "L'amour", "wind stroking my ears", "I'm losing my mind.", "有天我们会再次相见",
    "在世界尽头", "Let it pour.", "shadows on the wall", "I don't know other places.",
    "I don't hope for the greatest.", "Can you call me loud.", "天空坠入海洋", "都与我无关。",
    "扬起灰烬", "在星期天早晨", "“干杯。”", "太阳升起。", "“出发！”"
];

// 新增词库
const verbs2 = [ // 第二组动词（模式B使用）
    "晃动", "遗忘", "亲吻", "迷恋", "共鸣", "旋转", "选择", "等待", 
    "逃避", "点亮", "扬起", "寻找", "打湿", "承诺", "思考", "涂画", 
    "嘲弄", "纵容", "惋惜", "逃离", "等待", "感激", "约会", "修复", 
    "妄想", "书写", "淹没", "拥抱", "暂停", "幻想", "走过", "深陷", 
    "挣脱", "眺望", "混淆", "指引", "倾听", "知晓", "溢出", "相信", 
    "追逐", "向往", "撕扯", "仰望", "点燃", "抓住", "飞过", 
];

const adj2 = [   // 第二组形容词（模式B使用）
    "跳跃的", "沉思的", "晃动的", "沉默的", "漂浮的", "遗忘的", "喧闹的", "燃烧的", "灼热的", 
    "柔软的", "破碎的", "迷恋的", "模糊的", "枯萎的", "叹息的", "流淌的", "闪耀的", "落泪的", 
    "潮湿的", "旋转的", "叛逆的", "等待的", "逃避的", "不朽的", "经历的", "漂泊的", "缠绵的", 
    "呼吸的", "堂皇的", "反思的", "起身的", "孤独的", "昏暗的", "滞后的", "陌生的", "消退的", 
    "倾斜的", "呐喊的", "到达的", "泛滥的", "单薄的", "残缺的", "完整的", "灿烂的", "闪烁的",
    "摇摆的", "跳舞的", "吻别的", "喧嚣的", "落下的", "流动的", "抬头的", "轰鸣的", "奔跑的", 
    "降落的", "凌乱的", "存在的", "入睡的", "粉红的", "交谈的", "轻盈的", "静默的", "吹落的", 
    "流浪的", "飘落的", "绽放的", "零碎的", "迷茫的", "空无的", "纷飞的", "永恒的"
];

// 辅助函数：生成随机旋转角度（-2~-1 或 0.5~1.6）
function randomAngle() {
    if (Math.random() < 0.5) {
        return -2 + Math.random() * 0.9;   // 范围约 -2 ~ -1.1
    } else {
        return 0.5 + Math.random() * 1.1;  // 范围约 0.5 ~ 1.6
    }
}

// 随机选取一条高亮句
function randomHighlight() {
    return highlights[Math.floor(Math.random() * highlights.length)];
}

function generatePoem() {
    const poemDiv = document.getElementById("poem");
    poemDiv.innerHTML = ""; // 清空

    // 随机选择模式（0.5 概率模式A，0.5 概率模式B）
    const mode = Math.random() < 0.5 ? 'A' : 'B';

    if (mode === 'A') {
        // 模式A：四行 noun+verb + 可选高亮
        let availableNouns = [...nouns];
        let availableVerbs = [...verbs];

        for (let i = 0; i < 4; i++) {
            // 检查是否还有足够的名词和动词
            if (availableNouns.length === 0 || availableVerbs.length === 0) break;

            let line = document.createElement("div");

            // 取一个名词
            const nounIndex = Math.floor(Math.random() * availableNouns.length);
            const noun = availableNouns[nounIndex];
            availableNouns.splice(nounIndex, 1);

            let spanNoun = document.createElement("span");
            spanNoun.className = "word";
            spanNoun.innerText = noun;
            spanNoun.style.transform = `rotate(${randomAngle()}deg)`;
            line.appendChild(spanNoun);

            // 取一个动词
            const verbIndex = Math.floor(Math.random() * availableVerbs.length);
            const verb = availableVerbs[verbIndex];
            availableVerbs.splice(verbIndex, 1);

            let spanVerb = document.createElement("span");
            spanVerb.className = "word";
            spanVerb.innerText = verb;
            spanVerb.style.transform = `rotate(${randomAngle()}deg)`;
            line.appendChild(spanVerb);

            poemDiv.appendChild(line);
        }

        // 60% 概率追加高亮行
        if (Math.random() < 0.6) {
            let line = document.createElement("div");
            let span = document.createElement("span");
            span.className = "highlight";
            span.innerText = randomHighlight();
            span.style.transform = `rotate(${randomAngle()}deg)`;
            line.appendChild(span);
            poemDiv.appendChild(line);
        }
    } else {
        // 模式B：两行 noun+verbs2+adj2+noun
        let availableNouns = [...nouns];
        let availableVerbs2 = [...verbs2];
        let availableAdj2 = [...adj2];

        for (let i = 0; i < 2; i++) {
            // 检查资源是否足够生成一行（需要2个名词、1个verbs2、1个adj2）
            if (availableNouns.length < 2 || availableVerbs2.length === 0 || availableAdj2.length === 0) break;

            let line = document.createElement("div");

            // 取第一个名词
            const noun1Index = Math.floor(Math.random() * availableNouns.length);
            const noun1 = availableNouns[noun1Index];
            availableNouns.splice(noun1Index, 1);

            // 取第二个名词（从剩余名词中取）
            const noun2Index = Math.floor(Math.random() * availableNouns.length);
            const noun2 = availableNouns[noun2Index];
            availableNouns.splice(noun2Index, 1);

            // 取一个 verbs2
            const verb2Index = Math.floor(Math.random() * availableVerbs2.length);
            const verb2 = availableVerbs2[verb2Index];
            availableVerbs2.splice(verb2Index, 1);

            // 取一个 adj2
            const adj2Index = Math.floor(Math.random() * availableAdj2.length);
            const adj2word = availableAdj2[adj2Index];
            availableAdj2.splice(adj2Index, 1);

            // 创建四个词块，顺序：名词1, verbs2, adj2, 名词2
            const words = [
                { text: noun1, className: "word" },
                { text: verb2, className: "word" },
                { text: adj2word, className: "word" },
                { text: noun2, className: "word" }
            ];

            words.forEach(item => {
                let span = document.createElement("span");
                span.className = item.className;
                span.innerText = item.text;
                span.style.transform = `rotate(${randomAngle()}deg)`;
                line.appendChild(span);
            });

            poemDiv.appendChild(line);
        }

        // 60% 概率追加高亮行
        if (Math.random() < 0.6) {
            let line = document.createElement("div");
            let span = document.createElement("span");
            span.className = "highlight";
            span.innerText = randomHighlight();
            span.style.transform = `rotate(${randomAngle()}deg)`;
            line.appendChild(span);
            poemDiv.appendChild(line);
        }
    }
}