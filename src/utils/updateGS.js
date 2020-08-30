const sclGS = require('../models/sclGS')
const  updateGS = async (h, hs, a, as, leg, GS, season, g, callback) => {
    const hStat = hs>as? 1:0, aStat = as>hs? 1:0, draw = hs===as? 1:0
    const team = [h, a], stat = [hStat, aStat], goal = [hs, as]
    const data = GS
    if (`${h} vs ${a}` in data.groups[g][1].fixtures[0]) {
        switch (data.groups[g][1].fixtures[0][`${h} vs ${a}`][leg].played) {
            case true:
                return callback({
                    feedBack: 'Match already recorded!'
                })
            case false:
                if (data.groups[g][1].fixtures[0][`${h} vs ${a}`][leg].home === h) {
                    await sclGS.updateOne({ season }, {
                        $inc: {
                            [`groups.${g}.1.fixtures.0.${h} vs ${a}.${leg}.hs`]: hs,
                            [`groups.${g}.1.fixtures.0.${h} vs ${a}.${leg}.as`]: as
                        },
                        $set: {
                            [`groups.${g}.1.fixtures.0.${h} vs ${a}.${leg}.played`]: true
                        }
                    })
                    } else {
                        await sclGS.updateOne({ season }, {
                            $inc: {
                                [`groups.${g}.1.fixtures.0.${h} vs ${a}.${leg}.hs`]: as,
                                [`groups.${g}.1.fixtures.0.${h} vs ${a}.${leg}.as`]: hs
                            },
                            $set: {
                                [`groups.${g}.1.fixtures.0.${h} vs ${a}.${leg}.played`]: true
                            }
                        })
                        }
        }
    } else if (`${a} vs ${h}` in data.groups[g][1].fixtures[0]) {
        switch (data.groups[g][1].fixtures[0][`${a} vs ${h}`][leg].played) {
            case true:
                return callback({
                    feedBack: 'Match already recorded!'
                })
            case false:
                if (data.groups[g][1].fixtures[0][`${a} vs ${h}`][leg].home === h) {
                    await sclGS.updateOne({ season }, {
                        $inc: {
                            [`groups.${g}.1.fixtures.0.${a} vs ${h}.${leg}.hs`]: hs,
                            [`groups.${g}.1.fixtures.0.${a} vs ${h}.${leg}.as`]: as
                        },
                        $set: {
                            [`groups.${g}.1.fixtures.0.${a} vs ${h}.${leg}.played`]: true
                        }
                    })
                    } else {
                        await sclGS.updateOne({ season }, {
                            $inc: {
                                [`groups.${g}.1.fixtures.0.${a} vs ${h}.${leg}.hs`]: as,
                                [`groups.${g}.1.fixtures.0.${a} vs ${h}.${leg}.as`]: hs
                            },
                            $set: {
                                [`groups.${g}.1.fixtures.0.${a} vs ${h}.${leg}.played`]: true
                            }
                        })
                    }
        }
    }
    await updateStats(season, g, team, stat, draw, goal, callback)  
}
const updateStats = async (season, g, team, stat, draw, goal, callback) => {
    const GS = await sclGS.findOne({ season })
    const teams = GS.groups[g][0].teams
    let i = 0
        do {
            const GF = goal[i], GA = i===0? goal[i + 1]: goal[i - 1]           
            const index = findIndexByKeyValue( teams, 'team', team[i] )            
            await sclGS.updateOne({ season }, {
                $inc: {
                    [`groups.${g}.0.teams.${index}.P`]: 1,
                    [`groups.${g}.0.teams.${index}.GF`]: GF,
                    [`groups.${g}.0.teams.${index}.GA`]: GA,
                }
            })
            if (draw === 1) {
                await sclGS.updateOne({ season }, {
                    $inc: {
                        [`groups.${g}.0.teams.${index}.D`]: 1,
                    }
                })
            } else if (stat[i] === 1) {
                await sclGS.updateOne({ season }, {
                    $inc: {
                        [`groups.${g}.0.teams.${index}.W`]: 1,
                    }
                })
            } else {
                await sclGS.updateOne({ season }, {
                    $inc: {
                        [`groups.${g}.0.teams.${index}.L`]: 1,
                    }
                })               
            }
            const GSS = await sclGS.findOne({ season })
            const GD = GSS.groups[g][0].teams[index].GF - GSS.groups[g][0].teams[index].GA
            const Pts = (GSS.groups[g][0].teams[index].W * 3) + GSS.groups[g][0].teams[index].D 
            await sclGS.updateOne({ season }, {
                $set: {
                    [`groups.${g}.0.teams.${index}.GD`]: GD,
                    [`groups.${g}.0.teams.${index}.Pts`]: Pts
                }
            })
            i++
        } while (i<2)
    callback({
        feedBack: 'Fixture Recorded!'
    })
}
const findIndexByKeyValue = (teams, key, value) => {
    for (i = 0; i<teams.length; i++) {
        if (teams[i][key] === value) {
            return i
        }
    }
    return -1
}
module.exports = updateGS