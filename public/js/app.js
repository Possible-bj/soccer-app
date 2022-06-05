window.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('#tbody')
  const snDis = document.querySelector('#sn-display')
  const matchDay = document.querySelector('.match-day')
  const resPane = document.querySelector('#results')
  fetch('/metadata').then((response) => {
    response.json().then((data) => {
      snDis.textContent = data.league.season
      matchDay.textContent = data.league.day
      readTeam(table, data.league.season)
      readResult(resPane, data.league.season, data.league.day)
    })
  })

  const readTeam = (table, sn) => {
    const url = `/table/${sn}`
    // `/request?command=${command}&sn=${sn}`
    fetch(url).then((response) => {
      response.json().then((data) => {
        // if (data.length === 0) return alert('Table is blank')
        data.sort(dynamicSort('Pts', 'GD'))
        for (i = 1; i <= data.length; i++) {
          addRows(table)
        }
        for (let i = 0; i < 10; i++) {
          addColumns(table, data.length, data)
        }
      })
    })
  }

  const readResult = (pane, sn, day) => {
    const url = `/league/result?season=${sn}&day=${day}`
    fetch(url).then((response) => {
      response.json().then((data) => {
        if (data.feedBack) {
          return (pane.innerHTML = `<div align="center" class="no-result rel max-width margin-auto"> ${data.feedBack}</div>`)
        }
        for (i = 0; i < data.length; i++) {
          const div = document.createElement('div')
          const ht = document.createElement('div')
          const leg = document.createElement('div')
          const at = document.createElement('div')
          const as = document.createElement('div')
          const hs = document.createElement('div')
          div.classList.add('match')
          ht.classList.add('home-team')
          leg.classList.add('league-result-leg')
          hs.classList.add('home-score')
          as.classList.add('away-score')
          at.classList.add('away-team')
          if (data[i].leg === 'firstLeg') leg.textContent = '1L'
          if (data[i].leg === 'secondLeg') leg.textContent = '2L'
          ht.textContent = data[i].ht
          hs.textContent = data[i].hs
          as.textContent = data[i].as
          at.textContent = data[i].at
          if (data[i].hs > data[i].as) {
            ht.style.color = 'green'
            hs.style.color = 'green'
          }
          if (data[i].as > data[i].hs) {
            at.style.color = 'green'
            as.style.color = 'green'
          }
          ht.append(leg)
          div.append(ht)
          div.append(hs)
          div.append(as)
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
      case 0:
      case 1:
      case 2:
      case 3:
        table.rows[i].cells[0].classList.add('first-four')
        break
      case 4:
      case 5:
        table.rows[i].cells[0].classList.add('five-six')
        break
      case table.rows.length - 1:
      case table.rows.length - 2:
      case table.rows.length - 3:
      case table.rows.length - 4:
        table.rows[i].cells[0].classList.add('last-four')
    }
  }
  let addColumns = (table, rowCount, teams) => {
    let cell = [],
      i = 0
    let setInt = setInterval(setCols, 50)
    function setCols() {
      let cellCount = table.rows[i].cells.length
      cell[cellCount] = table.rows[i].insertCell()
      switch (cellCount) {
        case 0:
          cell[
            cellCount
          ].innerHTML = `<div class="abs max-percent margin-auto centered">${
            i + 1
          }</div>`
          positionIndicator(table, i)
          break
        case 1:
          cell[
            cellCount
          ].innerHTML = `<img class='logo-thumb' src='/team/logo/${teams[i].team}'> <span> ${teams[i].team}</span>`
          break
        case 2:
          cell[cellCount].textContent = teams[i].P
          break
        case 3:
          cell[cellCount].textContent = teams[i].W
          break
        case 4:
          cell[cellCount].textContent = teams[i].D
          break
        case 5:
          cell[cellCount].textContent = teams[i].L
          break
        case 6:
          cell[cellCount].textContent = teams[i].GF
          break
        case 7:
          cell[cellCount].textContent = teams[i].GA
          break
        case 8:
          cell[cellCount].textContent = teams[i].GD
          break
        case 9:
          cell[cellCount].textContent = teams[i].Pts
      }

      i++
      if (i === rowCount) {
        clearInterval(setInt)
        i = 0
      }
    }
  }

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
})
