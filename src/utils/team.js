const sclGS = require('../models/sclGS')
const sclQF = require('../models/sclQF')
const sclSF = require('../models/sclSF')
const sclFIN = require('../models/sclFIN')
const { dynamicSort } = require('./combination')
const getOverallLeagueStats = async (team, arr, allLeagues) => {
    const overall = { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 }
    let i = 0
    do {
        const overallObj = arr.length === 0? overall : arr[0]
        if (arr.length > 0 ) arr.pop()        
        arr.push(await accumulate(overallObj, allLeagues[i], team) )
        i++
    } while( i < allLeagues.length )
    return arr[0]
}
const getCurrentLeagueStats = (toObj, currentLeague) => {
    const leagueToObj = currentLeague.toObject()
    const current = { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 }
    leagueToObj.teams.filter((data) => {
        if (data.team === toObj.name) {
            current.P = data.P
            current.W = data.W
            current.D = data.D
            current.L = data.L                        
            current.GF = data.GF
            current.GA = data.GA
            current.GD = data.GD
            current.Pts = data.Pts
        }                                                      
    })
    return current
}
const getLeagueTrophies = (team, allLeagues) => {
    const trophies = [], teamObj = []
    allLeagues.forEach((league) => {
        for(i=0; i<league.teams.length; i++) {
            const team = league.teams[i].team
            const deduction = league.teams[i].deduction
            const current = { team: team, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 }
            const stats = accumulate(current, league, team)
            stats.Pts = stats.Pts - deduction
            teamObj.push(stats)
        }
        teamObj.sort(dynamicSort('Pts', 'GD'))
        if (teamObj[0].team === team) {
            if (league.running === 'ended') trophies.push(1)
        }
    })
    return trophies
}

const getOverallSclStats = async (toObj) => {
    const overall = { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 }
    const arr = []
    const allGS = await sclGS.find({})    
    const allQF = await sclQF.find({})
    const allSF = await sclSF.find({})
    const allFIN = await sclFIN.find({})
    const overall1 = await accumulateOverallGroupStageStats(overall, arr, allGS, toObj)
    const overall2 = await accumulateOverallKOStageStats(overall1, arr, allQF, toObj)
    const overall3 = await accumulateOverallKOStageStats(overall2, arr, allSF, toObj)
    const overall4 = await accumulateOverallFINStats(overall3, arr, allFIN, toObj)
    return overall4

}
const getCurrentSclStats = async (toObj, season) => {
    const current = { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 }
    const currentGS = await sclGS.findOne({ season })
    const currentQF = await sclQF.findOne({ season })
    const currentSF = await sclSF.findOne({ season })
    const currentFIN = await sclFIN.findOne({ season })
    const current1 = await accumulateGroupStageStats(current, currentGS, toObj)
    const current2 = await accumulate(current1, currentQF, toObj.name)
    const current3 = await accumulate(current2, currentSF, toObj.name)
    const current4 = await accumulateFinStats(current3, currentFIN.fixtures[0], toObj)
    return current4
}
const getSclTrophies = async (toObj) => {
    const trophies = []
    const allFIN = await sclFIN.find({})
    allFIN.forEach((FIN) => {
        for ( x in FIN.fixtures[0] ) {
            if ( x.includes(toObj.name) && FIN.fixtures[0][x].firstLeg.played && FIN.fixtures[0][x].qualified === toObj.name) {
                trophies.push(1)
            }
        }
    })
    return trophies
}
const accumulateOverallGroupStageStats = async (overall, arr, allGS, obj) => {
    let i = 0
    do {
        const overallObj = arr.length === 0? overall : arr[0]
        if (arr.length > 0 ) arr.pop()        
        arr.push(await accumulateGroupStageStats(overallObj, allGS[i], obj) )
        i++
    } while( i < allGS.length )
    return arr[0]
}
const accumulateOverallKOStageStats = async (overall,  arr, allDoc, obj) => {
    let i = 0
    do {
        const overallObj = arr.length === 0? overall : arr[0]
        if (arr.length > 0 ) arr.pop()        
        arr.push(await accumulate(overallObj, allDoc[i], obj.name) )
        i++
    } while( i < allDoc.length )
    return arr[0]
}
const accumulateOverallFINStats = async (overall, arr, allFIN, obj) => {
    let i = 0
    do {
        const overallObj = arr.length === 0? overall : arr[0]
        if (arr.length > 0 ) arr.pop()        
        arr.push(await accumulateFinStats(overallObj, allFIN[i].fixtures[0], obj) )
        i++
    } while( i < allFIN.length )
    return arr[0]
}
const accumulateGroupStageStats = (current, currentGS, toObj) => {
    const g = ['A', 'B', 'C', 'D']
    for (i=0; i<g.length; i++) {
        currentGS.groups[g[i]][0].teams.filter((data) => {
            if ( data.team === toObj.name ) {
                current.P += data.P
                current.W += data.W
                current.D += data.D
                current.L += data.L                        
                current.GF += data.GF
                current.GA += data.GA
                current.GD += data.GD
                current.Pts += data.Pts
            }
        })
    }
    return current
}
const accumulate = (current, doc, team) => {
    for (x in doc.fixtures[0]) {
        if (x.includes(team)) {
            // doc = doc
            if (doc.fixtures[0][x].firstLeg.played) {
                current.P++
                if ( doc.fixtures[0][x].firstLeg.home === team) {
                    const win = doc.fixtures[0][x].firstLeg.hs > doc.fixtures[0][x].firstLeg.as? 1:0
                    const lose = doc.fixtures[0][x].firstLeg.as > doc.fixtures[0][x].firstLeg.hs? 1:0
                    const draw = doc.fixtures[0][x].firstLeg.hs === doc.fixtures[0][x].firstLeg.as? 1:0
                    current.W += win
                    current.D += draw
                    current.L += lose
                    current.GF += doc.fixtures[0][x].firstLeg.hs
                    current.GA += doc.fixtures[0][x].firstLeg.as
                    current.GD += (current.GF - current.GA)
                    current.Pts = (current.W * 3) + current.D
                } else {
                    const win = doc.fixtures[0][x].firstLeg.as > doc.fixtures[0][x].firstLeg.hs? 1:0
                    const lose = doc.fixtures[0][x].firstLeg.hs > doc.fixtures[0][x].firstLeg.as? 1:0
                    const draw = doc.fixtures[0][x].firstLeg.hs === doc.fixtures[0][x].firstLeg.as? 1:0
                    current.W += win
                    current.D += draw
                    current.L += lose
                    current.GF += doc.fixtures[0][x].firstLeg.as
                    current.GA += doc.fixtures[0][x].firstLeg.hs
                    current.GD += (current.GF - current.GA)
                    current.Pts = (current.W * 3) + current.D
                }
            }
            if (doc.fixtures[0][x].secondLeg.played) {
                current.P++
                if ( doc.fixtures[0][x].secondLeg.home === team) {
                    const win = doc.fixtures[0][x].secondLeg.hs > doc.fixtures[0][x].secondLeg.as? 1:0
                    const lose = doc.fixtures[0][x].secondLeg.as > doc.fixtures[0][x].secondLeg.hs? 1:0
                    const draw = doc.fixtures[0][x].secondLeg.hs === doc.fixtures[0][x].secondLeg.as? 1:0
                    current.W += win
                    current.D += draw
                    current.L += lose
                    current.GF += doc.fixtures[0][x].secondLeg.hs
                    current.GA += doc.fixtures[0][x].secondLeg.as
                    current.GD += (current.GF - current.GA)
                    current.Pts = (current.W * 3) + current.D
                } else {
                    const win = doc.fixtures[0][x].secondLeg.as > doc.fixtures[0][x].secondLeg.hs? 1:0
                    const lose = doc.fixtures[0][x].secondLeg.hs > doc.fixtures[0][x].secondLeg.as? 1:0
                    const draw = doc.fixtures[0][x].secondLeg.hs === doc.fixtures[0][x].secondLeg.as? 1:0
                    current.W += win
                    current.D += draw
                    current.L += lose
                    current.GF += doc.fixtures[0][x].secondLeg.as
                    current.GA += doc.fixtures[0][x].secondLeg.hs
                    current.GD += (current.GF - current.GA)
                    current.Pts = (current.W * 3) + current.D
                }
            }
        }
    }
    return current
}
const accumulateFinStats = (current, FIN, obj) => {
    for ( x in FIN ) {
        if ( x.includes(obj.name) ) {
            FIN = FIN[x]
            if ( FIN.firstLeg.played ) {
                current.P++
                if (FIN.firstLeg.home === obj.name) {
                    const win = FIN.firstLeg.hs > FIN.firstLeg.as? 1:0
                    const lose = FIN.firstLeg.as > FIN.firstLeg.hs? 1:0
                    const draw = FIN.firstLeg.hs === FIN.firstLeg.as? 1:0
                    current.W += win
                    current.D += draw
                    current.L += lose
                    current.GF += FIN.firstLeg.hs
                    current.GA += FIN.firstLeg.as
                    current.GD += (current.GF - current.GA)
                } else {
                    const win = FIN.firstLeg.as > FIN.firstLeg.hs? 1:0
                    const lose = FIN.firstLeg.hs > FIN.firstLeg.as? 1:0
                    const draw = FIN.firstLeg.hs === FIN.firstLeg.as? 1:0
                    current.W += win
                    current.D += draw
                    current.L += lose
                    current.GF += FIN.firstLeg.as
                    current.GA += FIN.firstLeg.hs
                    current.GD += (current.GF - current.GA)
                }
            }
        }
    }
    return current
}
module.exports = {
   getLeagueTrophies, getCurrentLeagueStats, getOverallLeagueStats,
   getOverallSclStats, getCurrentSclStats, getSclTrophies, accumulate
}