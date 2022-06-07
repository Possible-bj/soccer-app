const $drawBoard = document.querySelector('.draw-pane')
const $faDrawBtn = document.querySelector('.fa-draw-btn')
const $teamsInput = document.querySelector('.fa-teams')
const $elapseDate = document.querySelector('.fa-elapse-time')
const $dateSpan = document.querySelector('.date-span')
const $timeSpan = document.querySelector('.time-span')

const drawBtnAction = {
  draw: 'DRAW',
  refresh: 'Refresh',
}

const timeProgress = {
  ended: 'ENDED',
  inprogress: 'INPROGRESS',
}

const currentDateTime = () => {
  const now = new Date()
  return `${now.getFullYear()}-0${now.getMonth() + 1}-0${now.getDate()}T`
}

const populateTeamInput = (e) => {
  $teamsInput.value === ''
    ? ($teamsInput.value = e.textContent)
    : ($teamsInput.value = `${$teamsInput.value}, ${e.textContent}`)
  for (let x in e.parentNode.children) {
    if (e.parentNode.children[x].nodeType === 1) {
      e.parentNode.children[x].removeAttribute('onClick')
    }
  }
}

const qualify = (e) => {
  const savedFixtures = getSavedFixtures()
  switch (isTimeElapsed(savedFixtures.elapseDate)) {
    case true:
      populateTeamInput(e)
      break
    case false:
      return
  }
}

const getSavedFixtures = () => {
  return localStorage.getItem('fa-fixtures')
    ? JSON.parse(localStorage.getItem('fa-fixtures'))
    : []
}

const parseDate = (str) => {
  const [yyyy, mm, dd] = str.split('T')[0].split('-')
  return new Date(yyyy, mm - 1, dd)
}

const datediff = (now, elapseTime) =>
  Math.round((elapseTime - now) / (1000 * 60 * 60 * 24))

const dateDiffHandler = (elapseTime) =>
  datediff(parseDate(currentDateTime()), parseDate(elapseTime))

const displayFixtures = (fixtures) => {
  if ($drawBoard.childElementCount !== 0) clearBoard($drawBoard)
  let i = 0

  while (i < fixtures.length) {
    const fixture = fixtures[i]

    const draw = document.createElement('div')
    draw.setAttribute('class', 'fa-draw flex rel max-percent margin-auto')
    draw.innerHTML = `
    <div class="team1 rel margin-auto" onClick="qualify(this)"> ${fixture[0]}</div>
    <div class="vs rel margin-auto">${fixture[1]}</div>
    <div class="team2 rel margin-auto" onClick="qualify(this)">${fixture[2]}</div>`
    $drawBoard.append(draw)
    i++
  }
}

const fix = (teamsArray, elapseDate, cb) => {
  const sortOrder = [0, 1, -1]
  const order = sortOrder[Math.floor(Math.random() * sortOrder.length)]
  const tm = teamsArray.sort(deepSort(order)),
    fixtures = []

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

  if (localStorage.getItem('fa-fixtures')) lockFunctions()
  showElapseTime(timeProgress.inprogress, elapseDate)
  cb(fixtures)
}

const makeFixtures = () => {
  if ($teamsInput.value === '') return alert('Please Provide teams to draw!')

  const teamsArray = $teamsInput.value.trim().split(',')

  if (teamsArray.length % 2 !== 0)
    return alert(
      'Number of teams can not be Odd, add one more or a walkover team!',
    )

  if ($elapseDate.value === '') return alert('Please provide an Elapse time!')

  const [_hh, mm] = $elapseDate.value.split('T')[1].split(':')

  if (mm > 0)
    return alert(
      'Elapse time Must be in hours, no minutes include. set minutes to 00!',
    )

  if (datediff(parseDate($elapseDate.value), parseDate(currentDateTime())) > 0)
    return alert('You can not pick a date in the past!')

  fix(teamsArray, $elapseDate.value, (fixtures) => displayFixtures(fixtures))
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
  const date_diff = dateDiffHandler(elapseDate)
  if (date_diff === 0) {
    const [hh] = elapseDate.split('T')[1].split(':')
    const now_hh = new Date().getHours()
    if (hh - now_hh > 0) return false
    return true
  }
  if (date_diff < 0) return true
  return false
}

const lockFunctions = () => {
  $teamsInput.value = ''
  $elapseDate.value = ''
  $teamsInput.setAttribute('disabled', 'disabled')
  $elapseDate.setAttribute('disabled', 'disabled')
  $faDrawBtn.textContent = drawBtnAction.refresh
}

const unlockFunctions = () => {
  $teamsInput.removeAttribute('disabled')
  $elapseDate.removeAttribute('disabled')
  $faDrawBtn.textContent = drawBtnAction.draw
}
const showElapseTime = (progress, date) => {
  switch (progress) {
    case timeProgress.ended:
      $dateSpan.textContent = ''
      $timeSpan.textContent = timeProgress.ended
      break
    case timeProgress.inprogress:
      $dateSpan.textContent = date.split('T')[0]
      $timeSpan.textContent = date.split('T')[1]
    default:
      return
  }
}
const runUpdate = () => {
  const savedFixtures = getSavedFixtures()

  if (savedFixtures.fixtures.length) {
    switch (isTimeElapsed(savedFixtures.elapseDate)) {
      case true:
        unlockFunctions()
        showElapseTime(timeProgress.ended)
        break
      case false:
        lockFunctions()
        showElapseTime(timeProgress.inprogress, savedFixtures.elapseDate)
      default:
        return
    }
    displayFixtures(savedFixtures.fixtures)
  }
}
runUpdate()
