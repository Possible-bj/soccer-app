const express = require('express')
const url = require('url')
const Admin = require('../models/admin')
const auth = require('../middleware/auth')
const bodyParser = require('body-parser') 
const router = new express.Router()

router.use(bodyParser.urlencoded({ extended: false }))
router.post('/admin/login/auth', async (req, res) => {
    // const password = req.query.password
    try {
        const admin = await Admin.findByCredentials(req.body.username, req.body.password)
        const token = await admin.generateAuthToken()
        // req.headers.authorization
        res.redirect(url.format({
            pathname: '/admin/board',
            query: {
                username: admin.username,
                _id: admin._id.toString(),
                token
            }
        }))
    } catch (e) {
        res.redirect(url.format({
            pathname: '/admin/login',
            query: {
                feedback: e.message
            }
        }))
    
    }
    // console.log(req.body)
    // res.redirect('/admin/login')
})
router.get('/admin/add', async (req, res) => {
    const username = req.query.username, password = req.query.password
    const admin = new Admin({
        username, password
    })
    await admin.save().then((result) => {
        res.status(201).send({
            feedBack: 'Admin Created!'
        })
    }).catch((e) => {
        res.status(400).send({feedBack: e.message})
    })
})
router.get('/admin/remove', async (req, res) => {
    const username = req.query.username
    await Admin.deleteOne({ username }).then((result) => {
        if (result.deletedCount === 0) {
            throw new Error('Admin not Found!')
        }
        res.status(200).send({
            feedBack: 'Admin Removed!'
        })
    }).catch((e) => {
        res.status(404).send({
            feedBack: e.message
        })
    })
})
router.get('/admin/update', async (req, res) => {
    const username = req.query.username, password = req.query.password
    try {
        const admin = await Admin.findOne({ username })
        if ( !admin ) {
            throw new Error('Admin not Found!')
        }
        admin.password = password
        await admin.save()
        res.status(200).send({
            feedBack: 'Admin Updated!'
        })
    } catch (e) {
        res.status(404).send({
            feedBack: e.message
        })
    }
})
router.get('/admin/get/all', async (req, res) => {
    await Admin.find({}).then((result) =>{
        res.send(result)
    }).catch((e) => {
        res.send({feedBack: e.message})
    })
})
router.get('/admin/board', auth, (req, res) => {
        res.render('admin', {
            title:  'Admin Board',
            name: 'Benjamin Possible',
            admin: req.query
        }) 
})
module.exports = router