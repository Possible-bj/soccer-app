const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const team = require('../models/team')
const router = new express.Router()
router.use(bodyParser.urlencoded({ extended: true}))
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

router.post('/team/logo/add', upload.single('logo'), async (req, res) => {
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

router.post('/team/logo/update', upload.single('logo'), async (req, res) => {
    const name = (req.body.logoname).toLowerCase().trim()
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
    const name = (req.body.logoname).toLowerCase().trim()
    await team.deleteOne({ name }, async (e, del) => {
        if ( del.deletedCount === 0) {
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
module.exports = router