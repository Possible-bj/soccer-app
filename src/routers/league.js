const express = require('express')
const metadata = require('../models/metadata')
const league = require('../models/league')
const team = require('../models/team')
const combination = require('../utils/combination')
const router = new express.Router()
router.get('/table/:sn', async (req, res) => {
    const season = req.params.sn
    try {
        const table = await league.findOne({ season })
    if (!table) {
        throw new Error('Could not find table')
    }
    res.status(200).send(table.teams)
    } catch(e) {
        res.status(400).send({ feedback: e.message})
    }
})
router.get('/league/team/add', async (req, res) => {
    const team = req.query.team.toLowerCase()
    await metadata.find({}, async (e, meta) => {
        const season = meta[0].league.season
        const table = await league.findOne({ season })
        if (table.running === 'yes') return res.status(400).send({
            feedBack: 'League has Started, cannot add more teams!',
            process: 'Fail'
        })
        if (table.running === 'Ended') return res.status(400).send({
            feedBack: 'League has Ended, cannot add teams!',
            process: 'Fail'
        })
        if (table.teams.length === 32) return res.status(400).send({
            feedBack: 'Table is full, max of 32 teams; cannot add more teams!',
            process: 'Fail'
        })
        const duplicateTeam = table.teams.find((t) => t.team === team )
        if (!duplicateTeam) {        
            table.teams = table.teams.concat({ team }) 
            await table.save()
            res.send({
                feedBack: 'New team added',
                process: 'Success'
            })
        } else {
            res.send({
                feedBack: 'team has been taken',
                process: 'Fail'
            }) 
        }
    })
})
router.get('/league/team/remove', async (req, res) => {
    const team = req.query.team.toLowerCase()
    await metadata.find({}, async (e, meta) => {
        const season = meta[0].league.season
        const table = await league.findOne({ season })
        if (table.running === 'yes') return res.status(400).send({
            feedBack: 'League has Started, cannot remove teams!',
            process: 'Fail'
        })
        if (table.running === 'Ended') return res.status(400).send({
            feedBack: 'League has Ended, cannot remove teams!',
            process: 'Fail'
        })
            const teamsToKeep = table.teams.filter((t) => t.team !== team)                    
            if (table.teams.length > teamsToKeep.length) {
                table.teams = []
                table.teams = table.teams.concat(teamsToKeep)
                await table.save()   
                res.send({
                    feedBack: 'Team Removed',
                    process: 'Success'
                })
            } else {
           res.send({
                    feedBack: 'Team Not Found',
                    process: 'Fail'
                })
        }
    })
})
router.get('/league/start', async (req, res) => {
    await metadata.find({}, async (e, meta) => {
        const season = meta[0].league.season, arr = []
        const table = await league.findOne({ season })
        if (table.teams.length < 24) return res.status(400).send({
            feedBack: 'Teams are not up to 24; min of 24 and max of 32 teams take in.'
        })
        table.running = 'yes'
        for (i=0; i<table.teams.length; i++) {
            arr.push(table.teams[i].team)
        }
        await combination.combination(arr, (fixture) => {
            table.fixtures = table.fixtures.concat(fixture)
        })
        await table.save()
        res.send({ feedBack: table.running })
    })
})
router.get('/league/end', async (req, res) => {
    await metadata.find({}, async (e, meta) => {
        const season = meta[0].league.season
        await league.findOne({ season }, async (e, table) => {
            if (table.running === 'no') {
                return res.status(400).send({
                    feedBack: 'Current League has not started, cannot End!'
                })
            }
            table.running = 'ended'
            await table.save()
            res.status(200).send({
                feedBack: 'League Ended!'
            })
        })
    })
})
router.get('/league/running', async (req, res) => {
    await metadata.find({}, async (e, meta) => {
        const season = meta[0].league.season
        const table = await league.findOne({ season })
        res.send({ feedBack: table.running })
    })
})

module.exports = router  
    