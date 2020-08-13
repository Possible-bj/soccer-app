const fs = require('fs')
const G = require('generatorics')


const groupSelector = (team, callback) => {
    picker(team, callback)
}
const picker = (team, callback) => {
    const groups = ['A', 'B', 'C', 'D']
    const sclData = loadSclData()
    const sn = sclData[0].scl.season
    const group = {
        team: team,
        P: 0,
        W: 0,
        D: 0,
        L: 0,
        GF: 0,
        GA: 0,
        GD: 0,
        Pts: 0
    }
        const g = groups[Math.floor(Math.random()*groups.length)]
        const File = loadFile(sn, `G${g}`)
        console.log(g)
        if(File.length === 0) {
            if (isGrouped(team, sn, groups)) {
                return callback({
                    feedBack: 'Team has already been grouped'
                })
            } else {
                File.push({})
            File[0].teams = []
            File[0].teams.push(group)
            saveFile(File, sn, `G${g}`)
            callback({
                feedBack: 'Success'
            })
        }
        } else if ('teams' in File[0]) {
            if (File[0].teams.length !== 4) {
                if (isGrouped(team, sn, groups)) {
                     callback({
                        feedBack: 'Team has already been grouped'
                    })
                } else {
                File[0].teams.push(group)
            saveFile(File, sn, `G${g}`)
            callback({
                feedBack: 'Success'
            })
        }
        } else {
                const groupArr = getFiles(sn, groups)
                if(isComplete(groupArr[0].length, groupArr[1].length, groupArr[2].length, groupArr[3].length)) {
                    callback({
                        feedBack: 'All groups are filled'
                    })
                } else {
                groupSelector(team, callback)
            }
        }
}
}
const createFixtures = (callback) => {
    const sclData = loadSclData()
    const sn = sclData[0].scl.season
    const groups = ['A', 'B', 'C', 'D']
    for (i=0; i<4; i++) {
    const File = loadFile(sn, `G${groups[i]}`)
    if (File.length === 0) return callback({
        feedBack: 'teams have not been submitted!'
    }) 
    if (File[0].teams.length !== 4) return callback({
        feedBack: 'teams are not complete!'
    })
    const teams = File[0].teams
    const arr = [teams[0].team, teams[1].team, teams[2].team, teams[3].team]

combination(arr, (fixture) => {
    File.push(fixture)
    saveFile(File, sn, `G${groups[i]}`)
        })
    }
    sclData[0].scl.running = 'group stage'
    sclData[0].scl.shortCode = 'GS'
    saveSclData(sclData)
    callback({
        feedBack: 'Fixtures created; Scl Started!'
    })
}
const combination = (arr, callback) => {
    const fixture = {}, draw = {}; fixture.fixtures = []
    for (perm of G.combination(arr, 2)) {
        const firstTeam = perm[0], secondTeam = perm[1] 
        draw[`${firstTeam} vs ${secondTeam}`] = {
            firstLeg: {home: firstTeam, hs: 0, away: secondTeam, as: 0, played: false},
            secondLeg: {home: secondTeam, hs: 0, away: firstTeam, as: 0, played: false} 
        }
    }
    fixture.fixtures.push(draw)
    callback(fixture)
}
const updateResult = (h, hs, a, as, leg, g, callback) => {
    const sclData = loadSclData()
    const sn = sclData[0].scl.season
    if (g) {
        const File = loadFile(sn, `G${g}`)
        update(h, hs, a, as, leg, File, sn, `G${g}`, callback)
    }
    else {
        const File = loadFile(sn, sclData[0].scl.shortCode)
        update(h, hs, a, as, leg, File, sn, sclData[0].scl.shortCode, callback)
    }
}
const  update = (h, hs, a, as, leg, File, sn, g, callback) => {
    const hStat = hs>as? 1:0, aStat = as>hs? 1:0, draw = hs===as? 1:0
    const team = [h, a], stat = [hStat, aStat], goal = [parseInt(hs), parseInt(as)]
    const data = (g === 'QF' || g === 'SF' || g === 'FIN')? File[0]: File[1]
    if (`${h} vs ${a}` in data.fixtures[0]) {
        switch (data.fixtures[0][`${h} vs ${a}`][leg].played) {
            case true:
                return callback({
                    feedBack: 'Match already recorded!'
                })
            case false:
                if (data.fixtures[0][`${h} vs ${a}`][leg].home === h) {
                    data.fixtures[0][`${h} vs ${a}`][leg].hs = hs
                    data.fixtures[0][`${h} vs ${a}`][leg].as = as
                    } else {
                        data.fixtures[0][`${h} vs ${a}`][leg].hs = as
                        data.fixtures[0][`${h} vs ${a}`][leg].as = hs
                        }
                data.fixtures[0][`${h} vs ${a}`][leg].played = true
        }

    } else if (`${a} vs ${h}` in data.fixtures[0]) {
        switch (data.fixtures[0][`${a} vs ${h}`][leg].played) {
            case true:
                return callback({
                    feedBack: 'Match already recorded!'
                })
            case false:
                if (data.fixtures[0][`${a} vs ${h}`][leg].home === h) {
                    data.fixtures[0][`${a} vs ${h}`][leg].hs = hs
                    data.fixtures[0][`${a} vs ${h}`][leg].as = as
                    } else {
                        data.fixtures[0][`${a} vs ${h}`][leg].hs = as
                        data.fixtures[0][`${a} vs ${h}`][leg].as = hs
                    }
                data.fixtures[0][`${a} vs ${h}`][leg].played = true
        }
    } else {
        return callback({
            feedBack: 'fixture does not exist'
        })
    }
    if (g === 'GA' || g === 'GB' || g === 'GC' || g === 'GD') {
        updateStats(File, sn, g, team, stat, draw, goal)
    } else if (g === 'QF' || g === 'SF' || g === 'FIN') {
        Qualified(File, sn, g, h, a)
    } 
    // else {
    //     champ(File, sn, g, h, a)
    // }
    callback({
        feedBack: 'Fixture Recorded!'
    })
}
const updateStats = (File, sn, g, team, stat, draw, goal) => {
    for (i = 0; i<2; i++) {
        File[0].teams.find((data) => {
            if (data.team === team[i]) {
                // console.log(data.team)
                data.P++
                if (draw === 1) {
                    data.W += 0
                    data.D += 1
                    data.L += 0
                } else if (stat[i] === 1) {
                    data.W += 1
                    data.D += 0
                    data.L += 0
                } else {
                    data.W += 0
                    data.D += 0
                    data.L += 1                    
                }
                data.GF += goal[i]
                data.GA += i===0? goal[i + 1]: goal[i - 1]
                data.GD = data.GF - data.GA
                data.Pts = (data.W * 3) + data.D
            }
        })
    }
    // console.log(File[0])
    // console.log(File[1].fixtures[0][`${h} vs ${a}`].firstLeg)
    saveFile(File, sn, g)
}
const Qualified = (File, sn, g, h, a) => {
    if (`${h} vs ${a}` in File[0].fixtures[0]) {
    const _1stLeg = File[0].fixtures[0][`${h} vs ${a}`].firstLeg.played
    const _2ndLeg = g === 'FIN'? false: File[0].fixtures[0][`${h} vs ${a}`].secondLeg.played
    if (_1stLeg && _2ndLeg) {
        const qualified = evaluateBothLeg(File[0].fixtures[0][`${h} vs ${a}`])
        File[0].fixtures[0][`${h} vs ${a}`].qualified = qualified
    } else if (_1stLeg) {
        const qualified = evaluateLeg(File[0].fixtures[0][`${h} vs ${a}`].firstLeg)
        File[0].fixtures[0][`${h} vs ${a}`].qualified = qualified
    }
    } else if (`${a} vs ${h}` in File[0].fixtures[0]) {
        const _1stLeg = File[0].fixtures[0][`${a} vs ${h}`].firstLeg.played
        const _2ndLeg = g === 'FIN'? false: File[0].fixtures[0][`${a} vs ${h}`].secondLeg.played
        if (_1stLeg && _2ndLeg) {
            const qualified = evaluateBothLeg(File[0].fixtures[0][`${a} vs ${h}`])
            File[0].fixtures[0][`${a} vs ${h}`].qualified = qualified
        } else if (_1stLeg) {
            const qualified = evaluateLeg(File[0].fixtures[0][`${a} vs ${h}`].firstLeg)
            File[0].fixtures[0][`${a} vs ${h}`].qualified = qualified
        }        
    }
    saveFile(File, sn, g)
}
// const champ = (File, sn, g, h, a) => {
//     if (`${h} vs ${a}` in File[0].fixtures[0]) {
//         const played = File[0].fixtures[0][`${h} vs ${a}`].finalLeg.played
//         if (played) {
//             const qualified = evaluateLeg(File[0].fixtures[0][`${h} vs ${a}`].finalLeg)
//             File[0].fixtures[0][`${h} vs ${a}`].qualified = qualified
//         }
//     } else if (`${a} vs ${h}` in File[0].fixtures[0]) {
//         const played = File[0].fixtures[0][`${a} vs ${h}`].finalLeg.played
//         if (played) {
//             const qualified = evaluateLeg(File[0].fixtures[0][`${a} vs ${h}`].firstLeg)
//             File[0].fixtures[0][`${a} vs ${h}`].qualified = qualified
//         }
//     }
//     saveFile(File, sn, g)
// }
const evaluateBothLeg = (data) => {
    const home = data.firstLeg.hs + data.secondLeg.as
    const away = data.firstLeg.as + data.secondLeg.hs
    if (home > away) {
         return data.firstLeg.home
    } else if (away > home) {
         return data.firstLeg.away
    } else {
        const awayAdv = data.firstLeg.as
        const homeAdv = data.secondLeg.as
        if (homeAdv > awayAdv) {
             return data.firstLeg.home
        } else if (awayAdv > homeAdv) {
             return data.firstLeg.away
        } else {
             return `${data.firstLeg.home} vs ${data.firstLeg.away}`
        }
    }
} 
const evaluateLeg = (data) => {
    const home = data.hs 
    const away = data.as 
    if (home>away) {
        return data.home
    } else if (away>home) {
        return data.away
    } else return `${data.home} vs ${data.away}`
}
const isComplete = (a, b, c, d) => {
    return a === 4 && b === 4 && c === 4 && d === 4
}
const isGrouped = (team, sn, groups) => {
    const Files = getFiles(sn, groups)
    return Files.find((x) => {
       return x.find((y) =>  y.team === team)
    })    
}
const getFiles = (sn, groups) => {
    const gA = loadFile(sn, `G${groups[0]}`)
    const gB = loadFile(sn, `G${groups[1]}`)
    const gC = loadFile(sn, `G${groups[2]}`)
    const gD = loadFile(sn, `G${groups[3]}`)
    const groupArr = [gA, gB, gC, gD]
    for (i = 0; i < groupArr.length; i++) {
        if (groupArr[i].length === 0) {
            groupArr[i].push({})
            groupArr[i][0].teams = []
        }
    }
    return [groupArr[0][0].teams, groupArr[1][0].teams, groupArr[2][0].teams, groupArr[3][0].teams]
}
const fetchGS = (sn, g, callback) => {
    const data = loadFile(sn, `G${g}`)
    if (data.length !== 0) {
        const group = data[0].teams
        callback(group)
    } else {
        const group = {
            feedBack: 'No data found!'
        }
        callback(group)
    }
}
const fetchKO = (sn, callback) => {
    const FileQF = loadFile(sn, 'QF')
    const FileSF = loadFile(sn, 'SF')
    const FileFIN = loadFile(sn, 'FIN')
    const fixture = []
    if (FileQF.length !== 0) {
        for (x in FileQF[0].fixtures[0]) {
            fixture.push(FileQF[0].fixtures[0][x])
        }
    }
    if (FileSF.length !== 0) {
        for (x in FileSF[0].fixtures[0]) {
            fixture.push(FileSF[0].fixtures[0][x])
        }
    }
    if (FileFIN.length !== 0) {
        for (x in FileFIN[0].fixtures[0]) {
            fixture.push(FileFIN[0].fixtures[0][x])
        }
    }
    if (FileQF.length === 0 && FileSF.length === 0 && FileFIN.length === 0) {
        return callback(fixture)
    }
    console.log(fixture.length)
    callback(fixture)
}
const sclProgress = (callback) => {
    const sclData = loadSclData()
    callback({
        feedBack: sclData[0].scl.running
    })
}
const nextStage = (level, callback) => {
    const sclData = loadSclData()
    sclData[0].scl.running = level
    if (level === 'final') sclData[0].scl.shortCode = 'FIN'
    else sclData[0].scl.shortCode = (level[0] + '' + level[level.length - 6]).toUpperCase()
    saveSclData(sclData)
    switch (level) {
        case 'quarter finals':
            createQF(sclData[0].scl.season, 'QF', ['A', 'B', 'C', 'D'])
            break;
        case 'semi finals':
            createSF(sclData[0].scl.season, 'SF', 'QF')
            break;
        case 'final':
            createFIN(sclData[0].scl.season, 'FIN', 'SF')
    }
    if (level === 'Ended') feedBack = 'Season Ended'
    else feedBack = `${level} begins`
    callback({
        feedBack: feedBack
    })
}
// stage generator
const createQF = (sn, g, groups) => {
    const Files = getFiles(sn, groups)
    const arr = []
    for (x in Files) {
        Files[x].sort(dynamicSort('Pts', 'desc'))
        arr.push(Files[x][0].team)
        arr.push(Files[x][1].team)
    }
    const File = loadFile(sn, g)
    fix(arr, (fixture) => {
        File.push(fixture)
        saveFile(File, sn, g)
    })
}
const createSF = (sn, g, lastStage) => {
    const File = loadFile(sn, lastStage)
    const arr = []
        for ( x in File[0].fixtures[0]) {
        arr.push(File[0].fixtures[0][x].qualified)
    }
    fix(arr, (fixture) => {
        const File = loadFile(sn, g)
        File.push(fixture)
        saveFile(File, sn, g)
    })
}
const createFIN = (sn, g, lastStage) => {
    const File = loadFile(sn, lastStage)
    const arr = []
        for ( x in File[0].fixtures[0]) {
        arr.push(File[0].fixtures[0][x].qualified)
    }
    const draw = {}, fixture = {}; fixture.fixtures = []
    const firstTeam = arr[0], secondTeam = arr[1] 
    draw[`${firstTeam} vs ${secondTeam}`] = {
        firstLeg: {home: firstTeam, hs: 0, away: secondTeam, as: 0, played: false},
        qualified: 'none'
    }
    fixture.fixtures.push(draw)
    const finFile = loadFile(sn, g)
    finFile.push(fixture)
    saveFile(finFile, sn, g)
}
const fix = (arr, callback) => {
    const tm = arr, draw = {}, fixture = {}; fixture.fixtures = []
    while(tm.length>0) {
        let num = Math.floor(Math.random()*tm.length)        
        if (num === 0) num++
        console.log(num)
    const firstTeam = tm[0], secondTeam = tm[num] 
    draw[`${firstTeam} vs ${secondTeam}`] = {
        firstLeg: {home: firstTeam, hs: 0, away: secondTeam, as: 0, played: false},
        secondLeg: {home: secondTeam, hs: 0, away: firstTeam, as: 0, played: false},
        qualified: 'none'
    }; tm.splice(num, 1); tm.shift()
    }
    fixture.fixtures.push(draw)
    callback(fixture)
    // console.log(fixture.fixtures)
}
const loadFile = (sn, g) => {
  try {
      const data = fs.readFileSync(`./SCL${sn}${g}.json`)
      return JSON.parse(data)
} catch (e) {
    return []
}
}
const dynamicSort = (prop, order) => {
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
const saveFile = (File, sn, g) => {
    const fileToSave = JSON.stringify(File)
    fs.writeFileSync(`./SCL${sn}${g}.json`, fileToSave)
}
const loadSclData = () => {
    const data = fs.readFileSync('./SR-count.json')
    return JSON.parse(data)
}
const saveSclData = (sclData) => {
    const data = JSON.stringify(sclData)
    fs.writeFileSync('./SR-count.json', data)
}
module.exports = {
    groupSelector: groupSelector,
    fetchGS: fetchGS,
    fetchKO: fetchKO,
    createFixtures: createFixtures,
    sclProgress: sclProgress,
    nextStage: nextStage,
    updateResult: updateResult
}