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
    const topTeam = [], runnerUPTeams = [], fixed = {}
    for (x in teams) {
        teams[x].sort(dynamicSort('Pts', 'GD'))
        topTeam.push(teams[x][0].team)
        runnerUPTeams.push(teams[x][1].team)
    }
    await fix(topTeam, async (fixture) => {
        for (x in fixture[0]) {
            fixed[x] = fixture[0][x]
        }
    })
    await fix(runnerUPTeams, async (fixture) => {
        for (x in fixture[0]) {
            fixed[x] = fixture[0][x]
        }
    })
    const QF = await sclQF.findOne({ season })        
    QF.fixtures.push(fixed)
    QF.running = 'YES'
    await QF.save()
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
    const draw = {}, fixture = []
    const firstTeam = teams[0], secondTeam = teams[1] 
    draw[`${firstTeam} vs ${secondTeam}`] = {
        firstLeg: {home: firstTeam, hs: 0, away: secondTeam, as: 0, played: false},
        qualified: 'none'
    }
    fixture.push(draw)
    const FIN = await sclFIN.findOne({ season })
    FIN.fixtures.push(fixture[0])
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

module.exports = {
    combination, createQF, createSF, createFIN, dynamicSort
}