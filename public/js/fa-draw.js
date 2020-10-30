const fix = (arr, cb) => {
    const tm = arr, fixtures = []
    while(tm.length>0) {
        let num = Math.floor(Math.random()*tm.length)        
        if (num === 0) num++
    const firstTeam = tm[0], secondTeam = tm[num] 
        const draw = [`${firstTeam} Vs ${secondTeam}`]
        fixtures.push(draw)
    tm.splice(num, 1); tm.shift()
    }
    cb(fixtures)
}

const faDrawBtn = document.querySelector('.fa-draw-btn')
faDrawBtn.addEventListener('click', () => {
    const teams = document.querySelector('.fa-teams').value.trim()
    const drawBoard = document.querySelector('.draw-pane')
    const arr = teams.split(' ')
    fix(arr, (fixtures) => {
        if( drawBoard.childElementCount !== 0 ) clearBoard(drawBoard)
        let i = 0
        while(i < fixtures.length) {
            const str = fixtures[i].join(' ')
            const det = str.split(' ')
            const draw = document.createElement('div')
            draw.setAttribute('class', 'fa-draw flex rel max-percent margin-auto')
            draw.innerHTML = `
    <div class="team1 rel margin-auto"> ${det[0]}</div>
    <div class="vs rel margin-auto">${det[1]}</div>
    <div class="team2 rel margin-auto">${det[2]}</div>`
            drawBoard.append(draw)
            i++
        }
    })
})
const clearBoard = (pane) => {
    const childCount = pane.childElementCount
    let i = 0
    do {
        pane.removeChild(pane.children[pane.children.length - 1])
        i++
    } while(i < childCount)
}
