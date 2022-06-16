const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const team = require('../models/team')
const metadata = require('../models/metadata')
const league = require('../models/league')
const sclGS = require('../models/sclGS')
const sclQF = require('../models/sclQF')
const sclSF = require('../models/sclSF')
const sclFIN = require('../models/sclFIN')
const {
  getCurrentLeagueStats,
  getOverallLeagueStats,
  getLeagueTrophies,
  getOverallSclStats,
  getCurrentSclStats,
  getSclTrophies,
} = require('../utils/team')

const router = new express.Router()
router.use(bodyParser.urlencoded({ extended: true }))
const upload = multer({
  limits: {
    fileSize: 50000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.png$/)) {
      return cb(new Error('File must be a PNG file'))
    }
    cb(undefined, true)
  },
})

router.post(
  '/team/logo/add',
  upload.single('logo'),
  async (req, res) => {
    const name = req.body.logoname.toLowerCase().trim()
    const data = new team({
      name: name,
      logo: req.file.buffer,
    })
    await data.save()
    res.redirect('/logo')
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message })
  },
)

router.post('/team/logo/update', upload.single('logo'), async (req, res) => {
  const name = req.body.logoname.toLowerCase().trim()
  const logo = req.file.buffer
  const data = await team.findOne({ name })
  if (!data) {
    return res.status(400).send({ feedback: 'team logo does not exist!' })
  }
  data.logo = logo
  await data.save()
  res.redirect('/logo')
})

router.post('/team/logo/remove', async (req, res) => {
  const name = req.body.logoname.toLowerCase().trim()
  await team.deleteOne({ name }, async (e, del) => {
    if (del.deletedCount === 0) {
      return res.status(400).send({ feedback: 'team logo does not exist!' })
    }
    res.redirect('/logo')
  })
})

router.get('/team/logo/:name', async (req, res) => {
  const name = req.params.name
  const data = await team.findOne({ name })
  if (!data) {
    const sup = await team.findOne({ name: 'supreme' })
    res.set('Content-Type', 'image/png')
    res.send(sup.logo)
    return 0
  }
  res.set('Content-Type', 'image/png')
  res.send(data.logo)
})

router.get('/team/logo', async (req, res) => {
  const teamsObj = []
  const teams = await team.find({})
  const meta = await metadata.find({})
  const currentLeague = await league.findOne({ season: meta[0].league.season })
  const allLeagues = await league.find({}, null, {
    limits: parseInt(req.query.limit),
    skip: parseInt(req.query.skip),
  })
  for (let i = 0; i < teams.length; i++) {
    const toObj = teams[i].toObject()
    if (toObj.name !== 'supreme') {
      const arr = []
      delete toObj.logo
      delete toObj._id
      delete toObj.createdAt
      delete toObj.updatedAt, delete toObj.__v
      const overallLeagueStats = await getOverallLeagueStats(
        toObj.name,
        arr,
        allLeagues,
      )
      const currentLeagueStats = await getCurrentLeagueStats(
        toObj.name,
        currentLeague,
      )
      const leagueTrophies = await getLeagueTrophies(toObj.name, allLeagues)
      const overallSclStats = await getOverallSclStats(toObj)
      const currentSclStats = await getCurrentSclStats(
        toObj,
        meta[0].scl.season,
      )
      const sclTrophies = await getSclTrophies(toObj)
      toObj.leagueStats = {
        overall: overallLeagueStats,
        current: currentLeagueStats,
        trophies: leagueTrophies,
      }
      toObj.sclStats = {
        overall: overallSclStats,
        current: currentSclStats,
        trophies: sclTrophies,
      }
      teamsObj.push(toObj)
    }
  }
  res.send(teamsObj)
})
router.get('/current/league/teams', async (req, res) => {
  const teamArray = []
  const meta = await metadata.find({}),
    season = meta[0].league.season
  const currentLeague = await league.findOne({ season })
  currentLeague.teams.forEach((element) => {
    teamArray.push(element.team)
  })
  res.send(teamArray)
})
router.get('/current/scl/group/teams', async (req, res) => {
  const teamArray = [],
    g = req.query.group
  const meta = await metadata.find({}),
    season = meta[0].scl.season
  const currentGS = await sclGS.findOne({ season })
  currentGS.groups[g][0].teams.forEach((element) => {
    teamArray.push(element.team)
  })
  res.send(teamArray)
})
router.get('/current/scl/ko/teams', async (req, res) => {
  const teamsObj = { home: [], away: [] },
    stage = req.query.stage
  const meta = await metadata.find({}),
    season = meta[0].scl.season
  let currentKO
  if (stage === 'QF') currentKO = await sclQF.findOne({ season })
  if (stage === 'SF') currentKO = await sclSF.findOne({ season })
  if (stage === 'FIN') currentKO = await sclFIN.findOne({ season })
  for (x in currentKO.fixtures[0]) {
    // console.log(currentKO.fixtures[0][x])
    teamsObj.home.push(currentKO.fixtures[0][x].firstLeg.home)
    teamsObj.away.push(currentKO.fixtures[0][x].firstLeg.away)
  }
  res.send(teamsObj)
})

module.exports = router
