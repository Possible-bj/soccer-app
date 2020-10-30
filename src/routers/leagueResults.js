const express = require('express')
const league = require('../models/league')
const leagueResult = require('../models/leagueResults')
const sclGS = require('../models/sclGS')
const metadata = require('../models/metadata')
const updateFixture = require('../utils/leagueUpdate')
const updateGS = require('../utils/updateGS')
const updateQF = require('../utils/updateQF')
const updateSF = require('../utils/updateSF')
const updateFIN = require('../utils/updateFIN')
const router = new express.Router()

router.get('/league/result', async (req, res) => {
        const season = req.query.season, day = req.query.day
        const pagedResult = []
        const result = await leagueResult.findOne({ season, day }) 
        if (result.result.length === 0) {
            return res.status(400).send({
                feedBack: 'No results yet!'
            })
        }       
        if (!req.query.pager) {            
            return res.status(200).send(result.result)            
        }        
        for (i=0; i<5; i++) {            
            let x = ((req.query.pager) - 0) + i
            pagedResult.push(result.result[x])         
        }
        res.status(200).send(pagedResult)
})
router.get('/league/result/add', async (req, res) => {
    const ht = (req.query.ht).trim(), hs = parseInt(req.query.hs), as = parseInt(req.query.as), at = (req.query.at).trim() , leg = req.query.leg
    const team = [ht, at]
    const meta = await metadata.find({})
    const season = meta[0].league.season, day = meta[0].league.day
    const data = await leagueResult.findOne({ season, day })
    if (data.result.length === 20) {
        return res.status(400).send({
            feedBack: `Match day ${day} result slot is full, create a new match day by clicking on "New Result" above!`
        })
    }
    const table = await league.findOne({ season })
    if (table.running === 'ended') {
        return res.status(400).send({
            feedBack: 'League has ended!'
        })
    }
    for (i = 0; i < 2; i++) {
        const duplicate = table.teams.find((data) => data.team === team[i])
        if (!duplicate) {
            return res.status(400).send({
                feedBack: 'invalid team entry!'
            })
        }
    }
    await updateFixture(ht, hs, as, at, leg, season, 'update', async (feedBack) => {
        if (feedBack) {
            return res.status(400).send(feedBack)
        }
        const result = await leagueResult.findOne({ season, day })
        result.result = result.result.concat({ ht, hs, as, at, leg})
        await result.save()
        res.send({
            feedBack: 'result inserted!'
        })
    })
})
router.get('/league/result/delete', async (req, res) => {
    const slotId = req.query.slotId - 1, day = req.query.day - 0
    const meta = await metadata.find({}), season = meta[0].league.season
    try {
        const League = await league.findOne({ season })
            if (League.running === 'ended') {
                throw new Error('League has Ended!')
            }
        const results = await leagueResult.findOne({ season, day })
        const result = results.result[slotId]
        if (!result) {
            throw new Error('Result Does not Exist!')
        }
        await updateFixture(result.ht, 0, 0, result.at, result.leg, season, 'delete', async () => { 

        })
        results.result.splice(slotId, 1)
        await results.save()  
        res.status(200).send({
            feedBack: 'Result Deleted!'
        })
    } catch (e) {
        res.status(404).send({
            feedBack: e.message
        })
    }
})
router.get('/league/result/correct', async (req, res) => {
    const slotId = req.query.slotId - 1, day = req.query.day - 0, hs = req.query.hs - 0, as = req.query.as - 0
    const meta = await metadata.find({}), season = meta[0].league.season
    try {
        const League = await league.findOne({ season })
            if (League.running === 'ended') {
                throw new Error('League has Ended!')
            }
        const results = await leagueResult.findOne({ season, day })
        const result = results.result[slotId]
        if (!result) {
            throw new Error('Result Does not Exist!')
        }
        await updateFixture(result.ht, hs, as, result.at, result.leg, season, 'correct', async () => { 

        })
        results.result[slotId].hs = hs
        results.result[slotId].as = as
        await results.save()  
        res.status(200).send({
            feedBack: 'Result Corrected!'
        })
    } catch (e) {
        res.status(404).send({
            feedBack: e.message
        })
    }
})
router.get('/scl/result/add', async (req, res) => {
    const h = req.query.h, hs = (req.query.hs - 0), as = (req.query.as - 0), a = req.query.a, leg = req.query.leg, g = req.query.g === null? null: req.query.g
    const team = [h, a]
        const meta = await metadata.find({})
        const season = meta[0].scl.season
        if (g) {
            const GS = await sclGS.findOne({ season })
            for (i = 0; i < 2; i++) {
                const duplicate = GS.groups[g][0].teams.find((data) => data.team === team[i])
                if (!duplicate) {
                    return res.status(400).send({
                        feedBack: 'invalid team entry!'
                    })
                }
            }
            await updateGS(h, hs, a, as, leg, GS, season, g, (feedBack) => {
                res.status(200).send(feedBack)
            })
        } else {
            const code = meta[0].scl.shortCode
            switch ( code ) {
                case 'QF':
                    await updateQF(h, hs, a, as, leg, season, (feedBack) => {
                        res.send(feedBack)
                    })
                    break;
                case 'SF':
                    await updateSF(h, hs, a, as, leg, season, (feedBack) => {
                        res.send(feedBack)
                    })
                    break;
                case 'FIN':
                    await updateFIN(h, hs, a, as, leg, season, (feedBack) => {
                        res.send(feedBack)
                    })
            }           
        }
})

module.exports = router