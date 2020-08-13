const fs = require('fs')
// const chalk = require('chalk')
const addTeam = (team, P, W, D, L, GF, GA, GD, Pts, callBack) => {
    const data = loadSeasonData()
    const sn = data[0].league.season
    const table = loadTable(sn)
    const duplicateTeam = table.find((t) => t.team === team )
    if (!duplicateTeam) {        
        table.push({
        team: team,
        P: P,
        W: W,
        D: D,
        L: L,
        GF: GF,
        GA: GA,
        GD: GD,
        Pts: Pts
        })    
        saveTable(table, sn)
        callBack({
            feedBack: 'New team added',
            process: 'Success'
        })
    } else {
        callBack({
            feedBack: 'team has been taken',
            process: 'Fail'
        })   
    }
}
const removeTeam = (team, callBack) => {
    const data = loadSeasonData()
    const sn = data[0].league.season
    const table = loadTable(sn)
    const teamsToKeep = table.filter((t) => t.team !== team)

    if (table.length > teamsToKeep.length) {
        saveTable(teamsToKeep, sn)
        callBack({
            feedBack: 'Team Removed',
            process: 'Success'
        })
    } else {
        callBack({
            feedBack: 'Team Not Found',
            process: 'Fail'
        })
}
}
const readTeam = (sn, callBack) => {
    const table = loadTable(sn)
        callBack(table)
}
const editTeam = (team, P, W, D, L, GF, GA, GD, Pts, callBack) => {
    const data = loadSeasonData()
    const sn = data[0].league.season
    const table = loadTable(sn)
    const teamToEdit = table.find((t) => t.team === team)
    if (teamToEdit) {
        const teamsToKeep = table.filter((t) => t.team !== teamToEdit.team)
        teamToEdit.P = P
        teamToEdit.W = W
        teamToEdit.D = D
        teamToEdit.L = L
        teamToEdit.GF = GF
        teamToEdit.GA = GA
        teamToEdit.GD = GD
        teamToEdit.Pts = Pts
        teamsToKeep.push(teamToEdit)
        saveTable(teamsToKeep, sn)
        callBack({
            feedBack: 'Team Updated',
            process: 'Success'
        })
    } else {
        callBack({
            feedBack: "Team Doesn't Exist, Try a Different Team",
            process: 'Fail'
        })
    }
}
const updateResult = (ht, hs, as, at, callBack) => {
    const data = loadSeasonData()
    const sn = data[0].league.season
    const rn = data[0].league.day
    const results = loadResult(sn, rn)
    results.push({
        ht: ht,
        hs: hs,
        as: as,
        at: at
    })
    saveResult(results, sn, rn)
    callBack({ feedBack: 'Result Entered!'})
}
const loadResult = (sn, rn) => {
    try {
        const results = fs.readFileSync(`./S${sn}R${rn}.json`)
        return JSON.parse(results)
    } catch (e) {
        return []
    }
}
const saveResult = (result, sn, rn) => {
    const toSave = JSON.stringify(result)
    fs.writeFileSync(`./S${sn}R${rn}.json`, toSave)
}

const loadTable = (sn) => {
    try {    
    const team = fs.readFileSync(`./S${sn}.json`)
    // const noteStr = note.toString()
    return JSON.parse(team)
} catch (e)  {
    return []
}
}
const saveTable = (team, sn) => {
    const stringedTeam = JSON.stringify(team)
    fs.writeFileSync(`./S${sn}.json`, stringedTeam)
}
const fetchSeason = (toFetch, callBack) => {
    const data = loadSeasonData()
    if (toFetch === 'scl') {
        return callBack({
            season: data[0].scl.season
        })
    }
    callBack({
        season: data[0].league.season,
        day: data[0].league.day
        })
}
const nextLeagueSeason = (callBack) => {
    const data = loadSeasonData()
    data[0].league.season++
    data[0].league.day = 1
    saveSR(data)
    callBack({
        season: data[0].league.season,
        day: data[0].league.day
        })
}
const nextSclSeason = (callBack) => {
    const data = loadSeasonData()
    data[0].scl.season++
    data[0].scl.running = 'none'
    saveSR(data)
    callBack({
        season: data[0].scl.season
        })
}
const nextLeagueDay = (callBack) => {
    const data = loadSeasonData()
    data[0].league.day++
    saveSR(data)
    callBack({
        season: data[0].league.season,
        day: data[0].league.day
        })
}
const loadSeasonData = () => {
    const data = fs.readFileSync('./SR-count.json')
    return JSON.parse(data)
}
const saveSR = (data) => {
    const str = JSON.stringify(data)
    fs.writeFileSync('./SR-count.json', str)
}
const readResult = (sn, rn, callBack) => {
    try {
        const results = fs.readFileSync(`./S${sn}R${rn}.json`)
        const parsedData = JSON.parse(results)
        callBack(parsedData)
    } catch (e) {
        callBack([])
    }
}
module.exports = {
    addTeam: addTeam,
    removeTeam: removeTeam,
    readTeam: readTeam,
    editTeam: editTeam,
    updateResult: updateResult,
    fetchSeason: fetchSeason,
    readResult: readResult,
    nextLeagueSeason: nextLeagueSeason,
    nextLeagueDay: nextLeagueDay,
    nextSclSeason: nextSclSeason
}