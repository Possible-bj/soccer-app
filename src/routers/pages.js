const express = require('express')
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

router.get('/scl', (req, res) => {
    res.render('scl', {
        title:  'Supreme Champions League',
        name: 'Benjamin Possible'
    })
})

router.get('/admin', (req, res) => {
    res.render('404', {
        title: 'Page Not Found!',
        name: 'Benjamin Possible'
    })
})
module.exports = router