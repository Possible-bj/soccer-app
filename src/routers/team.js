const express = require('express')
const multer = require('multer')
const team = require('../models/team')
const router = new express.Router()

const upload = multer({
    limits: {
        fileSize: 50000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.png$/)) {
            return cb(new Error('File must be a PNG file'))
        }
        cb(undefined, true) 
    }
})

router.post('/team/add', upload.single('logo'), async (req, res) => {
    const name = (req.body.logoname).toLowerCase().trim()
    const data = new team({
        name: name,
        logo: req.file.buffer
    })
    await data.save()
    res.redirect('/logo')  
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
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
module.exports = router