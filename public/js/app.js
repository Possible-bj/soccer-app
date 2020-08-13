window.addEventListener('DOMContentLoaded', () => {    
    setTimeout(() => {
        const table = document.querySelector('#tbody')
        const snDis = document.querySelector('#sn-display')
        const resPane = document.querySelector('#results')
        fetch('/request?command=leagueseason').then((response) => {
            response.json().then((data) => {
                snDis.textContent = data.season
                readTeam('read', table, data.season)
                readResult('readResult', resPane, data.season, data.day)
            })
        })      
    }, 500)
  
})

const readTeam = (command, table, sn) => {
    const url = `/request?command=${command}&sn=${sn}`
fetch(url).then((response) => {
        response.json().then((data) => {
            if (data.length === 0) return alert('Table is blank')
            data.sort(dynamicSort('Pts', 'desc'))
            for(i=1; i<=data.length; i++) {
                addRows(table)                
              }
                for(let i=0; i<10; i++) {
                        addColumns(table, data.length, data)
              }
            
        })
    })
}

const readResult = (command, pane, sn, rn) => {
    const url = `/request?command=${command}&sn=${sn}&rn=${rn}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            for (i=0; i<data.length; i++) {
                const div = document.createElement('div')
                div.classList.add('match')
                const ht = document.createElement('button')
                ht.classList.add('home-team')
                ht.textContent = data[i].ht
                div.append(ht)
                const hs = document.createElement('button')
                hs.classList.add('home-score')
                hs.textContent = data[i].hs
                div.append(hs)
                const as = document.createElement('button')
                as.classList.add('away-score')
                as.textContent = data[i].as
                div.append(as)
                const at = document.createElement('button')
                at.classList.add('away-team')
                at.textContent = data[i].at
                div.append(at)
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
                cell[cellCount].textContent = teams[i].team
                cell[cellCount].style.textAlign = 'center'
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

  
