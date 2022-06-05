const $faDrawBtn = document.querySelector('.fa-draw-btn')
const $teamsInput = document.querySelector('.fa-teams')
const $elapseDate = document.querySelector('.fa-elapse-time')
const drawBtnAction = {
  draw: 'DRAW',
  refresh: 'Refresh',
}
const parseDate = (str) => {
  const [yyyy, mm, dd] = str.split('T')[0].split('-')
  const [hh, min] = str.split('T')[1].split(':')
  return new Date(yyyy, mm - 1, dd, hh, min)
}
const datediff = (now, elapseTime) => {
  return Math.round((elapseTime - now) / (1000 * 60 * 60 * 24))
}

const dateDiffHandler = (elapseTime) => {
  const today = new Date()
  const now = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}T${today.getHours()}:${today.getMinutes()}`

  return datediff(parseDate(now), parseDate(elapseTime))
}
const displayFixtures = (fixtures) => {
  const drawBoard = document.querySelector('.draw-pane')
  if (drawBoard.childElementCount !== 0) clearBoard(drawBoard)
  let i = 0
  while (i < fixtures.length) {
    const fixture = fixtures[i]
    // const det = str.split(' ')
    const draw = document.createElement('div')
    draw.setAttribute('class', 'fa-draw flex rel max-percent margin-auto')
    draw.innerHTML = `
    <div class="team1 rel margin-auto"> ${fixture[0]}</div>
    <div class="vs rel margin-auto">${fixture[1]}</div>
    <div class="team2 rel margin-auto">${fixture[2]}</div>`
    drawBoard.append(draw)
    i++
  }
}

const fix = (teamsArray, elapseDate, cb) => {
  const sortOrder = [0, 1, -1]
  const order = sortOrder[Math.floor(Math.random() * sortOrder.length)]
  const tm = teamsArray.sort(deepSort(order)),
    fixtures = []
  console.log(tm)
  while (tm.length > 0) {
    let num = Math.floor(Math.random() * tm.length)
    if (num === 0) num++
    const firstTeam = tm[0],
      secondTeam = tm[num]
    const draw = [firstTeam, 'Vs', secondTeam]
    fixtures.push(draw)
    tm.splice(num, 1)
    tm.shift()
  }
  localStorage.setItem('fa-fixtures', JSON.stringify({ elapseDate, fixtures }))
  if (localStorage.getItem('fa-fixtures')) {
    $teamsInput.setAttribute('disabled', 'disabled')
    $elapseDate.setAttribute('disabled', 'disabled')
    $faDrawBtn.textContent = drawBtnAction.refresh
  }
  cb(fixtures)
}
const makeFixtures = () => {
  const teamsArray = $teamsInput.value.trim().split(',')
  if (teamsArray.length % 2 !== 0) {
    return alert(
      'Number of teams can not be Odd, add one more or a walkover team!',
    )
  }
  if ($elapseDate.value === '') return alert('Please provide an Elapse time!')
  const [_hh, mm] = $elapseDate.value.split('T')[1].split(':')
  if (mm > 0) {
    return alert(
      'Elapse time Must be in hours, no minutes include. set minutes to 00!',
    )
  }

  fix(teamsArray, $elapseDate.value, (fixtures) => {
    displayFixtures(fixtures)
  })
}
$faDrawBtn.addEventListener('click', (e) => {
  switch (e.target.textContent) {
    case drawBtnAction.draw:
      return makeFixtures()
    case drawBtnAction.refresh:
      return runUpdate()
  }
})
const clearBoard = (pane) => {
  const childCount = pane.childElementCount
  let i = 0
  do {
    pane.removeChild(pane.children[pane.children.length - 1])
    i++
  } while (i < childCount)
}
const deepSort = (sortOrder) => {
  return function (a, b) {
    if (a < b) return -1 * sortOrder
    else if (a > b) return 1 * sortOrder
    return 0 * sortOrder
  }
}
const isTimeElapsed = (elapseDate) => {
  if (!dateDiffHandler(elapseDate)) {
    const [hh] = elapseDate.split('T')[1].split(':')
    const today = new Date()
    const now_hh = today.getHours()
    if (hh - now_hh > 0) return false
    else return true
  } else return false
}
const lockFunctions = () => {
  $teamsInput.setAttribute('disabled', 'disabled')
  $elapseDate.setAttribute('disabled', 'disabled')
  $faDrawBtn.textContent = drawBtnAction.refresh
}

const runUpdate = () => {
  const savedFixtures = localStorage.getItem('fa-fixtures')
    ? JSON.parse(localStorage.getItem('fa-fixtures'))
    : []
  // console.log(fixtures.length)
  if (savedFixtures.fixtures.length) {
    // console.log('before switch')
    switch (isTimeElapsed(savedFixtures.elapseDate)) {
      case true:
        $faDrawBtn.textContent = drawBtnAction.draw
        displayFixtures(savedFixtures.fixtures)
        break
      case false:
        lockFunctions()
        displayFixtures(savedFixtures.fixtures)
      default:
    }
  }
}
runUpdate()
