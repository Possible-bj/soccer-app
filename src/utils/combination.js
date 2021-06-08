const sclQF = require('../models/sclQF')
const sclSF = require('../models/sclSF')
const sclFIN = require('../models/sclFIN')
const G = require('generatorics')
const combination = async (arr, callback) => {
  const fixture = [], draw = {};
  for (perm of G.combination(arr, 2)) {
    const firstTeam = perm[0], secondTeam = perm[1] 
    draw[`${firstTeam} vs ${secondTeam}`] = {
      firstLeg: {home: firstTeam, hs: parseInt(0), away: secondTeam, as: parseInt(0), played: false},
      secondLeg: {home: secondTeam, hs: parseInt(0), away: firstTeam, as: parseInt(0), played: false} 
    }
  }
  fixture.push(draw)
  callback(fixture)
}
const createQF = async (season, teams, callback) => {
  const topTeam = [], runnerUPTeams = []
  for (x in teams) {
    teams[x].sort(dynamicSort('Pts', 'GD'))
    topTeam.push(teams[x][0].team)
    runnerUPTeams.push(teams[x][1].team)
  }
  match(topTeam, runnerUPTeams)
  .then( async (data) => {
    const QF = await sclQF.findOne({ season })        
    QF.fixtures.push(data)
    QF.running = 'YES'
    await QF.save()
  })
  callback({
    feedBack: 'Groups stage ended and Quarter Finals begins!'
  })
}
const createSF = async (season, teams, callback) => {
  await fix(teams, async (fixture) => {
    const SF = await sclSF.findOne({ season })
    SF.fixtures.push(fixture[0])
    SF.running = 'YES'
    await SF.save()
    callback({
      feedBack: 'Quarter Finals ended and Semi Finals begins!'
    })
  })
}
const createFIN = async (season, teams, callback)=> {
  const draw = {}
  const firstTeam = teams[0], secondTeam = teams[1] 
  draw[`${firstTeam} vs ${secondTeam}`] = {
    firstLeg: {home: firstTeam, hs: 0, away: secondTeam, as: 0, played: false},
    qualified: 'none'
  }
  const FIN = await sclFIN.findOne({ season })
  FIN.fixtures.push(draw)
  FIN.running = 'YES'
  await FIN.save()
  callback({
    feedBack: 'Semi Finals ended and Final begins!'
  })
}
const dynamicSort = (prop, tieBreaker) => {
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
const fix = async (arr, callback) => {
  const tm = arr, draw = {}, fixture = []
  while(tm.length>0) {
    let num = Math.floor(Math.random()*tm.length)        
    if (num === 0) num++
  const firstTeam = tm[0], secondTeam = tm[num] 
  draw[`${firstTeam} vs ${secondTeam}`] = {
    firstLeg: {home: firstTeam, hs: 0, away: secondTeam, as: 0, played: false},
    secondLeg: {home: secondTeam, hs: 0, away: firstTeam, as: 0, played: false},
    qualified: 'none'
  }; tm.splice(num, 1); tm.shift()
  }
  fixture.push(draw)
  callback(fixture)
}
const match = async (homeTeam, awayTeam) => {
  const draw = {}
  homeTeam.forEach((home) => {
    const num = Math.floor(Math.random()*awayTeam.length)        
    draw[`${home} vs ${awayTeam[num]}`] = {
      firstLeg: {home, hs: 0, away: awayTeam[num], as: 0, played: false},
      secondLeg: {home: awayTeam[num], hs: 0, away: home, as: 0, played: false},
      qualified: 'none'
    }; awayTeam.splice(num, 1)
  })
  return draw
}

module.exports = {
  combination, createQF, createSF, createFIN, dynamicSort
}