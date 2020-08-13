const express = require('express')
const ligAct = require('../src/utils/ligact')
const sclAct = require('../src/utils/sclact')
const router = new express.Router()

router.get('', (req, res) => {
    res.render('index', {
        title: 'SUPREME DLO ',
        name: 'Benjamin Possible'
    })
})

router.get('/teams', (req, res) => {
    res.render('teams', {
        title: 'SUPREME TEAMS',
        name: 'Benjamin Possible'
    })
})

router.get('/league', (req, res) => {
    res.render('league', {
        title: 'Supreme League',
        name: 'Benjamin Possible'
    })
})

router.get('/request', (req, res) => {
    switch(req.query.command) {
        case 'read':
            ligAct.readTeam(req.query.sn, (feedBack) => {
                res.send(feedBack)
            })
            break;
        case 'readResult':
            ligAct.readResult(req.query.sn, req.query.rn, (feedBack) => {
                res.send(feedBack)
            }) 
            break;
        case 'leagueseason':
            ligAct.fetchSeason('league', ({season, day}) => {
                res.send({season, day})
            })
            break;
        case 'sclseason':
            ligAct.fetchSeason('scl', ({season}) => {
                res.send({season})
            })
            break;
        case 'fetchGS':
            sclAct.fetchGS(req.query.sn, req.query.g, (group) => {
                res.send(group)
            })
            break;
        case 'fetchKO':
            sclAct.fetchKO(req.query.sn, (fixture) => {
                res.send(fixture)
            })
            break;
        case 'sclprogress':
            sclAct.sclProgress(({feedBack}) => {
                res.send({feedBack})
            })
    }  
})
router.get('/scl', (req, res) => {
    res.render('scl', {
        title:  'Supreme Champions League',
        name: 'Benjamin Possible'
    })
})

router.get('/admin', (req, res) => {
    res.render('admin', {
        title:  'Admin Board',
        name: 'Benjamin Possible'
    })
})

module.exports = router