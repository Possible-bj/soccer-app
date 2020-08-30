const express = require('express')
const league = require('../models/league')
const leagueResult = require('../models/leagueResults')
const sclGS = require('../models/sclGS')
const sclQF = require('../models/sclQF')
const sclSF = require('../models/sclSF')
const sclFIN = require('../models/sclFIN')
const metadata = require('../models/metadata')
const updateFixture = require('../utils/leagueUpdate')
const updateGS = require('../utils/updateGS')
const updateQF = require('../utils/updateQF')
const updateSF = require('../utils/updateSF')
const updateFIN = require('../utils/updateFIN')
const router = new express.Router()

router.get('/league/result', async (req, res) => {
        const season = req.query.season, day = req.query.day
        await leagueResult.findOne({ season, day }, async (_e, result) => {
            res.status(200).send(result.result)
        })
})
router.get('/league/result/add', async (req, res) => {
    const ht = req.query.ht, hs = parseInt(req.query.hs), as = parseInt(req.query.as), at = req.query.at , leg = req.query.leg
    const team = [ht, at]
    const meta = await metadata.find({})
    const season = meta[0].league.season, day = meta[0].league.day
    const table = await league.findOne({ season })
    for (i = 0; i < 2; i++) {
        const duplicate = table.teams.find((data) => data.team === team[i])
        if (!duplicate) {
            return res.status(400).send({
                feedBack: 'invalid team entry!'
            })
        }
    }
    await updateFixture(ht, hs, as, at, leg, season, async (feedBack) => {
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