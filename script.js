let selectedTemplate = null;
let highlightEnabled = false; // 新增一个状态变量

// 模式A、B按钮
document.querySelectorAll('.templateOption[data-mode]').forEach(option => {
    option.addEventListener('click', () => {
        const mode = option.dataset.mode;

        if (selectedTemplate === mode) {
            selectedTemplate = null;
            option.classList.remove('selected');
        } else {
            selectedTemplate = mode;

            document.querySelectorAll('.templateOption[data-mode]')
                .forEach(o => o.classList.remove('selected'));

            option.classList.add('selected');
        }
    });
});


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
    "仰望", "点燃", "抓住", "飞过", "空无", "眨眼", "纷飞", "永恒", "散步"
    
];

const highlights = [
    "一种异乎寻常。", "无法停止。", "夜晚继续扩张", "一切皆为无物。",
    "梦境还是现实？", "几乎消失不见", "时间仿佛被定格", "安静突然来临",
    "转瞬即逝的。", "近乎完美。", "点燃世界", "小鸟，抖落星辰",
    "大海的野心。", "“去看海吧”", "等待。", "是这样吗？",
    "一切照旧。", "声音的颗粒感", "远离纷扰。", "拥抱自由。",
    "无动于衷。", "没有什么不可以", "你是否会有所怀念", "LOVE",
    "Memory is vivid.", "If it were meant to come.", "It's a joke.", "I guess.",
    "L'amour", "wind stroking my ears", "I'm losing my mind.", "有天我们会再次相见",
    "在世界尽头", "Let it pour.", "shadows on the wall", "I don't know other places.",
    "I don't hope for the greatest.", "Can you call me loud.", "天空坠入海洋", "都与我无关。",
    "扬起灰烬", "在星期天早晨", "“干杯。”", "太阳升起。", "“出发！”", "片刻永恒"
];

// 新增词库
const verbs2 = [ // 第二组动词（模式B使用）
    "晃动", "遗忘", "亲吻", "迷恋", "共鸣", "旋转", "选择", "等待", 
    "逃避", "点亮", "扬起", "寻找", "打湿", "承诺", "思考", "涂画", 
    "嘲弄", "纵容", "惋惜", "逃离", "等待", "感激", "约会", "修复", 
    "妄想", "书写", "淹没", "拥抱", "暂停", "幻想", "走过", "深陷", 
    "挣脱", "眺望", "混淆", "指引", "倾听", "知晓", "溢出", "相信", 
    "追逐", "向往", "撕扯", "仰望", "点燃", "抓住", "飞过", "邀请"
];

const adj2 = [   // 第二组形容词（模式B使用）
    "跳跃的", "沉思的", "晃动的", "沉默的", "漂浮的", "遗忘的", "喧闹的", "燃烧的", "灼热的", 
    "柔软的", "破碎的", "迷恋的", "模糊的", "枯萎的", "叹息的", "流淌的", "闪耀的", "落泪的", 
    "潮湿的", "旋转的", "叛逆的", "等待的", "逃避的", "不朽的", "漂泊的", "缠绵的", 
    "呼吸的", "堂皇的", "反思的", "起身的", "孤独的", "昏暗的", "滞后的", "陌生的", "消退的", 
    "倾斜的", "呐喊的", "到达的", "泛滥的", "单薄的", "残缺的", "完整的", "灿烂的", "闪烁的",
    "摇摆的", "跳舞的", "吻别的", "喧嚣的", "落下的", "流动的", "抬头的", "轰鸣的", "奔跑的", 
    "降落的", "凌乱的", "存在的", "入睡的", "粉红的", "交谈的", "轻盈的", "静默的", "掉落的", 
    "流浪的", "飘落的", "绽放的", "零碎的", "迷茫的", "空无的", "纷飞的", "永恒的"
];

// 添加按钮点击逻辑
const highlightBtn = document.getElementById("highlightToggle");
highlightBtn.addEventListener("click", () => {
    highlightEnabled = !highlightEnabled;
    highlightBtn.classList.toggle("selected", highlightEnabled);
});

// 锁定词存储数组，每个元素格式：{ text: string, role: string, mode: 'A' | 'B' }
// role 可选值：'noun', 'verb', 'verb2', 'adj2', 'highlight'
let lockedWords = [];

// 生成随机旋转角度
function randomAngle() {
    if (Math.random() < 0.5) {
        return -2 + Math.random() * 0.9;
    } else {
        return 0.5 + Math.random() * 1.1;
    }
}

// 随机选取一条高亮句
function randomHighlight() {
    return highlights[Math.floor(Math.random() * highlights.length)];
}

// 创建词块 span，并添加 data 属性和点击事件
function createWordSpan(text, className, role, mode) {
    const span = document.createElement('span');
    span.className = className;
    span.innerText = text;
    span.style.transform = `rotate(${randomAngle()}deg)`;
    span.dataset.role = role;
    span.dataset.mode = mode;
    span.addEventListener('click', toggleLock);
    return span;
}

// 点击词块：锁定/解锁
function toggleLock(event) {
    const span = event.currentTarget;
    const text = span.innerText;
    const role = span.dataset.role;
    const mode = span.dataset.mode;

    // 检查该词是否已锁定（完全匹配 text, role, mode）
    const index = lockedWords.findIndex(item => item.text === text && item.role === role && item.mode === mode);
    if (index === -1) {
        // 尝试锁定：如果已有锁定词且模式不同，则清空旧锁定
        if (lockedWords.length > 0 && lockedWords[0].mode !== mode) {
            lockedWords = []; // 清除所有旧锁定
        }
        lockedWords.push({ text, role, mode });
    } else {
        // 解锁
        lockedWords.splice(index, 1);
    }

    // 更新所有词块的锁定样式
    applyLockStyles();
}

// 应用锁定样式
function applyLockStyles() {
    const allSpans = document.querySelectorAll('#poem .word, #poem .highlight');
    allSpans.forEach(span => {
        const text = span.innerText;
        const role = span.dataset.role;
        const mode = span.dataset.mode;
        const isLocked = lockedWords.some(item => item.text === text && item.role === role && item.mode === mode);
        if (isLocked) {
            span.classList.add('locked');
        } else {
            span.classList.remove('locked');
        }
    });
}

// 生成诗歌
function generatePoem() {
    const poemDiv = document.getElementById('poem');
    poemDiv.innerHTML = '';

    // 1. 确定本次生成的模式
    let currentMode;
    if (selectedTemplate) { // 点击模版A、B按钮，生成对应的模版，都不点就随机
    currentMode = selectedTemplate;
    }
    else if (lockedWords.length === 0) {
        currentMode = Math.random() < 0.5 ? 'A' : 'B';
    }
    else {
        currentMode = lockedWords[0].mode;
    }

    // 2. 根据模式生成主体行
    if (currentMode === 'A') {
        generateModeA();
    } else {
        generateModeB();
    }

    // 3. 处理锁定高亮句（强制出现）
    const lockedHighlights = lockedWords.filter(item => item.role === 'highlight');
    lockedHighlights.forEach(item => {
        const line = document.createElement('div');
        const span = createWordSpan(item.text, 'highlight', 'highlight', item.mode);
        line.appendChild(span);
        poemDiv.appendChild(line);
    });

    // 4. 重新应用锁定样式（新生成的词块需要标记）
    applyLockStyles();
}

// 模式A生成逻辑
function generateModeA() {
    const poemDiv = document.getElementById('poem');

    // 统计锁定词（仅限当前模式A）
    const lockedNouns = lockedWords.filter(item => item.role === 'noun' && item.mode === 'A').map(item => item.text);
    const lockedVerbs = lockedWords.filter(item => item.role === 'verb' && item.mode === 'A').map(item => item.text);

    // 计算所需最小行数
    const minRows = Math.max(lockedNouns.length, lockedVerbs.length);

    // 随机行数（2或4），但不得小于最小行数
    let rows = Math.random() < 0.5 ? 2 : 4;
    if (rows < minRows) rows = minRows;

    // 初始化每行的位置槽位
    const rowsData = [];
    for (let i = 0; i < rows; i++) {
        rowsData.push({ noun: null, verb: null });
    }

    // 已使用的词集合（防止重复）
    const usedWords = new Set();

    // 分配锁定的名词
    lockedNouns.forEach(text => {
        // 随机找一个名词槽位为空的行
        const availableRows = rowsData.reduce((acc, row, idx) => row.noun === null ? [...acc, idx] : acc, []);
        if (availableRows.length === 0) {
            // 理论上不会发生，因为行数已经确保足够
            return;
        }
        const rowIdx = availableRows[Math.floor(Math.random() * availableRows.length)];
        rowsData[rowIdx].noun = text;
        usedWords.add(text);
    });

    // 分配锁定的动词
    lockedVerbs.forEach(text => {
        const availableRows = rowsData.reduce((acc, row, idx) => row.verb === null ? [...acc, idx] : acc, []);
        if (availableRows.length === 0) return;
        const rowIdx = availableRows[Math.floor(Math.random() * availableRows.length)];
        rowsData[rowIdx].verb = text;
        usedWords.add(text);
    });

    // 填充剩余空位
    for (let i = 0; i < rows; i++) {
        const row = rowsData[i];
        if (row.noun === null) {
            // 从 nouns 中选取未使用的词
            const available = nouns.filter(word => !usedWords.has(word));
            if (available.length === 0) break; // 词库耗尽
            const word = available[Math.floor(Math.random() * available.length)];
            row.noun = word;
            usedWords.add(word);
        }
        if (row.verb === null) {
            const available = verbs.filter(word => !usedWords.has(word));
            if (available.length === 0) break;
            const word = available[Math.floor(Math.random() * available.length)];
            row.verb = word;
            usedWords.add(word);
        }
    }

    // 生成 DOM 行
    rowsData.forEach(row => {
        const line = document.createElement('div');
        const spanNoun = createWordSpan(row.noun, 'word', 'noun', 'A');
        const spanVerb = createWordSpan(row.verb, 'word', 'verb', 'A');
        line.appendChild(spanNoun);
        line.appendChild(spanVerb);
        poemDiv.appendChild(line);
    });

    // 概率追加随机高亮行（仅当没有锁定高亮句时才概率出现，否则锁定高亮句已单独追加）
    const hasLockedHighlight = lockedWords.some(item => item.role === 'highlight' && item.mode === 'A');
    if (highlightEnabled) {
        const line = document.createElement('div');
        const span = createWordSpan(randomHighlight(), 'highlight', 'highlight', 'A');
        line.appendChild(span);
        poemDiv.appendChild(line);
    }
}

// 模式B生成逻辑
function generateModeB() {
    const poemDiv = document.getElementById('poem');

    // 统计锁定词（仅限当前模式B）
    const lockedNouns = lockedWords.filter(item => item.role === 'noun' && item.mode === 'B').map(item => item.text);
    const lockedVerbs2 = lockedWords.filter(item => item.role === 'verb2' && item.mode === 'B').map(item => item.text);
    const lockedAdj2 = lockedWords.filter(item => item.role === 'adj2' && item.mode === 'B').map(item => item.text);

    // 计算所需最小行数（模式B固定2行，但可能因锁定词过多而增加行数）
    const minRows = Math.max(
        Math.ceil(lockedNouns.length / 2), // 每行可放2个名词
        lockedVerbs2.length,
        lockedAdj2.length
    );
    // 模式B默认2行，但若不足则增加
    let rows = 2;
    if (rows < minRows) rows = minRows;

    // 初始化每行的四个槽位
    const rowsData = [];
    for (let i = 0; i < rows; i++) {
        rowsData.push({ noun1: null, verb2: null, adj2: null, noun2: null });
    }

    const usedWords = new Set();

    // 分配锁定名词（需要同时考虑两个名词位置）
    lockedNouns.forEach(text => {
        // 寻找有空名词槽位的行
        const availableRows = rowsData.reduce((acc, row, idx) => {
            if (row.noun1 === null || row.noun2 === null) acc.push(idx);
            return acc;
        }, []);
        if (availableRows.length === 0) return;
        const rowIdx = availableRows[Math.floor(Math.random() * availableRows.length)];
        const row = rowsData[rowIdx];
        // 优先放 noun1，若 noun1 已占用则放 noun2
        if (row.noun1 === null) {
            row.noun1 = text;
        } else {
            row.noun2 = text;
        }
        usedWords.add(text);
    });

    // 分配锁定 verbs2
    lockedVerbs2.forEach(text => {
        const availableRows = rowsData.reduce((acc, row, idx) => row.verb2 === null ? [...acc, idx] : acc, []);
        if (availableRows.length === 0) return;
        const rowIdx = availableRows[Math.floor(Math.random() * availableRows.length)];
        rowsData[rowIdx].verb2 = text;
        usedWords.add(text);
    });

    // 分配锁定 adj2
    lockedAdj2.forEach(text => {
        const availableRows = rowsData.reduce((acc, row, idx) => row.adj2 === null ? [...acc, idx] : acc, []);
        if (availableRows.length === 0) return;
        const rowIdx = availableRows[Math.floor(Math.random() * availableRows.length)];
        rowsData[rowIdx].adj2 = text;
        usedWords.add(text);
    });

    // 填充剩余空位
    for (let i = 0; i < rows; i++) {
        const row = rowsData[i];
        // 名词1
        if (row.noun1 === null) {
            const available = nouns.filter(word => !usedWords.has(word));
            if (available.length > 0) {
                const word = available[Math.floor(Math.random() * available.length)];
                row.noun1 = word;
                usedWords.add(word);
            }
        }
        // 名词2
        if (row.noun2 === null) {
            const available = nouns.filter(word => !usedWords.has(word));
            if (available.length > 0) {
                const word = available[Math.floor(Math.random() * available.length)];
                row.noun2 = word;
                usedWords.add(word);
            }
        }
        // verb2
        if (row.verb2 === null) {
            const available = verbs2.filter(word => !usedWords.has(word));
            if (available.length > 0) {
                const word = available[Math.floor(Math.random() * available.length)];
                row.verb2 = word;
                usedWords.add(word);
            }
        }
        // adj2
        if (row.adj2 === null) {
            const available = adj2.filter(word => !usedWords.has(word));
            if (available.length > 0) {
                const word = available[Math.floor(Math.random() * available.length)];
                row.adj2 = word;
                usedWords.add(word);
            }
        }
    }

    // 生成 DOM 行
    rowsData.forEach(row => {
        const line = document.createElement('div');
        const span1 = createWordSpan(row.noun1, 'word', 'noun', 'B');
        const span2 = createWordSpan(row.verb2, 'word', 'verb2', 'B');
        const span3 = createWordSpan(row.adj2, 'word', 'adj2', 'B');
        const span4 = createWordSpan(row.noun2, 'word', 'noun', 'B');
        line.appendChild(span1);
        line.appendChild(span2);
        line.appendChild(span3);
        line.appendChild(span4);
        poemDiv.appendChild(line);
    });

    // 概率追加随机高亮行（仅当没有锁定高亮句）
    const hasLockedHighlight = lockedWords.some(item => item.role === 'highlight' && item.mode === 'B');
    if (highlightEnabled) {
        const line = document.createElement('div');
        const span = createWordSpan(randomHighlight(), 'highlight', 'highlight', 'B');
        line.appendChild(span);
        poemDiv.appendChild(line);
    }
}
