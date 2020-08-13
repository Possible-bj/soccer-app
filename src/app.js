const express = require('express')
const path = require('path')
const hbs = require('hbs')
const auth = require('./utils/auth')
const adminRouter = require('../routers/admin')
const pageRouter = require('../routers/pages')

const app = express()
const port = process.env.PORT || 3000
app.use(adminRouter)
app.use(pageRouter)

const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicPath))


app.get('/auth', (req, res) => {
    switch (req.query.command) {
        case 'auth':
            auth.auth(req.query.lockpass, ({admin, feedBack}) => {
                res.send({admin, feedBack})
            })
        break;
        case 'create':
            auth.create(req.query.name, req.query.pass, (feedBack) => {
                res.send(feedBack)
            })
        break;
        case 'edit':
            auth.edit(req.query.name, req.query.pass, (feedBack) => {
                res.send(feedBack)
            })
        break;
        case 'delete':
            auth.delete(req.query.name, (feedBack) => {
                res.send(feedBack)
            })
        break;
    }
})



app.listen(port, () => {
    console.log(`Server started at port ${port}`)
})