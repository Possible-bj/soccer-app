const league = require('../models/league')
const  updateFixture = async (h, hs, as, a, leg, sn, callback) => {
    //h = home, a = away, hs = hGoals, as = aGoals, leg = firstLeg/secondLeg
    //sn = season
    const table = await league.findOne({ season: sn })
    if (`${h} vs ${a}` in table.fixtures[0]) {        
        switch (table.fixtures[0][`${h} vs ${a}`][leg].played) {
            case true:
                return callback({
                    feedBack: 'Match already recorded!'
                })
            case false:
                if (table.fixtures[0][`${h} vs ${a}`][leg].home === h) {
                    await league.updateOne({ season: sn}, {
                        $inc: {
                            [`fixtures.0.${h} vs ${a}.${leg}.hs`]: hs,
                            [`fixtures.0.${h} vs ${a}.${leg}.as`]: as
                        },
                        $set: {
                            [`fixtures.0.${h} vs ${a}.${leg}.played`]: true
                        }
                    })
                    } else {
                        await league.updateOne({ season: sn}, {
                            $inc: {
                                [`fixtures.0.${h} vs ${a}.${leg}.hs`]: as,
                                [`fixtures.0.${h} vs ${a}.${leg}.as`]: hs
                            },
                            $set: {
                                [`fixtures.0.${h} vs ${a}.${leg}.played`]: true
                            }
                        })
                        }
        }
    } else if (`${a} vs ${h}` in table.fixtures[0]) {        
        switch (table.fixtures[0][`${a} vs ${h}`][leg].played) {
            case true:
                return callback({
                    feedBack: 'Match already recorded!'
                })
            case false:
                if (table.fixtures[0][`${a} vs ${h}`][leg].home === h) {
                    await league.updateOne({ season: sn}, {
                        $inc: {
                            [`fixtures.0.${a} vs ${h}.${leg}.hs`]: hs,
                            [`fixtures.0.${a} vs ${h}.${leg}.as`]: as
                        },
                        $set: {
                            [`fixtures.0.${a} vs ${h}.${leg}.played`]: true
                        }
                    })
                    } else {
                        await league.updateOne({ season: sn}, {
                            $inc: {
                                [`fixtures.0.${a} vs ${h}.${leg}.hs`]: as,
                                [`fixtures.0.${a} vs ${h}.${leg}.as`]: hs
                            },
                            $set: {
                                [`fixtures.0.${a} vs ${h}.${leg}.played`]: true
                            }
                        })
                    }
        }
    }
    await leagueStatUpdate(sn, h, hs, as, a, callback)
}
const leagueStatUpdate = async (sn, h, hs, as, a, callback) => {
    const table = await league.findOne({ season: sn })
    const hStat = hs>as? 1:0, aStat = as>hs? 1:0, draw = hs===as? 1:0
    const team = [h, a], stat = [hStat, aStat], goal = [hs, as]
        for (i = 0; i<2; i++) {
            table.teams.find((data) => {
                if (data.team === team[i]) {
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
    await table.save()
    callback()
}
module.exports = updateFixture