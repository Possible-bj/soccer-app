const sclFIN = require('../models/sclFIN')

const updateFIN = async (h, hs, a, as, leg, season, callback) => {
    const data = await sclFIN.findOne({ season })
    if (`${h} vs ${a}` in data.fixtures[0]) {
        console.log(`${h} vs ${a}` in data.fixtures[0])
        switch (data.fixtures[0][`${h} vs ${a}`][leg].played) {
            case true:
                return callback({
                    feedBack: 'Match already recorded!'
                })
            case false:
                if (data.fixtures[0][`${h} vs ${a}`][leg].home === h) {
                    await sclFIN.updateOne({ season }, {
                        $inc: {
                            [`fixtures.0.${h} vs ${a}.${leg}.hs`]: hs,
                            [`fixtures.0.${h} vs ${a}.${leg}.as`]: as
                        },
                        $set: {
                            [`fixtures.0.${h} vs ${a}.${leg}.played`]: true
                        }
                    })
                    } else {
                        await sclFIN.updateOne({ season }, {
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

    } else if (`${a} vs ${h}` in data.fixtures[0]) {
        console.log(`${a} vs ${h}` in data.fixtures[0])
        switch (data.fixtures[0][`${a} vs ${h}`][leg].played) {
            case true:
                return callback({
                    feedBack: 'Match already recorded!'
                })
            case false:
                if (data.fixtures[0][`${a} vs ${h}`][leg].home === h) {
                    await sclFIN.updateOne({ season }, {
                        $inc: {
                            [`fixtures.0.${a} vs ${h}.${leg}.hs`]: hs,
                            [`fixtures.0.${a} vs ${h}.${leg}.as`]: as
                        },
                        $set: {
                            [`fixtures.0.${a} vs ${h}.${leg}.played`]: true
                        }
                    })
                    } else {
                        await sclFIN.updateOne({ season }, {
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
    } else {
        return callback({
            feedBack: 'fixture does not exist!'
        })
    }

    await Qualified(season, h, a)
    callback({
        feedBack: 'Fixture Recorded!'
    })
}
const Qualified = async (season, h, a) => {
    const FIN = await sclFIN.findOne({ season })
    if (`${h} vs ${a}` in FIN.fixtures[0]) {
    const _1stLeg = FIN.fixtures[0][`${h} vs ${a}`].firstLeg.played
    if (_1stLeg) {
        const qualified = evaluateLeg(FIN.fixtures[0][`${h} vs ${a}`].firstLeg)
        await sclFIN.updateOne({ season }, {
            $set: {
                [`fixtures.0.${h} vs ${a}.qualified`]: qualified
            }
        })
    }
    } else if (`${a} vs ${h}` in FIN.fixtures[0]) {
        const _1stLeg = FIN.fixtures[0][`${a} vs ${h}`].firstLeg.played
        if (_1stLeg) {
            const qualified = evaluateLeg(FIN.fixtures[0][`${a} vs ${h}`].firstLeg)
            await sclFIN.updateOne({ season }, {
                $set: {
                    [`fixtures.0.${a} vs ${h}.qualified`]: qualified
                }
            })
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
module.exports = updateFIN