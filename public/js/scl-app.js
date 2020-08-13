window.addEventListener('DOMContentLoaded', () => {    
    setTimeout(() => {
        const table = document.querySelectorAll('.gbody')
        const snDis = document.querySelector('#scl-id')
        fetch('/request?command=sclseason').then((response) => {
            response.json().then((data) => {
                snDis.textContent = data.season
                createSeasonSwitch(data.season, snDis)
                readGroups('fetchGS', table, data.season)
            })
        })      
    }, 500)
  
})
const homeDraw = document.querySelectorAll('.home-draw')
const awayDraw = document.querySelectorAll('.away-draw')
const flHS = document.querySelectorAll('.fl-home-score')
const flAS = document.querySelectorAll('.fl-away-score')
const slHS = document.querySelectorAll('.sl-home-score')
const slAS = document.querySelectorAll('.sl-away-score')
const finHS = document.querySelectorAll('.fin-home-score')
const finAS = document.querySelectorAll('.fin-away-score')
const readGroups = (command, table, sn) => {
    const groups = ['A', 'B', 'C', 'D']
    for (i=0; i<4; i++) {
        const body = table[i]
        const g = groups[i]
        const url = `/request?command=${command}&sn=${sn}&g=${g}`
fetch(url).then((response) => {
        response.json().then((data) => {
            if (data.length === 0) return alert('Table is blank')
            data.sort(dynamicSort('Pts', 'desc'))
                for(let i=0; i<10; i++) {
                        distribute(body, data.length, data)
              }       
        })
    })
    }
    readKO('fetchKO', sn)
}
const readKO = (command, sn) => {
    const url = `/request?command=${command}&sn=${sn}`
    let i = 0
    fetch(url).then((response) => {
        response.json().then((data) => {
            draw(i, data)          
        })
    })
}
const draw = (i, data) => {
    for (; i<data.length; i++) {
        homeDraw[i].textContent = data[i].firstLeg.home
        awayDraw[i].textContent = data[i].firstLeg.away
        if (data[i].firstLeg.played) {
            if (data[i].qualified === data[i].firstLeg.home) {
                homeDraw[i].style.fontWeight = '600'
                homeDraw[i].style.color = 'green'
            } else {
                awayDraw[i].style.fontWeight = '600'
                awayDraw[i].style.color = 'green'
            }
        }
        flHS[i].textContent = data[i].firstLeg.hs
        flAS[i].textContent = data[i].firstLeg.as
        slHS[i].textContent = data[i].secondLeg.hs
        slAS[i].textContent = data[i].secondLeg.as
        finHS[i].textContent = parseInt(data[i].firstLeg.hs) + parseInt(data[i].secondLeg.as )
        finAS[i].textContent = parseInt(data[i].firstLeg.as) + parseInt(data[i].secondLeg.hs)
        document.querySelector('#coronation-logo').setAttribute('src', `../img/${data[6].qualified}.png`)
    }
}
  let distribute = (table, rowCount, teams) => {
      for(i=0; i<rowCount; i++) {
                table.rows[i].cells[1].textContent = teams[i].team
                table.rows[i].cells[2].textContent = teams[i].P
                table.rows[i].cells[3].textContent = teams[i].W
                table.rows[i].cells[4].textContent = teams[i].D
                table.rows[i].cells[5].textContent = teams[i].L
                table.rows[i].cells[6].textContent = teams[i].GF
                table.rows[i].cells[7].textContent = teams[i].GA
                table.rows[i].cells[8].textContent = teams[i].GD
                table.rows[i].cells[9].textContent = teams[i].Pts               
        }
  }
let createSeasonSwitch = (season, snDis) => {
    let panel = document.querySelector('.switch-right')
    panel.addEventListener('click', (e) => {
        snDis.textContent = e.target.textContent
        const table = document.querySelectorAll('.gbody')
        readGroups('fetchGS', table, e.target.textContent)
    })
    for (i = 0; i < season; i++) {
        let btn = document.createElement('button')
        btn.textContent = i + 1
        panel.append(btn)
        panel.scrollLeft = btn.clientWidth * (i - 1)
    }
}
  let dynamicSort = (prop, order) => {
      let sortOrder = 1
      if (order === 'desc') {
        sortOrder = -1
      }
      return function (a, b) {
        //   a should come before b in the sorted order
        if (a[prop] < b[prop]) {
            return -1 * sortOrder
            // a should come after b in sorted order
        } else if (a[prop] > b[prop]) {
            return 1 * sortOrder
            // a and b are the same 
        } else {
            return 0 * sortOrder
        }
      }
  }
// const draw = document.querySelectorAll('.draw')
// homeDraw[0].textContent = 'Dragon Balls Super'
// alert(finAS.length)
 