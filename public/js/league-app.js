const resultPane = document.querySelector('.league-results-pane')
const snDis = document.querySelector('#sn-display')
const dayDis = document.querySelector('#day-display')
const page = document.querySelectorAll('.page')
window.addEventListener('DOMContentLoaded', () => {    
    setTimeout(() => {
        const table = document.querySelector('#tbody')
        // const resPane = document.querySelector('#results')
        fetch('/metadata').then((response) => {
            response.json().then((data) => {
                snDis.textContent = data.league.season
                createSeasonSwitch(data.league.season, data.league.day)
                readTeam(table, data.league.season)
                readResult(resultPane, data.league.season, data.league.day, 0)
            })
        })      
    }, 500)
  
})
// right here i am making use of the sort() method with a dynamicSort
const readTeam = (table, sn) => {
    const url = `/table/${sn}`
fetch(url).then((response) => {
        response.json().then((data) => {
            data.sort(dynamicSort('Pts', 'GD')) //it sorts the array of objects using the points value
            for(i=1; i<=data.length; i++) {
                addRows(table)                
              }
                for(let i=0; i<10; i++) {
                        addColumns(table, data.length, data)
              }
            
        })
    })
}
const readResult = (pane, sn, day, pager) => {
    if ( day === 0 ) {
        return pane.innerHTML = `<div class="no-result rel max-percent margin-auto"> <div align="center" class="abs margin-auto centered" >No Results!</div> </div>` 
    }
    const url = `/league/result?season=${sn}&day=${day}&pager=${pager}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            if ( data.feedBack ) {
                return pane.innerHTML = `<div class="no-result rel max-percent margin-auto"> <div align="center" class="abs margin-auto centered" >${data.feedBack}</div> </div>`
            }            
            for (i=0; i<data.length; i++) {                    
                let leg = data[i].leg === 'firstLeg'? '1st Leg' : '2nd Leg'
                const div = document.createElement('div')
                div.setAttribute('align', 'center')
                div.classList.add('league-result-match', 'flex', 'rel', 'max-percent', 'margin-auto')
                div.innerHTML = `
                <div class="league-result-pane rel flex margin-auto">
                    <div class="leg abs margin-auto">${leg}</div>
                <div class="home-team-name rel margin-auto">
                    ${data[i].ht}
                    <img src="/team/logo/${data[i].ht}" alt="" class="team-logos home-logo abs margin-auto">
                </div>
                <div class="home-team-score rel margin-auto">${data[i].hs}</div>
                <div class="away-team-score rel margin-auto">${data[i].as}</div>
                <div class="away-team-name rel margin-auto">
                    ${data[i].at}
                    <img src="/team/logo/${data[i].at}" alt="" class="team-logos away-logo abs margin-auto">
                </div>
                </div>
            `
            pane.append(div)
            }
        })
    })
}


let addRows = (table) => {
    let row = table.insertRow(table.rows.length)
  }
  let positionIndicator = (table, i) => {
      switch (i) {
        case 0: case 1: case 2: case 3:
    table.rows[i].cells[0].classList.add('first-four')
    break;
        case 4: case 5:
    table.rows[i].cells[0].classList.add('five-six')
    break;
        case table.rows.length - 1: case table.rows.length - 2: case table.rows.length - 3: case table.rows.length - 4:
    table.rows[i].cells[0].classList.add('last-four')
    }
} 
  let addColumns = (table, rowCount, teams) => {
      let cellCount = table.rows[0].cells.length
      let cell = []
      for(i=0; i<rowCount; i++) {
      cell[cellCount] = table.rows[i].insertCell(cellCount) 
          switch ( cellCount ) {
            case 0:
                  cell[cellCount].textContent = i + 1
                  positionIndicator(table, i)
                  break;
            case 1:
                cell[cellCount].innerHTML = `<img class='logo-thumb' src='/team/logo/${teams[i].team}'> <span> ${teams[i].team}</span>`
                document.querySelector('.coronation-body').innerHTML = `<img id='coronation-logo' src='/team/logo/${teams[0].team}'>`
                break;
            case 2:
                cell[cellCount].textContent = teams[i].P
                break;
            case 3:
                cell[cellCount].textContent = teams[i].W
                break;
            case 4:
                cell[cellCount].textContent = teams[i].D
                break;
            case 5:
                cell[cellCount].textContent = teams[i].L
                break;
            case 6:
                cell[cellCount].textContent = teams[i].GF
                break;
            case 7:
                cell[cellCount].textContent = teams[i].GA
                break;
            case 8:
                cell[cellCount].textContent = teams[i].GD
                break;
            case 9:
                cell[cellCount].textContent = teams[i].Pts               
          }

      }
  }
let createSeasonSwitch = (season, day) => {
    let panel = document.querySelector('.switch-right')
    let dayPanel = document.querySelector('.switch-right-result')
    panel.addEventListener('click', (e) => {
        snDis.textContent = e.target.textContent
        let table = document.querySelector('#tbody')
        deleteTable(table)        
        const sn = parseInt(e.target.textContent) - 0
        howManyDaysInTheSeason(sn, (day) => {
            createDaySwitch(day, dayPanel)
            clearPane(resultPane.childElementCount, resultPane)        
                readResult(resultPane, sn, day, 0)
        })        
        readTeam(table, sn)
          
    })
    dayPanel.addEventListener('click', (e) => {
        dayDis.textContent = e.target.textContent        
        if (resultPane.childElementCount > 0) clearPane(resultPane.childElementCount, resultPane)
        const day = parseInt(e.target.textContent) - 0
        const sn = parseInt(snDis.textContent) - 0
        readResult(resultPane, sn, day, 0)
    })
    for (i = 0; i < season; i++) {
        let btn = document.createElement('button')
        btn.textContent = i + 1
        panel.append(btn)
        panel.scrollLeft = btn.clientWidth * (i - 1)
    }
    createDaySwitch(day, dayPanel)
}
const createDaySwitch = (day, dayPanel) => {
    if (dayPanel.childElementCount > 0) {
        clearPane(dayPanel.childElementCount, dayPanel)
    }
    dayDis.textContent = day !== 0? day : ''
    for (i = 0; i < day; i++) {
        let btn = document.createElement('button')
        btn.textContent = i + 1         
        dayPanel.append(btn)
        dayPanel.scrollLeft = btn.clientWidth * (i - 1)
    }
}
const howManyDaysInTheSeason = (season, cb) => {
    const url = `season/day/${season}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            cb(data.day)
        })
    })
}
for (i=0; i<page.length; i++) {
    page[i].addEventListener('click', (e) => {
        const day = parseInt(dayDis.textContent) - 0
        const sn = parseInt(snDis.textContent) - 0
        clearPane(resultPane.childElementCount, resultPane)
        const pager = (e.target.textContent) - 0
        switch(pager) {
            case 1:
                readResult(resultPane, sn, day, 0)
                break;
            case 2:
                readResult(resultPane, sn, day, 5)
                break;
            case 3:
                readResult(resultPane, sn, day, 10)
                break;
            case 4:
                readResult(resultPane, sn, day, 15)
        }
    })
}
let deleteTable = (table) => {
    let lastRow = table.rows.length - 1
    for (i = lastRow; i >= 0; i--) {
        table.deleteRow(i)
    }
}
let clearPane = (childCount, clearPane) => {
    let i = 0
        do  {
            clearPane.removeChild(clearPane.children[clearPane.children.length - 1])
            i++
        } while (i < childCount)
}
// the dynamicSort() function
let dynamicSort = (prop, tieBreaker) => {
    const sortOrder = -1
    return function (a, b) {
        //   a should come before b in the sorted order
        if (a[prop] < b[prop]) return -1 * sortOrder
        // a should come after b in sorted order
            else if (a[prop] > b[prop]) return 1 * sortOrder
            // a and b are the same, compare by the tieBreaker value
                if (a[tieBreaker] < b[tieBreaker]) return -1 * sortOrder
                    else if (a[tieBreaker] > b[tieBreaker]) return 1 * sortOrder 
                        return 0 * sortOrder
    }
}