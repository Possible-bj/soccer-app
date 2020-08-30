const express = require('express')
const sclSF = require('../models/sclSF')
const sclFIN = require('../models/sclFIN')
const metadata = require('../models/metadata')
const combination = require('../utils/combination')
const router = new express.Router()
router.get('/scl/start/FIN', async (req, res) => {
    const meta = await metadata.find({}), season = meta[0].scl.season
    meta[0].scl.running = 'Final'
    meta[0].scl.shortCode = 'FIN'
    await meta[0].save()
    const SF = await sclSF.findOne({ season })
    SF.running = 'Ended'
    await SF.save()
    const teams = [] 
    for (x in SF.fixtures[0]) {
        teams.push(SF.fixtures[0][x].qualified)
    }
    await combination.createFIN(season, teams, (feedBack) => {
        res.send(feedBack)
    })
})
router.get('/scl/end', async (req, res) => {
    const meta = await metadata.find({}), season = meta[0].scl.season
    meta[0].scl.running = 'Ended'
    meta[0].scl.shortCode = 'END'
    await meta[0].save()
    const FIN = await sclFIN.findOne({ season })
    FIN.running = 'Ended'
    await FIN.save()
    res.send({
        feedBack: 'SCL CONCLUDED!'
    })
})
module.exports = router