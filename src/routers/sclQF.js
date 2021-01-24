const express = require('express')
const sclQF = require('../models/sclQF')
const sclGS = require('../models/sclGS')
const metadata = require('../models/metadata')
const { createQF } = require('../utils/combination')
const router = new express.Router()
router.get('/scl/start/QF', async (req, res) => {
    const meta = await metadata.find({}), season = meta[0].scl.season
    meta[0].scl.running = 'Quarter Finals'
    meta[0].scl.shortCode = 'QF'
    await meta[0].save()
    const GS = await sclGS.findOne({ season })
    GS.running = 'Ended'
    await GS.save()
    const teams = [GS.groups.A[0].teams, GS.groups.B[0].teams, GS.groups.C[0].teams, GS.groups.D[0].teams]
    await createQF(season, teams, (feedBack) => {
        res.send(feedBack)
    })
})

module.exports = router