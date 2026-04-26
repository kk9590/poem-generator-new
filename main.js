// ======================== 日志记录系统 ========================
function logAction(actionType, details = {}) {
    const actionLog = {
        time: new Date().toISOString(),
        type: actionType,
        details: {
            ...details,
            // 自动附带当前全局状态快照
            globalState: {
                mode: selectedTemplate,
                highlight: highlightEnabled,
                title: titleEnabled,
                lockedWordsCount: lockedWords.length,
                lockedLinesCount: lockedLines.length
            }
        }
    };
    let actions = JSON.parse(localStorage.getItem("userActions") || "[]");
    actions.push(actionLog);
    localStorage.setItem("userActions", JSON.stringify(actions));
    // 可选：控制台输出，便于调试
    console.log("[Action Log]", actionType, details);
}

// 导出操作日志按钮
document.getElementById("exportActionsBtn").addEventListener("click", () => {
    const data = localStorage.getItem("userActions");
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_actions_log.json";
    a.click();
    logAction("export_actions"); // 记录导出操作日志这个行为本身
});
// ==============================================================


const filterButton = document.getElementById("filterButton");
const filterPanel = document.getElementById("filterPanel");

filterButton.addEventListener("click", () => {
    filterPanel.classList.toggle("hidden");
    logAction("open_filter_panel", { visible: !filterPanel.classList.contains("hidden") });
});

document.addEventListener("click", (e) => {
    if (!filterPanel.contains(e.target) && e.target !== filterButton) {
        filterPanel.classList.add("hidden");
    }
});

const saveButton = document.getElementById("saveButton");
const savePanel = document.getElementById("savePanel");

saveButton.addEventListener("click", (e) => {
    e.stopPropagation();
    savePanel.classList.toggle("hidden");
    filterPanel.classList.add("hidden");
    logAction("open_save_panel", { visible: !savePanel.classList.contains("hidden") });
});


// 点击其他地方关闭所有面板
document.addEventListener("click", (e) => {
    if (!filterPanel.contains(e.target) && e.target !== filterButton) {
        filterPanel.classList.add("hidden");
    }
    if (!savePanel.contains(e.target) && e.target !== saveButton) {
        savePanel.classList.add("hidden");
    }
});

let selectedTemplate = null;
let highlightEnabled = false;
let titleEnabled = false;
let lockedWords = [];
let lockedLines = [];

/* 模板按钮 - 添加日志 */
document.querySelectorAll('.templateOption[data-mode]').forEach(option => {
    option.addEventListener('click', () => {
        const mode = option.dataset.mode;
        const previousMode = selectedTemplate;
        if (selectedTemplate === mode) {
            selectedTemplate = null;
            option.classList.remove('selected');
            logAction("mode_change", { from: mode, to: null });
        } else {
            selectedTemplate = mode;
            document.querySelectorAll('.templateOption[data-mode]')
                .forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            logAction("mode_change", { from: previousMode, to: mode });
        }
    });
});

/* highlight按钮 - 添加日志 */
const highlightBtn = document.getElementById("highlightToggle");
highlightBtn.addEventListener("click", () => {
    highlightEnabled = !highlightEnabled;
    highlightBtn.classList.toggle("selected", highlightEnabled);
    logAction("toggle_highlight", { newState: highlightEnabled });
});

/* title按钮 - 添加日志 */
const titleBtn = document.getElementById("titleToggle");
titleBtn.addEventListener("click", () => {
    titleEnabled = !titleEnabled;
    titleBtn.classList.toggle("selected", titleEnabled);
    logAction("toggle_title", { newState: titleEnabled });
});

function randomAngle() {
    return Math.random() < 0.5 ? -1.3 + Math.random() : 0.3 + Math.random();
}

//* 创建词块 */
function createWordSpan(text, className, role, mode, row, slot, type, angle = null) {
    const span = document.createElement("span");
    span.className = className;
    span.innerText = text;

    const rot = angle !== null ? angle : randomAngle();
    span.style.transform = `rotate(${rot}deg)`;

    span.dataset.angle = rot;
    span.dataset.role = role;
    span.dataset.mode = mode;
    span.dataset.row = row;
    span.dataset.slot = slot;
    span.dataset.type = type;

    span.addEventListener("click", toggleWordLock);
    return span;
}

/* 词锁 - 添加日志 */
function toggleWordLock(e) {
    const span = e.currentTarget;
    const data = {
        text: span.innerText,
        role: span.dataset.role,
        mode: span.dataset.mode,
        row: parseInt(span.dataset.row),
        slot: span.dataset.slot,
        type: span.dataset.type,
        angle: span.dataset.angle
    };

    const index = lockedWords.findIndex(w =>
        w.mode === data.mode &&
        w.row === data.row &&
        w.slot === data.slot &&
        w.type === data.type
    );

    let action = "";
    if (index === -1) {
        lockedWords.push(data);
        action = "lock_word";
    } else {
        lockedWords.splice(index, 1);
        action = "unlock_word";
    }
    applyLockStyles();
    // 记录词锁操作
    logAction(action, {
        word: data.text,
        mode: data.mode,
        row: data.row,
        slot: data.slot,
        type: data.type
    });
}

/* 行锁 - 添加日志 */
function toggleLineLock(row, mode, type) {
    const index = lockedLines.findIndex(l =>
        l.row === row && l.mode === mode && l.type === type
    );

    let action = "";
    let lineInfo = { row, mode, type };

    if (index === -1) {
        const line = [...document.querySelectorAll("#poem > div")]
            .find(l =>
                parseInt(l.dataset.row) === row &&
                l.dataset.mode === mode &&
                l.dataset.type === type
            );
        if (!line) return;

        const words = line.querySelectorAll(".word, .highlight, .title-word");
        const saved = {};
        words.forEach(w => {
            saved[w.dataset.slot] = {
                text: w.innerText,
                angle: w.dataset.angle
            };
        });
        lockedLines.push({ row, mode, type, words: saved });
        action = "lock_line";
        // 记录时附带锁定的词概要
        lineInfo.lockedTexts = Object.values(saved).map(v => v.text).join(" , ");
    } else {
        lockedLines.splice(index, 1);
        action = "unlock_line";
    }
    logAction(action, lineInfo);
}

/* 样式应用 */
function applyLockStyles() {
    const spans = document.querySelectorAll('#poem .word, #poem .highlight, #poem .title-word');
    spans.forEach(span => {
        const locked = lockedWords.some(w =>
            w.mode === span.dataset.mode &&
            w.row == span.dataset.row &&
            w.slot === span.dataset.slot &&
            w.type === span.dataset.type
        );
        span.classList.toggle("locked", locked);
    });
}

/* 行锁按钮 */
function addLineLockButton(line, row, mode, type) {
    const btn = document.createElement("span");
    btn.innerText = "🔒";
    btn.className = "lineLock";

    const locked = lockedLines.some(l =>
        l.row === row && l.mode === mode && l.type === type
    );
    btn.style.opacity = locked ? "1" : "0.4";

    btn.onclick = (e) => {
        e.stopPropagation();
        toggleLineLock(row, mode, type);
        const lockedNow = lockedLines.some(l =>
            l.row === row && l.mode === mode && l.type === type
        );
        btn.style.opacity = lockedNow ? "1" : "0.4";
    };
    line.appendChild(btn);
}

/* 辅助函数：从数组中随机选一个未使用过的词 */
function getRandomUniqueWord(array, usedWords, maxAttempts = 100) {
    let attempts = 0;
    let word;
    do {
        word = array[Math.floor(Math.random() * array.length)];
        attempts++;
        if (attempts > maxAttempts) {
            console.warn("无法找到未使用的词，允许重复");
            break;
        }
    } while (usedWords.has(word));
    usedWords.add(word);
    return word;
}

/* GO - 添加日志记录生成行为 */
function generatePoem() {
    logAction("generate_start", {
        modeBeforeGen: selectedTemplate,
        highlight: highlightEnabled,
        title: titleEnabled
    });

    const poemDiv = document.getElementById("poem");
    poemDiv.innerHTML = "";

    let mode = selectedTemplate;
    if (!mode) {
        const modes = ['A', 'B', 'C'];
        mode = modes[Math.floor(Math.random() * modes.length)];
    }

    const usedWords = new Set();
    lockedWords.forEach(w => {
        if (w.mode === mode) usedWords.add(w.text);
    });
    lockedLines.forEach(l => {
        if (l.mode === mode) {
            Object.values(l.words).forEach(wordObj => {
                if (wordObj && wordObj.text) usedWords.add(wordObj.text);
            });
        }
    });

    if (titleEnabled) generateTitle(mode, usedWords);

    if (mode === "A") generateModeA(usedWords);
    else if (mode === "B") generateModeB(usedWords);
    else if (mode === "C") generateModeC(usedWords);

    applyLockStyles();

    // 原有生成日志（保留）
    logGeneration({
        time: new Date().toISOString(),
        mode: mode,
        highlight: highlightEnabled,
        title: titleEnabled,
        lockedWords: [...lockedWords],
        lockedLines: [...lockedLines]
    });

    // 记录生成完成，附带诗歌简要信息
    const poemText = Array.from(document.querySelectorAll("#poem .word, #poem .highlight, #poem .title-word"))
        .map(w => w.innerText).join("");
    logAction("generate_complete", {
        modeUsed: mode,
        highlight: highlightEnabled,
        title: titleEnabled,
        poemPreview: poemText.substring(0, 100)
    });
}

/* 模式A */
function generateModeA(usedWords){
    const poemDiv=document.getElementById("poem")
    const rows=4

    for(let i=0;i<rows;i++){

        let noun=null,verb=null
        let nounAngle=null,verbAngle=null

        const lineLock=lockedLines.find(l =>
            l.mode==="A" && l.type==="line" && l.row===i
        )

        if(lineLock){
            noun=lineLock.words.noun?.text
            nounAngle=lineLock.words.noun?.angle
            verb=lineLock.words.verb?.text
            verbAngle=lineLock.words.verb?.angle
        }

        lockedWords.forEach(w=>{
            if(w.mode==="A" && w.type==="line" && w.row===i){
                if(w.slot==="noun"){ noun=w.text; nounAngle=w.angle }
                if(w.slot==="verb"){ verb=w.text; verbAngle=w.angle }
            }
        })

        // 随机选词时确保不重复
        if(!noun) noun = getRandomUniqueWord(nouns, usedWords);
        if(!verb) verb = getRandomUniqueWord(verbs, usedWords);

        const line=document.createElement("div")
        line.dataset.row=i
        line.dataset.mode="A"
        line.dataset.type="line"

        const group=document.createElement("div")
        group.className="wordGroup"

        group.appendChild(createWordSpan(noun,"word","noun","A",i,"noun","line",nounAngle))
        group.appendChild(createWordSpan(verb,"word","verb","A",i,"verb","line",verbAngle))

        line.appendChild(group)
        addLineLockButton(line,i,"A","line")
        poemDiv.appendChild(line)
    }

    if(highlightEnabled){
        const type="highlight"
        const row=0

        let text=null,angle=null

        const lineLock=lockedLines.find(l =>
            l.mode==="A" && l.type===type
        )

        const wordLock=lockedWords.find(w =>
            w.mode==="A" && w.type===type
        )

        if(lineLock && lineLock.words.highlight){
            text=lineLock.words.highlight.text
            angle=lineLock.words.highlight.angle
        }
        else if(wordLock){
            text=wordLock.text
            angle=wordLock.angle
        }
        else{
            text = getRandomUniqueWord(highlights, usedWords);
        }

        const line=document.createElement("div")
        line.dataset.row=row
        line.dataset.mode="A"
        line.dataset.type=type

        line.appendChild(createWordSpan(text,"highlight","highlight","A",row,"highlight",type,angle))
        addLineLockButton(line,row,"A",type)
        poemDiv.appendChild(line)
    }
}

/* 模式B */
function generateModeB(usedWords){
    const poemDiv=document.getElementById("poem")

    for(let i=0;i<2;i++){

        let data={
            noun1:null,verb2:null,adj2:null,noun2:null,
            noun1Angle:null,verb2Angle:null,adj2Angle:null,noun2Angle:null
        }

        const lineLock=lockedLines.find(l =>
            l.mode==="B" && l.type==="line" && l.row===i
        )

        if(lineLock){
            Object.keys(data).forEach(k=>{
                if(lineLock.words[k]){
                    data[k]=lineLock.words[k].text
                    data[k+"Angle"]=lineLock.words[k].angle
                }
            })
        }

        lockedWords.forEach(w=>{
            if(w.mode==="B" && w.type==="line" && w.row===i){
                data[w.slot]=w.text
                data[w.slot+"Angle"]=w.angle
            }
        })

        // 随机选词时确保不重复
        if(!data.noun1) data.noun1 = getRandomUniqueWord(nouns, usedWords);
        if(!data.noun2) data.noun2 = getRandomUniqueWord(nouns, usedWords);
        if(!data.verb2) data.verb2 = getRandomUniqueWord(verbs2, usedWords);
        if(!data.adj2) data.adj2 = getRandomUniqueWord(adj2, usedWords);

        const line=document.createElement("div")
        line.dataset.row=i
        line.dataset.mode="B"
        line.dataset.type="line"

        const group=document.createElement("div")
        group.className="wordGroup"

        group.appendChild(createWordSpan(data.noun1,"word","noun","B",i,"noun1","line",data.noun1Angle))
        group.appendChild(createWordSpan(data.verb2,"word","verb2","B",i,"verb2","line",data.verb2Angle))
        group.appendChild(createWordSpan(data.adj2,"word","adj2","B",i,"adj2","line",data.adj2Angle))
        group.appendChild(createWordSpan(data.noun2,"word","noun","B",i,"noun2","line",data.noun2Angle))

        line.appendChild(group)
        addLineLockButton(line,i,"B","line")
        poemDiv.appendChild(line)
    }
    if(highlightEnabled){
        const type="highlight"
        const row=0

        let text=null,angle=null

        const lineLock=lockedLines.find(l =>
            l.mode==="B" && l.type===type
        )

        const wordLock=lockedWords.find(w =>
            w.mode==="B" && w.type===type
        )

        if(lineLock && lineLock.words.highlight){
            text=lineLock.words.highlight.text
            angle=lineLock.words.highlight.angle
        }
        else if(wordLock){
            text=wordLock.text
            angle=wordLock.angle
        }
        else{
            text = getRandomUniqueWord(highlights, usedWords);
        }

        const line=document.createElement("div")
        line.dataset.row=row
        line.dataset.mode="B"
        line.dataset.type=type

        line.appendChild(
            createWordSpan(text,"highlight","highlight","B",row,"highlight",type,angle)
        )

        addLineLockButton(line,row,"B",type)
        poemDiv.appendChild(line)
    }
}

/* 模式C：四行，每行格式：名词 + 副词(…得) + 形容词 */
function generateModeC(usedWords) {
    const poemDiv = document.getElementById("poem")
    const rows = 2  // 四行

    for (let i = 0; i < rows; i++) {
        // 初始化当前行的三个词及其角度
        let noun = null, adv = null, adj = null
        let nounAngle = null, advAngle = null, adjAngle = null

        // 检查行锁（整行锁定）
        const lineLock = lockedLines.find(l =>
            l.mode === "C" && l.type === "line" && l.row === i
        )

        if (lineLock) {
            // 从行锁中读取每个槽位的词和角度
            if (lineLock.words.noun3) {
                noun = lineLock.words.noun3.text
                nounAngle = lineLock.words.noun3.angle
            }
            if (lineLock.words.adv3) {
                adv = lineLock.words.adv3.text
                advAngle = lineLock.words.adv3.angle
            }
            if (lineLock.words.adj3) {
                adj = lineLock.words.adj3.text
                adjAngle = lineLock.words.adj3.angle
            }
        }

        // 检查单个词锁（可能覆盖行锁中的个别词）
        lockedWords.forEach(w => {
            if (w.mode === "C" && w.type === "line" && w.row === i) {
                if (w.slot === "noun3") {
                    noun = w.text
                    nounAngle = w.angle
                }
                if (w.slot === "adv3") {
                    adv = w.text
                    advAngle = w.angle
                }
                if (w.slot === "adj3") {
                    adj = w.text
                    adjAngle = w.angle
                }
            }
        })

        // 对于未被锁定的槽位，从对应词库中随机选取（不重复）
        if (!noun) noun = getRandomUniqueWord(noun3, usedWords)
        if (!adv) adv = getRandomUniqueWord(adv3, usedWords)
        if (!adj) adj = getRandomUniqueWord(adj3, usedWords)

        // 创建行容器
        const line = document.createElement("div")
        line.dataset.row = i
        line.dataset.mode = "C"
        line.dataset.type = "line"

        const group = document.createElement("div")
        group.className = "wordGroup"

        // 按顺序添加三个词块
        group.appendChild(createWordSpan(noun, "word", "noun3", "C", i, "noun3", "line", nounAngle))
        group.appendChild(createWordSpan(adv, "word", "adv3", "C", i, "adv3", "line", advAngle))
        group.appendChild(createWordSpan(adj, "word", "adj3", "C", i, "adj3", "line", adjAngle))

        line.appendChild(group)
        addLineLockButton(line, i, "C", "line")
        poemDiv.appendChild(line)
    }

    // 如果开启了高亮，添加高亮行（与模式A/B逻辑相同）
    if (highlightEnabled) {
        const type = "highlight"
        const row = 0  // 高亮行固定行号0（与模式A/B一致）

        let text = null, angle = null

        const lineLock = lockedLines.find(l =>
            l.mode === "C" && l.type === type
        )

        const wordLock = lockedWords.find(w =>
            w.mode === "C" && w.type === type
        )

        if (lineLock && lineLock.words.highlight) {
            text = lineLock.words.highlight.text
            angle = lineLock.words.highlight.angle
        } else if (wordLock) {
            text = wordLock.text
            angle = wordLock.angle
        } else {
            text = getRandomUniqueWord(highlights, usedWords)
        }

        const line = document.createElement("div")
        line.dataset.row = row
        line.dataset.mode = "C"
        line.dataset.type = type

        line.appendChild(createWordSpan(text, "highlight", "highlight", "C", row, "highlight", type, angle))
        addLineLockButton(line, row, "C", type)
        poemDiv.appendChild(line)
    }
}

/* title */
function generateTitle(mode, usedWords){
    const poemDiv = document.getElementById("poem")

    const type = "title"
    const row = 0

    let text = null, angle = null

    const lineLock = lockedLines.find(l =>
        l.mode === mode && l.type === type
    )

    const wordLock = lockedWords.find(w =>
        w.mode === mode && w.type === type
    )

    if (lineLock && lineLock.words.title) {
        text = lineLock.words.title.text
        angle = lineLock.words.title.angle
    } else if (wordLock) {
        text = wordLock.text
        angle = wordLock.angle
    } else {
        // 从词库中随机选取未使用的标题
        text = getRandomUniqueWord(titles, usedWords);
        // 为标题生成专属角度：范围 0.3~0.8 或 -0.8~-0.3
        const sign = Math.random() < 0.5 ? -1 : 1;
        angle = sign * (0.3 + Math.random() * 0.5);
    }

    const line = document.createElement("div")
    line.dataset.row = row
    line.dataset.mode = mode
    line.dataset.type = type
    line.classList.add("titleLine")

    // 使用 title-word 类名创建标题块
    line.appendChild(createWordSpan(text, "title-word", "title", mode, row, "title", type, angle))
    addLineLockButton(line, row, mode, type)

    poemDiv.appendChild(line)
}

/* GO按钮 */
document.getElementById("goButton")
.addEventListener("click",generatePoem)

/* 日志，存储生成记录，用于数据分析；每次点击go，把数据记录下来 */
function logGeneration(data){
    let logs = JSON.parse(localStorage.getItem("poemLogs") || "[]")
    logs.push(data)
    localStorage.setItem("poemLogs", JSON.stringify(logs))
}

/* 导出日志 */
document.getElementById("exportData").onclick = function(){
    const data = localStorage.getItem("poemLogs")
    const blob = new Blob([data], {type: "application/json"})
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "poem_logs.json"
    a.click()
}

// 复制文本 - 添加日志
document.getElementById("copyTextBtn").addEventListener("click", () => {
    const poemDiv = document.getElementById("poem");
    if (!poemDiv.children.length) {
        alert("还没有生成诗歌，请先点击 GO");
        return;
    }
    let textLines = [];
    const lines = poemDiv.querySelectorAll("#poem > div");
    lines.forEach(line => {
        const words = line.querySelectorAll(".word, .highlight, .title-word");
        const lineText = Array.from(words).map(w => w.innerText).join('');
        if (lineText.trim()) textLines.push(lineText);
    });
    const finalText = textLines.join('\n');
    navigator.clipboard.writeText(finalText).then(() => {
        alert("诗歌已复制到剪贴板");
        logAction("copy_text", { contentPreview: finalText.substring(0, 200) });
    }).catch(err => {
        console.error("复制失败", err);
        alert("复制失败，请手动复制");
    });
});

// 保存图片 - 添加日志
document.getElementById("saveImageBtn").addEventListener("click", async () => {
    const originalPoem = document.getElementById("poem");
    if (!originalPoem.children.length) {
        alert("还没有生成诗歌，请先点击 GO");
        return;
    }

    const clonePoem = originalPoem.cloneNode(true);
    clonePoem.querySelectorAll('.lineLock').forEach(btn => {
        btn.style.display = 'none';
    });

    const container = document.createElement("div");
    container.style.width = "450px";
    container.style.height = "600px";
    container.style.backgroundColor = "#000000";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.position = "absolute";
    container.style.top = "-9999px";
    container.style.left = "-9999px";

    const innerWrapper = document.createElement("div");
    innerWrapper.style.padding = "20px 10px";
    innerWrapper.style.maxWidth = "100%";
    innerWrapper.style.boxSizing = "border-box";

    innerWrapper.appendChild(clonePoem);
    container.appendChild(innerWrapper);
    document.body.appendChild(container);
    container.classList.add("no-lock-icons");

    try {
        const canvas = await html2canvas(container, {
            backgroundColor: "#000000",
            scale: 2,
            logging: false,
            useCORS: false
        });
        const link = document.createElement("a");
        link.download = "poem.png";
        link.href = canvas.toDataURL();
        link.click();
        logAction("export_image");
    } catch (error) {
        console.error("截图失败", error);
        alert("生成图片失败，请重试");
    } finally {
        document.body.removeChild(container);
    }
});
