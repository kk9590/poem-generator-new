// main.js

const filterButton = document.getElementById("filterButton")
const filterPanel = document.getElementById("filterPanel")
filterButton.addEventListener("click",()=>{
    filterPanel.classList.toggle("hidden")
})

document.addEventListener("click",(e)=>{
    if(!filterPanel.contains(e.target) && 
       e.target !== filterButton){
        filterPanel.classList.add("hidden")
    }
})



let selectedTemplate = null
let highlightEnabled = false
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

/* 随机角度 */
function randomAngle(){
    if(Math.random()<0.5){
        return -2 + Math.random()
    }
    return 0.5 + Math.random()
}

/* 创建词块 */
function createWordSpan(text,className,role,mode,row,slot,angle=null){
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
    span.addEventListener("click",toggleWordLock)
    return span
}

/* 词锁 */
function toggleWordLock(e){
    const span=e.currentTarget
    const text=span.innerText
    const role=span.dataset.role
    const mode=span.dataset.mode
    const row=parseInt(span.dataset.row)
    const slot=span.dataset.slot
    const angle=span.dataset.angle
    const index=lockedWords.findIndex(w=>
        w.role===role &&
        w.row===row &&
        w.slot===slot &&
        w.mode===mode
    )
    if(index===-1){
        lockedWords.push({text,role,mode,row,slot,angle})
    }else{
        lockedWords.splice(index,1)
    }
    applyLockStyles()
}

/* 行锁 */
function toggleLineLock(row,mode){
    const index=lockedLines.findIndex(l=>
        l.row===row && l.mode===mode
    )
    if(index===-1){
        const line=document.querySelectorAll("#poem > div")[row]
        const words=line.querySelectorAll(".word, .highlight")
        const saved={}
        words.forEach(w=>{
            saved[w.dataset.slot]={
                text:w.innerText,
                angle:w.dataset.angle
            }
        })
        lockedLines.push({row,mode,words:saved})
    }else{
        lockedLines.splice(index,1)
    }
}

/* 应用词锁样式 */
function applyLockStyles(){
    const spans=document.querySelectorAll('#poem .word, #poem .highlight')
    spans.forEach(span=>{
        const role=span.dataset.role
        const row=parseInt(span.dataset.row)
        const slot=span.dataset.slot
        const locked=lockedWords.some(w=>
            w.role===role &&
            w.row===row &&
            w.slot===slot
        )
        span.classList.toggle("locked",locked)
    })
}

/* 行锁按钮 */
function addLineLockButton(line,row,mode){
    const btn=document.createElement("span")
    btn.innerText="🔒"
    btn.className="lineLock"
    const locked=lockedLines.some(l=>
        l.row===row && l.mode===mode
    )
    btn.style.opacity=locked ? "1" : "0.4"
    btn.onclick=(e)=>{
        e.stopPropagation()
        toggleLineLock(row,mode)
        const lockedNow=lockedLines.some(l=>
            l.row===row && l.mode===mode
        )
        btn.style.opacity=lockedNow ? "1" : "0.4"
    }
    line.appendChild(btn)
}

/* GO */
function generatePoem(){
    const poemDiv=document.getElementById("poem")
    poemDiv.innerHTML=""
    let mode
    if(selectedTemplate){
        mode=selectedTemplate
    }
    else if(lockedWords.length>0){
        mode=lockedWords[0].mode
    }
    else{
        mode=Math.random()<0.5 ? "A" : "B"
    }
    if(mode==="A"){
        generateModeA()
    }else{
        generateModeB()
    }
    applyLockStyles()
}

/* 模式A */
function generateModeA(){
    const poemDiv=document.getElementById("poem")
    const rows=4
    const rowsData=[]
    for(let i=0;i<rows;i++){
        rowsData.push({
            noun:null,
            verb:null,
            nounAngle:null,
            verbAngle:null
        })
    }
    lockedLines.forEach(l=>{
        if(l.mode!=="A") return
        if(l.row<rows){
            rowsData[l.row].noun=l.words.noun.text
            rowsData[l.row].nounAngle=l.words.noun.angle
            rowsData[l.row].verb=l.words.verb.text
            rowsData[l.row].verbAngle=l.words.verb.angle
        }
    })
    lockedWords.forEach(w=>{
        if(w.mode!=="A") return
        if(w.row<rows){
            rowsData[w.row][w.slot]=w.text
            rowsData[w.row][w.slot+"Angle"]=w.angle
        }
    })
    rowsData.forEach(row=>{
        if(!row.noun)
            row.noun=nouns[Math.floor(Math.random()*nouns.length)]
        if(!row.verb)
            row.verb=verbs[Math.floor(Math.random()*verbs.length)]
    })
    rowsData.forEach((row,i)=>{
        const line=document.createElement("div")
        const wordGroup=document.createElement("div")
        wordGroup.className="wordGroup"
        const s1=createWordSpan(row.noun,"word","noun","A",i,"noun",row.nounAngle)
        const s2=createWordSpan(row.verb,"word","verb","A",i,"verb",row.verbAngle)
        wordGroup.appendChild(s1)
        wordGroup.appendChild(s2)
        line.appendChild(wordGroup)
        addLineLockButton(line,i,"A")
        poemDiv.appendChild(line)

    })
    if(highlightEnabled){
        const highlightRow=rows
        let text
        let angle=null
        const wordLocked = lockedWords.find(w =>
            w.mode==="A" &&
            w.row===highlightRow &&
            w.slot==="highlight"
        )
        const lineLocked = lockedLines.find(l =>
            l.row===highlightRow && l.mode==="A"
        )
        if(wordLocked){
            text=wordLocked.text
            angle=wordLocked.angle
        }
        else if(lineLocked){
            text=lineLocked.words.highlight.text
            angle=lineLocked.words.highlight.angle
        }
        else{
            text=highlights[Math.floor(Math.random()*highlights.length)]
        }
        const line=document.createElement("div")
        const span=createWordSpan(text,"highlight","highlight","A",highlightRow,"highlight",angle)
        line.appendChild(span)
        addLineLockButton(line,highlightRow,"A")
        poemDiv.appendChild(line)
    }
}

/* 模式B */
function generateModeB(){
    const poemDiv=document.getElementById("poem")
    const rows=2
    const rowsData=[]
    for(let i=0;i<rows;i++){
        rowsData.push({
            noun1:null,
            verb2:null,
            adj2:null,
            noun2:null,
            noun1Angle:null,
            verb2Angle:null,
            adj2Angle:null,
            noun2Angle:null
        })
    }
    lockedLines.forEach(l=>{
        if(l.mode!=="B") return
        if(l.row<rows){
            rowsData[l.row].noun1=l.words.noun1.text
            rowsData[l.row].noun1Angle=l.words.noun1.angle
            rowsData[l.row].verb2=l.words.verb2.text
            rowsData[l.row].verb2Angle=l.words.verb2.angle
            rowsData[l.row].adj2=l.words.adj2.text
            rowsData[l.row].adj2Angle=l.words.adj2.angle
            rowsData[l.row].noun2=l.words.noun2.text
            rowsData[l.row].noun2Angle=l.words.noun2.angle
        }
    })
    lockedWords.forEach(w=>{
        if(w.mode!=="B") return
        if(w.row<rows){
            rowsData[w.row][w.slot]=w.text
            rowsData[w.row][w.slot+"Angle"]=w.angle
        }
    })
    rowsData.forEach(row=>{
        if(!row.noun1)
            row.noun1=nouns[Math.floor(Math.random()*nouns.length)]
        if(!row.noun2)
            row.noun2=nouns[Math.floor(Math.random()*nouns.length)]
        if(!row.verb2)
            row.verb2=verbs2[Math.floor(Math.random()*verbs2.length)]
        if(!row.adj2)
            row.adj2=adj2[Math.floor(Math.random()*adj2.length)]
    })
    rowsData.forEach((row,i)=>{
        const line=document.createElement("div")
        const wordGroup=document.createElement("div")
        wordGroup.className="wordGroup"
        const s1=createWordSpan(row.noun1,"word","noun","B",i,"noun1",row.noun1Angle)
        const s2=createWordSpan(row.verb2,"word","verb2","B",i,"verb2",row.verb2Angle)
        const s3=createWordSpan(row.adj2,"word","adj2","B",i,"adj2",row.adj2Angle)
        const s4=createWordSpan(row.noun2,"word","noun","B",i,"noun2",row.noun2Angle)
        wordGroup.appendChild(s1)
        wordGroup.appendChild(s2)
        wordGroup.appendChild(s3)
        wordGroup.appendChild(s4)
        line.appendChild(wordGroup)
        addLineLockButton(line,i,"B")
        poemDiv.appendChild(line)
    })
    if(highlightEnabled){
        const highlightRow=rows
        let text
        let angle=null
        const wordLocked = lockedWords.find(w =>
            w.mode==="B" &&
            w.row===highlightRow &&
            w.slot==="highlight"
        )
        const lineLocked = lockedLines.find(l =>
            l.row===highlightRow && l.mode==="B"
        )
        if(wordLocked){
            text=wordLocked.text
            angle=wordLocked.angle
        }
        else if(lineLocked){
            text=lineLocked.words.highlight.text
            angle=lineLocked.words.highlight.angle
        }
        else{
            text=highlights[Math.floor(Math.random()*highlights.length)]
        }
        const line=document.createElement("div")
        const span=createWordSpan(text,"highlight","highlight","B",highlightRow,"highlight",angle)
        line.appendChild(span)
        addLineLockButton(line,highlightRow,"B")
        poemDiv.appendChild(line)
    }
}

/* GO按钮 */
document.getElementById("goButton")
.addEventListener("click",generatePoem)
