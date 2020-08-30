const express = require('express')
const metadata = require('../models/metadata')
const sclQF = require('../models/sclQF')
const sclSF = require('../models/sclSF')
const combination = require('../utils/combination')
const router = new express.Router()
router.get('/scl/start/SF', async (req, res) => {
    const meta = await metadata.find({}), season = meta[0].scl.season
    meta[0].scl.running = 'Semi Finals'
    meta[0].scl.shortCode = 'SF'
    await meta[0].save()
    const QF = await sclQF.findOne({ season })
    QF.running = 'Ended'
    await QF.save()
    const teams = [] 
    for (x in QF.fixtures[0]) {
        teams.push(QF.fixtures[0][x].qualified)
    }
    await combination.createSF(season, teams, (feedBack) => {
        res.send(feedBack)
    })
})
module.exports = router