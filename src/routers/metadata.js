const express = require('express')
const metadata = require('../models/metadata')
const sclGS = require('../models/sclGS')
const sclQF = require('../models/sclQF')
const sclSF = require('../models/sclSF')
const sclFIN = require('../models/sclFIN')
const league = require('../models/league')
const leagueResult = require('../models/leagueResults')
const router = new express.Router()
router.get('/metadata', async (req, res) => {
    const data = await metadata.find({})
            if (data.length !== 0) return res.send(data[0])
        const meta = new metadata({
            league: {
                season: 1,
                day: 1
            },
            scl: {
                season: 1,
                running: 'none',
                shortCode: 'none'
            }
        })
        await meta.save()
    const leagues = new league({
        season: meta.league.season,
        teams: [],
        fixtures: []
    })
    await leagues.save()
    const leagueResults = new leagueResult({
        season: meta.league.season,
        day: 1,
        result: []
    })
    await leagueResults.save()
    await newSclStages(meta.scl.season) 
    res.send(meta)
})
router.get('/newday/:inc', async (req, res) => {
    const inc = req.params.inc
    const meta = await metadata.find({})
    if (inc.charCodeAt(0) === 45) {
        await leagueResult.findOne({
            season: meta[0].league.season,
            day: meta[0].league.day
        }, (e, data) => {
            if (data.result.length !== 0) {
                return res.status(400).send({
                    feedBack: 'Current day result is running!'
                })
            } 
        }) 
        leagueResult.deleteOne({
            season: meta[0].league.season,
            day: meta[0].league.day
        }).then((deleted) => {
            console.log(deleted)
        }).catch((e) => {
            console.log(e.message)
        })
    meta[0].league.day--
    await meta[0].save()
    }
    if (inc.charCodeAt(0) === 43) {
        const data = await leagueResult.findOne({ 
            season: meta[0].league.season,
            day: meta[0].league.day
        })
        if (data.result.length < 20) {
            return res.status(400).send({
                feedBack: 'current match day slot is not full yet'
            })
        }
        meta[0].league.day++
        await meta[0].save()
    const result = new leagueResult({
        season: meta[0].league.season,
        day: meta[0].league.day,
        result: []
    })
   await result.save()
    } 
    
})
router.get('/newleague/:inc', async (req, res) => {
    const inc = req.params.inc
    if (inc.charCodeAt(0) === 45) {
        const meta = await metadata.find({})
        const season = meta[0].league.season
        await league.findOne({ season }, async (e, table) => {
            if ( table.running === 'yes') {
                return res.status(400).send({
                    feedBack: 'Currently league is running, cannot delete!'
                })
            } 
            if (table.running === 'ended') {
                return res.status(400).send({
                    feedBack: 'current league has been completed, cannot delete!'
                })
            }
        meta[0].league.season--
        await meta[0].save()
        await leagueResult.deleteMany({ season})
        await league.deleteOne({ season })
        })
    }
    if (inc.charCodeAt(0) === 43) {
        const meta = await metadata.find({})
        const season = meta[0].league.season
        await league.findOne({ season }, async (e, table) => {
            const running = table.running
            if ( running === 'yes') {
                return res.status(400).send({
                    feadBack: 'Current League is running, cannot override it!'
                })
            }
            if ( running === 'no') {
                return res.status(400).send({
                    feadBack: 'Current League has not been played!'
                })
            }
        meta[0].league.season++
        meta[0].league.day = 1
        await meta[0].save()
        const result = new leagueResult({
            season: meta[0].league.season,
            day: 1,
            result: []
        })
        await result.save()
        const leagues = new league({
            season: meta[0].league.season,
            teams: [],
            fixtures: []
        })
        leagues.save()
        res.status(200).send()
        })
    }
})

router.get('/newscl/:inc', async (req, res) => {
    const inc = req.params.inc
    const meta = await metadata.find({})
    const sn = meta[0].scl.season
    if (inc.charCodeAt(0) === 45) {
        if ( isCurrentGroupStageEndedOrRunning( sn ) ) {
            return res.status(400).send({
                feedBack: 'Current SCL has started!'
            })
        } 
        if ( isPreviousEnded( (sn - 1) ) ) {
            return res.send({
                feedBack: 'Previous SCL has Ended, cannot delete current!'
            })
        }
        const running = previousRunningStage( (sn - 1) ) 
        meta[0].scl.season--
        meta[0].scl.running = running.running
        meta[0].scl.shortCode = running.code
        await meta[0].save()
        await sclGS.deleteOne({ season: sn })
        await sclQF.deleteOne({ season: sn })
        await sclSF.deleteOne({ season: sn })
        await sclFIN.deleteOne({ season: sn })        
    }
    if (inc.charCodeAt(0) === 43) {
        if ( !isPreviousEnded(sn)) {
            return res.status(400).send({
                feedBack: 'Current SCL has not Ended!'
            })
        }
        meta[0].scl.season++
        meta[0].scl.running = 'none'
        meta[0].scl.shortCode = 'none'
        await meta[0].save()
        newSclStages(meta[0].scl.season)  
        res.status(200).send()
    }
})
router.get('/scl/running', async (req, res) => {
    const meta = await metadata.find({})
    const code = meta[0].scl.shortCode
    if (code === 'GS' || code === 'QF' || code === 'SF' || code === 'FIN' || code === 'END') {
        res.status(400).send({
            feedBack: 'yes',
            code
        })
    } else {
        res.status(400).send({
            feedBack: 'no',
            code
        })
    }
})
router.get('/scl/fetch/ko', async (req, res) => {
    const season = (req.query.sn - 0)
    const QF = await sclQF.findOne({ season })
    const SF = await sclSF.findOne({ season })
    const FIN = await sclFIN.findOne({ season })
    const fixtures = []
    if (QF === null || SF === null || FIN === null) return res.status(400).send({
        feedBack: 'table not available'
    })
    if (QF.fixtures.length !== 0) {
        for (x in QF.fixtures[0]) {
            fixtures.push(QF.fixtures[0][x])
        }
    }
    if (SF.fixtures.length !== 0) {
        for (x in SF.fixtures[0]) {
            fixtures.push(SF.fixtures[0][x])
        }
    }
    if (FIN.fixtures.length !== 0) {
        for (x in FIN.fixtures[0]) {
            fixtures.push(FIN.fixtures[0][x])
        }
    }
    if (QF.fixtures.length === 0 && SF.fixtures.length === 0 && FIN.fixtures.length === 0) {
        return res.send(fixtures)
    }
    // console.log(FileQF[0].fixtures)
    res.send(fixtures)

})
router.get('/season/day/:season', async (req, res) => {
    const season = (req.params.season - 0)
    const data = await leagueResult.find({ season })
    res.status(200).send({
        day: data.length
    })
})

const newSclStages = async (season) => {
    const GS = new sclGS({
        season: season,
        groups: {
            A: [{
                teams: []
            },
        {
            fixtures: []
        }],
            B: [{
                teams: []
            },
        {
            fixtures: []
        }],
            C: [{
                teams: []
            },
        {
            fixtures: []
        }],
            D: [{
                teams: []
            },
        {
            fixtures: []
        }]
        }
    })
    await GS.save()
    const QF = new sclQF({
        season: season,
        fixtures: []
    })
    await QF.save()
    const SF = new sclSF({
        season: season,
        fixtures: []
    })
    await SF.save()
    const FIN = new sclFIN({
        season: season,
        fixtures: []
    })
    await FIN.save()
}
const isCurrentGroupStageEndedOrRunning = async ( season ) => {
    const GS = await sclGS.findOne({ season })
    const running = GS.running
    if (running === 'YES' || running === 'Ended') {
        return true
    } else {
        return false
    }
}
const isPreviousEnded = async (season) => {
    const FIN = await sclFIN.findOne({ season })
    const running =  FIN.running
    if (running === 'Ended') {
        return true
    } else {
        return false
    }
}
const previousRunningStage = async ( season ) => {
    const GS = await sclGS.find({ season })
    const QF = await sclQF.find({ season })
    const SF = await sclSF.find({ season })
    const FIN = await sclFIN.find({ season })
    if (GS.running === 'YES') return {running: 'group stage', code: 'GS'}
    if (QF.running === 'YES') return {running: 'quarter finals', code: 'QF'}
    if (SF.running === 'YES') return {running: 'semi finals', code: 'SF'}
    if (FIN.running === 'YES') return {running: 'final', code: 'FIN'}
    if (GS.running === 'NO' && QF.running === 'NO' && SF.running === 'NO' && FIN.running === 'NO') return {
        running: 'none',
        code: 'none'
    }
}
module.exports = router