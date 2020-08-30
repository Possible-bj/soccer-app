const express = require('express')
const admin = require('../models/admin')
const router = new express.Router()

router.get('/admin/auth', async (req, res) => {
    const pass = req.query.pass
    await admin.findOne({ pass }).then((result) => {
        if (result === null) {
            throw new Error('fail')
        }
        res.status(200).send({ 
            feedBack: 'success',
            admin: result.name
        })
    }).catch((e) => {
        res.status(404).send({
            feedBack: e.message
        })
    })
})
router.get('/admin/add', async (req, res) => {
    const name = req.query.name, pass = req.query.pass
    const newAdmin = new admin({
        name, pass
    })
    await newAdmin.save().then((result) => {
        res.status(201).send({
            feedBack: 'Admin Created!'
        })
    }).catch((e) => {
        res.status(400).send({feedBack: e.message})
    })
})
router.get('/admin/remove', async (req, res) => {
    const name = req.query.name
    await admin.deleteOne({ name }).then((result) => {
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
    const name = req.query.name, pass = req.query.pass
    await admin.updateOne({ name }, {
        $set: {
            pass: pass
        }
    }).then((result) => {
        if (result.nModified === 0) {
            throw new Error('Admin not Found!')
        }
        res.status(200).send({
            feedBack: 'Admin Updated!'
        })
    }).catch((e) => {
        res.status(404).send({
            feedBack: e.message
        })
    })
})
router.get('/admin/check', async (req, res) => {
    await admin.find({}).then( async (result) => {
        if (result.length === 0) {
            const newAdmin = new admin({
                name: 'possible',
                pass: 'mazerunner'
            })
            await newAdmin.save()
        }
        console.log(result)
    }).catch((e) => {
        console.log({feedBack: e.message})
    })
})
router.get('/admin/get/all', async (req, res) => {
    await admin.find({}).then((result) =>{
        res.send(result)
    }).catch((e) => {
        res.send({feedBack: e.message})
    })
})
router.get('/admin/:id', (req, res) => {
    if ( req.params.id === '69476698') {
        res.render('admin', {
            title:  'Admin Board',
            name: 'Benjamin Possible'
        })
    } else {
        res.render('404', {
            title:  'Page Not Found!',
            name: 'Benjamin Possible'
        })
    }
})
module.exports = router