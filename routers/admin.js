const express = require('express')
const ligAct = require('../src/utils/ligact')
const sclAct = require('../src/utils/sclact')
const router = new express.Router()

router.get('/leagueaction', (req, res) => {
    switch(req.query.command) {
        case 'add':
            ligAct.addTeam(req.query.team, req.query.P, req.query.W, req.query.D, req.query.L, req.query.GF, req.query.GA, req.query.GD, req.query.Pts, ({feedBack, process}) => {
                res.send({feedBack, process})
            })
            break;
        case 'remove':
            ligAct.removeTeam(req.query.team, ({feedBack, process}) => {
                res.send({feedBack, process})
            })
            break;
        case 'edit':
            ligAct.editTeam(req.query.team, req.query.P, req.query.W, req.query.D, req.query.L, req.query.GF, req.query.GA, req.query.GD, req.query.Pts, ({feedBack, process}) => {
                res.send({feedBack, process})
            })
            break;
        case 'result':
            ligAct.updateResult(req.query.ht, req.query.hs, req.query.as, req.query.at, (feedBack) => {
                res.send(feedBack)
            })   
            break;
        case 'nextLeagueSeason':
            ligAct.nextLeagueSeason((feedBack) => {
                res.send(feedBack)
            })
            break;
        case 'nextSclSeason':
            ligAct.nextSclSeason((feedBack) => {
                res.send(feedBack)
            })        
            break;
        case 'nextLeagueDay':
            ligAct.nextLeagueDay((feedBack) => {
                res.send(feedBack)
            })
    }
    
})
router.get('/sclaction', (req, res) => {
    switch(req.query.command) {
        case 'selectGroup':
            sclAct.groupSelector(req.query.team, ({feedBack}) => {
                res.send({feedBack})
            })
        break;
        case 'startScl':
            sclAct.createFixtures(({feedBack}) => {
                res.send({feedBack})
            })
        break;
        case 'endGS':
            sclAct.nextStage('quarter finals', ({feedBack}) => {
                res.send({feedBack})
            })
        break;
        case 'endQF':
            sclAct.nextStage('semi finals', ({feedBack}) => {
                res.send({feedBack})
            })
        break;
        case 'endSF':
            sclAct.nextStage('final', ({feedBack}) => {
                res.send({feedBack})
            })
        break;
        case 'endSeason':
            sclAct.nextStage('Ended', ({feedBack}) => {
                res.send({feedBack})
            })
        break;
        case 'updateSclResult':
            sclAct.updateResult(req.query.h, req.query.hs, req.query.a, req.query.as, req.query.leg, req.query.g, ({feedBack}) => {
                res.send({feedBack})
            })
    }
})

module.exports = router