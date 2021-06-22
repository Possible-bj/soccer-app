const express = require('express')
// const puppeteer = require('puppeteer')
const cookieParser = require('cookie-parser')
const url = require('url')
const path = require('path')
// const bodyParser = require('body-parser') 
const router = new express.Router()

router.use(express.json())
router.use(cookieParser())
router.get('/', (req, res) => {
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

router.get('/logo', (req, res) => {
    res.render('logo-form', {
        title:  'Supreme Champions League',
        name: 'Benjamin Possible'
    })
})

router.get('/master', (req, res) => {
    res.render('form', {
      title: 'Supreme Back Office!',
      name: 'Benjamin Possible',
      info: 'Access Denied!'
    })
})
router.get('/master/access', (req, res) => {
  if ( req.cookies['masterCode'] === process.env.MASTER_CODE) {
    res.render(`master`, {
      title: 'Supreme Back Office!',
      name: 'Benjamin Possible'
    })
  }
  else {
    res.redirect('/master')
  }
})
router.post('/master/auth', (req, res) => {
  if (req.body.masterCode === process.env.MASTER_CODE) {
    // console.log('run')
    res.cookie('masterCode', req.body.masterCode, { maxAge: 1800000 })
    res.sendFile(path.resolve(__dirname, '../templates/views'))
    return res.send( { url: '/master/access' } )
  }
  res.status(400).redirect(
    url.format({
      pathname: '/master'
    })
  )
})
// router.get('/resume', (req, res) => {
//   res.render('resume')
// })
// router.get('/printpdf', async (req, res) => { 
//   try {
//     const browser = await puppeteer.launch()
//     const page = await browser.newPage()
//     await page.goto('/resume', {
//       waitUntil: 'networkidle2'
//     })
//     await page.setViewport({ width: 1680, height: 1050 })
//     const date = new Date()
//     const pdfPath = `${path.join(__dirname, `../../public/pdf/resume${date.getTime()}.pdf`)}`
//     const pdf = await page.pdf({
//       path: pdfPath,
//       format: 'A4',
//       printBackground: true
//     })
//     await browser.close()
//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Length": pdf.length
//     })
//     res.sendFile(pdfPath)
//   } catch (e) {
//     res.send(e.message)
//   }
// })
module.exports = router