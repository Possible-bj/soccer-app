const express = require('express')
const sclGS = require('../models/sclGS')
const metadata = require('../models/metadata')
const combination = require('../utils/combination')
const router = new express.Router()
router.get('/scl/groups/team/add', async (req, res) => {
    const team = req.query.team    
    await groupSelector(team, (response) => {
        res.send(response)
    })
})
router.get('/scl/groups/team/remove', async (req, res) => {
    const team = req.query.team
    const meta = await metadata.find({})
    const season = meta[0].scl.season
    removeTeam(team, season, (response) => {
        res.send(response)
    }) 
})
router.get('/scl/fetch/group', async (req, res) => {
    const season = req.query.sn, g = req.query.g
    const GS = await sclGS.findOne({ season })
    if (GS === null) return res.status(400).send({
        feedBack: 'table not available'
    })
    res.send(GS.groups[g][0].teams)
})
router.get('/scl/start/GS', async (req, res) => {
        const meta = await metadata.find({})
        const season = meta[0].scl.season
        const g = ['A', 'B', 'C', 'D']
        for (i=0; i<4; i++) {
        const GS = await sclGS.findOne({ season })
        const teams = GS.groups[g[i]][0].teams
        if (teams.length === 0) return res.status(400).send({
            feedBack: 'teams have not been submitted!'
        }) 
        if (teams.length !== 0 && teams.length !== 4) return res.status(400).send({
            feedBack: 'teams are not complete!'
        })
        const arr = [teams[0].team, teams[1].team, teams[2].team, teams[3].team]
        await combination.combination(arr, async (fixture) => {
            await sclGS.updateOne({ season }, {
                $push: {
                    [`groups.${g[i]}.1.fixtures`]: fixture[0]
                }
            })
        })
        if (GS.running === 'NO') {
            GS.running = 'YES'
        }
        await GS.save()
    }
        meta[0].scl.running = 'group stage'
        meta[0].scl.shortCode = 'GS'
        await meta[0].save()
        res.status(200).send({
            feedBack: 'Fixtures created; Scl Started!'
        })
    
})
const removeTeam = async (team, season, callback) => {
    const GS = await sclGS.findOne({ season })
    for (x in GS.groups) {
        const result = await sclGS.updateOne({ season }, {
            $pull: {
                [`groups.${x}.0.teams`]: {
                    team: team
                }
            }
        })
        if (result) {
            if (result.nModified === 0 && x === 'D') {
                callback({feedBack: "Team Not Found!"})
            } else if (result.nModified === 1) {
                return callback({feedBack: 'Team Removed!'})
            }
        }
        }
    }
const groupSelector = async (team, callback) => {
    const meta = await metadata.find({})
    const season = meta[0].scl.season
    await picker(team, season, callback)
}
const picker = async (team, season, callback) => {
    const groups = ['A', 'B', 'C', 'D']
    const GS = await sclGS.findOne({ season })
    const group = {
        team: team,
        P: 0,
        W: 0,
        D: 0,
        L: 0,
        GF: 0,
        GA: 0,
        GD: 0,
        Pts: 0
    }
        const g = groups[Math.floor(Math.random()*groups.length)]
        // GS.groups[g][0].teams
        const teamSize = GS.groups[g][0].teams.length
        if(teamSize === 0 || teamSize !== 4) {        
            if (isGrouped(team, GS.groups)) {
                return callback({
                    feedBack: 'Team has already been grouped'
                })
            } else {
                await sclGS.updateOne({ season }, {
                    $push: {
                        [`groups.${g}.0.teams`]: group
                    }
                })
            callback({
                group: g,
                feedBack: 'Success'
            })
        }
        } else if (teamSize === 4) {
            if(isComplete(GS.groups)) {
                callback({
                    feedBack: 'All groups are filled'
                })
            } else {
                await groupSelector(team, callback)
            }
        }
} 
const isComplete = (groups) => {
    const a = groups.A[0].teams.length, b = groups.B[0].teams.length, c = groups.C[0].teams.length, d = groups.D[0].teams.length
    return a === 4 && b === 4 && c === 4 && d === 4
}
const isGrouped = (team, groups) => {
    for (x in groups)  {
          const match = groups[x][0].teams.find((data) => data.team === team)
        if (match) {
            return true
        }
    }
}

module.exports = router
