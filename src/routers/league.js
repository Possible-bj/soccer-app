const express = require('express')
const metadata = require('../models/metadata')
const league = require('../models/league')
const { combination } = require('../utils/combination')
const { accumulate } = require('../utils/team')
const router = new express.Router()
router.get('/table/:sn', async (req, res) => {
    const season = req.params.sn
    try {
        const table = await league.findOne({ season })
    if (!table) {
        throw new Error('Could not find table')
    }
    const teamObj = []
    for(i=0; i<table.teams.length; i++) {
        const team = table.teams[i].team
        const deduction = table.teams[i].deduction
        const current = { team: team, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 }
        const stats = accumulate(current, table, team)
        stats.Pts = ((stats.W * 3) + stats.D) - deduction
        teamObj.push(stats)
    }
    res.status(200).send(teamObj)
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
            table.teams = table.teams.concat({ team, deduction: 0 }) 
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
    const team = req.query.team.toLowerCase().trim()
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
router.get('/league/deduct', async (req, res) => {
    const team = req.query.team, val = req.query.val - 0
    const meta = await metadata.find({}), season = meta[0].league.season
    try {
        const League = await league.findOne({ season })
        const index = await findIndexByKeyValue(League, 'team', team)
            League.teams[index].deduction = val
            await League.save()
            res.status(201).send({
                feedBack: 'point deducted!'
            })
    } catch (e) {
        res.status(400).send({
            feedBack: e.message
        })
    }
    })
router.get('/league/start', async (req, res) => {
    await metadata.find({}, async (e, meta) => {
        const season = meta[0].league.season, arr = []
        const table = await league.findOne({ season })
        if (table.teams.length < 20) return res.status(400).send({
            feedBack: 'Teams are not up to 20; min of 20 and max of 32 teams take in.'
        })
        table.running = 'yes'
        for (i=0; i<table.teams.length; i++) {
            arr.push(table.teams[i].team)
        }
        await combination(arr, (fixture) => {
            table.fixtures = table.fixtures.concat(fixture)
        })
        await table.save()
        res.send({ feedBack: table.running })
    })
})
router.get('/league/end', async (_req, res) => {
    await metadata.find({}, async (_e, meta) => {
        const season = meta[0].league.season
        await league.findOne({ season }, async (_e, League) => {
            if (League.running === 'no') {
                return res.status(400).send({
                    feedBack: 'Current League has not started, cannot End!'
                })
            }
            League.running = 'ended'
            await League.save()
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
const findIndexByKeyValue = async (League, key, value) => {
    if ( League.running === 'ended' ) {
        throw new Error('League has Ended!')
    }
    for (i=0; i<League.teams.length; i++) {
        if(League.teams[i][key] === value) {
            return i
        }
    }
    return -1
}
module.exports = router  
    