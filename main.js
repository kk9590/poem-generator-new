const filterButton = document.getElementById("filterButton")
const filterPanel = document.getElementById("filterPanel")

filterButton.addEventListener("click",()=>{
    filterPanel.classList.toggle("hidden")
})

document.addEventListener("click",(e)=>{
    if(!filterPanel.contains(e.target) && e.target !== filterButton){
        filterPanel.classList.add("hidden")
    }
})

let selectedTemplate = null
let highlightEnabled = false
let titleEnabled = false
let lockedWords = []
let lockedLines = []

/* 模板按钮 */
document.querySelectorAll('.templateOption[data-mode]').forEach(option => {
    option.addEventListener('click', () => {
        const mode = option.dataset.mode
        if (selectedTemplate === mode) {
            selectedTemplate = null
            option.classList.remove('selected')
        } else {
            selectedTemplate = mode
            document.querySelectorAll('.templateOption[data-mode]')
                .forEach(o => o.classList.remove('selected'))
            option.classList.add('selected')
        }
    })
})

/* highlight按钮 */
const highlightBtn = document.getElementById("highlightToggle")
highlightBtn.addEventListener("click", () => {
    highlightEnabled = !highlightEnabled
    highlightBtn.classList.toggle("selected", highlightEnabled)
})

/* title按钮 */
const titleBtn = document.getElementById("titleToggle")
titleBtn.addEventListener("click", () => {
    titleEnabled = !titleEnabled
    titleBtn.classList.toggle("selected", titleEnabled)
})

function randomAngle(){
    return Math.random()<0.5 ? -2 + Math.random() : 0.5 + Math.random()
}

/* 创建词块 */
function createWordSpan(text,className,role,mode,row,slot,type,angle=null){
    const span=document.createElement("span")
    span.className=className
    span.innerText=text

    const rot = angle!==null ? angle : randomAngle()
    span.style.transform=`rotate(${rot}deg)`

    span.dataset.angle=rot
    span.dataset.role=role
    span.dataset.mode=mode
    span.dataset.row=row
    span.dataset.slot=slot
    span.dataset.type=type

    span.addEventListener("click",toggleWordLock)
    return span
}

/* 词锁 */
function toggleWordLock(e){
    const span=e.currentTarget

    const data={
        text:span.innerText,
        role:span.dataset.role,
        mode:span.dataset.mode,
        row:parseInt(span.dataset.row),
        slot:span.dataset.slot,
        type:span.dataset.type,
        angle:span.dataset.angle
    }

    const index=lockedWords.findIndex(w=>
        w.mode===data.mode &&
        w.row===data.row &&
        w.slot===data.slot &&
        w.type===data.type
    )

    if(index===-1){
        lockedWords.push(data)
    }else{
        lockedWords.splice(index,1)
    }

    applyLockStyles()
}

/* 行锁 */
function toggleLineLock(row,mode,type){
    const index=lockedLines.findIndex(l=>
        l.row===row && l.mode===mode && l.type===type
    )

    if(index===-1){
        const line=[...document.querySelectorAll("#poem > div")]
            .find(l =>
                parseInt(l.dataset.row)===row &&
                l.dataset.mode===mode &&
                l.dataset.type===type
            )

        if(!line) return

        const words=line.querySelectorAll(".word, .highlight")
        const saved={}

        words.forEach(w=>{
            saved[w.dataset.slot]={
                text:w.innerText,
                angle:w.dataset.angle
            }
        })

        lockedLines.push({row,mode,type,words:saved})
    }else{
        lockedLines.splice(index,1)
    }
}

/* 样式 */
function applyLockStyles(){
    const spans=document.querySelectorAll('#poem .word, #poem .highlight')

    spans.forEach(span=>{
        const locked=lockedWords.some(w=>
            w.mode===span.dataset.mode &&
            w.row==span.dataset.row &&
            w.slot===span.dataset.slot &&
            w.type===span.dataset.type
        )
        span.classList.toggle("locked",locked)
    })
}

/* 行锁按钮 */
function addLineLockButton(line,row,mode,type){
    const btn=document.createElement("span")
    btn.innerText="🔒"
    btn.className="lineLock"

    const locked=lockedLines.some(l=>
        l.row===row && l.mode===mode && l.type===type
    )

    btn.style.opacity=locked ? "1" : "0.4"

    btn.onclick=(e)=>{
        e.stopPropagation()
        toggleLineLock(row,mode,type)

        const lockedNow=lockedLines.some(l=>
            l.row===row && l.mode===mode && l.type===type
        )

        btn.style.opacity=lockedNow ? "1" : "0.4"
    }

    line.appendChild(btn)
}

/* GO */
function generatePoem(){
    const poemDiv=document.getElementById("poem")
    poemDiv.innerHTML=""

    let mode = selectedTemplate || (Math.random()<0.5 ? "A":"B")

    if(titleEnabled){
        generateTitle(mode)
    }

    mode==="A" ? generateModeA() : generateModeB()

    applyLockStyles()
}

/* 模式A */
function generateModeA(){
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

        if(!noun) noun=nouns[Math.floor(Math.random()*nouns.length)]
        if(!verb) verb=verbs[Math.floor(Math.random()*verbs.length)]

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
            text=highlights[Math.floor(Math.random()*highlights.length)]
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
function generateModeB(){
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

        if(!data.noun1) data.noun1=nouns[Math.random()*nouns.length|0]
        if(!data.noun2) data.noun2=nouns[Math.random()*nouns.length|0]
        if(!data.verb2) data.verb2=verbs2[Math.random()*verbs2.length|0]
        if(!data.adj2) data.adj2=adj2[Math.random()*adj2.length|0]

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
            text=highlights[Math.floor(Math.random()*highlights.length)]
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

/* title */
function generateTitle(mode){
    const poemDiv=document.getElementById("poem")

    const type="title"
    const row=0

    let text=null,angle=null

    const lineLock=lockedLines.find(l =>
        l.mode===mode && l.type===type
    )

    const wordLock=lockedWords.find(w =>
        w.mode===mode && w.type===type
    )

    if(lineLock && lineLock.words.title){
        text=lineLock.words.title.text
        angle=lineLock.words.title.angle
    }
    else if(wordLock){
        text=wordLock.text
        angle=wordLock.angle
    }
    else{
        text=titles[Math.floor(Math.random()*titles.length)]
    }

    const line=document.createElement("div")
    line.dataset.row=row
    line.dataset.mode=mode
    line.dataset.type=type
    line.classList.add("titleLine")

    line.appendChild(createWordSpan(text,"highlight","title",mode,row,"title",type,angle))
    addLineLockButton(line,row,mode,type)

    poemDiv.appendChild(line)
}

/* GO按钮 */
document.getElementById("goButton")
.addEventListener("click",generatePoem)
