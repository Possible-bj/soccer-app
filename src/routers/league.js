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
    for (i = 0; i < table.teams.length; i++) {
      const team = table.teams[i].team
      const deduction = table.teams[i].deduction
      const current = {
        team: team,
        P: 0,
        W: 0,
        D: 0,
        L: 0,
        GF: 0,
        GA: 0,
        GD: 0,
        Pts: 0,
      }
      const stats = accumulate(current, table, team)
      stats.Pts = stats.W * 3 + stats.D - deduction
      teamObj.push(stats)
    }
    res.status(200).send(teamObj)
  } catch (e) {
    res.status(400).send({ feedback: e.message })
  }
})
// adds a team to the league
router.get('/league/team/add', async (req, res) => {
  const team = req.query.team.toLowerCase()
  try {
    const meta = await metadata.find({})
    const season = meta[0].league.season
    const table = await league.findOne({ season })
    if (table.running === 'yes')
      throw new Error('League has Started, cannot add more teams!')
    if (table.running === 'Ended')
      throw new Error('League has Ended, cannot add teams!')
    if (table.teams.length === 33)
      throw new Error('Table is full, max of 33 teams; cannot add more teams!')
    const duplicateTeam = table.teams.find((t) => t.team === team)
    if (duplicateTeam) {
      throw new Error('team has been taken')
    }
    table.teams = table.teams.concat({ team, deduction: 0 })
    await table.save()
    res.send({
      feedBack: 'New team added',
      process: 'Success',
    })
  } catch (e) {
    res.status(400).send({
      feedBack: e.message,
      process: 'Fail',
    })
  }
})
// removes a team from the league
router.get('/league/team/remove', async (req, res) => {
  const team = req.query.team.toLowerCase().trim()
  try {
    const meta = await metadata.find({})
    const season = meta[0].league.season
    const table = await league.findOne({ season })
    if (table.running === 'yes')
      throw new Error('League has Started, cannot remove teams!')
    if (table.running === 'Ended')
      throw new Error('League has Ended, cannot remove teams!')
    const teamsToKeep = table.teams.filter((t) => t.team !== team)
    if (table.teams.length > teamsToKeep.length) {
      table.teams = []
      table.teams = table.teams.concat(teamsToKeep)
      await table.save()
      res.send({
        feedBack: 'Team Removed',
        process: 'Success',
      })
    } else {
      throw new Error('Team Not Found')
    }
  } catch (e) {
    res.status(400).send({
      feedBack: e.message,
      process: 'Fail',
    })
  }
})
// point deduction
router.get('/league/deduct', async (req, res) => {
  const team = req.query.team,
    val = req.query.val - 0
  const meta = await metadata.find({}),
    season = meta[0].league.season
  try {
    const League = await league.findOne({ season })
    const index = await findIndexByKeyValue(League, 'team', team)
    League.teams.splice(index, 1)
    League.teams = League.teams.concat({ team, deduction: val })
    await League.save()
    res.status(201).send({
      feedBack: 'point deducted!',
    })
  } catch (e) {
    res.status(400).send({
      feedBack: e.message,
    })
  }
})
// starts the current league
router.get('/league/start', async (_req, res) => {
  await metadata.find({}, async (_e, meta) => {
    const season = meta[0].league.season,
      arr = []
    const table = await league.findOne({ season })
    if (table.teams.length < 10)
      return res.status(400).send({
        feedBack:
          'Teams are not up to 10; min of 10 and max of 33 teams take in.',
      })
    table.running = 'yes'
    for (i = 0; i < table.teams.length; i++) {
      arr.push(table.teams[i].team)
    }
    await combination(arr, (fixture) => {
      table.fixtures = table.fixtures.concat(fixture)
    })
    await table.save()
    res.send({ feedBack: table.running })
  })
})
// ends the current league
router.get('/league/end', async (_req, res) => {
  await metadata.find({}, async (_e, meta) => {
    const season = meta[0].league.season
    await league.findOne({ season }, async (_e, League) => {
      if (League.running === 'no') {
        return res.status(400).send({
          feedBack: 'Current League has not started, cannot End!',
        })
      }
      League.running = 'ended'
      await League.save()
      res.status(200).send({
        feedBack: 'League Ended!',
      })
    })
  })
})
// returns league metadata
router.get('/league/running', async (_req, res) => {
  await metadata.find({}, async (_e, meta) => {
    const season = meta[0].league.season
    const table = await league.findOne({ season })
    res.send({ feedBack: table.running })
  })
})
//
const findIndexByKeyValue = async (League, key, value) => {
  if (League.running === 'ended') {
    throw new Error('League has Ended!')
  }
  for (i = 0; i < League.teams.length; i++) {
    if (League.teams[i][key] === value) {
      return i
    }
  }
  throw new Error('Team Does not Exist!')
}
module.exports = router
