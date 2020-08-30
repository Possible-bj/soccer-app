const express = require('express')
require('./db/mongoose')
const path = require('path')
const hbs = require('hbs')
const metadataRouter = require('./routers/metadata')
const pageRouter = require('./routers/pages')
const leagueRouter = require('./routers/league')
const leagueResultRouter = require('./routers/leagueResults')
const gsRouter = require('./routers/sclGS')
const qfRouter = require('./routers/sclQF')
const sfRouter = require('./routers/sclSF')
const finRouter = require('./routers/sclFIN')
const authRouter = require('./routers/auth')

const app = express()
const port = process.env.PORT
app.use(metadataRouter)
app.use(pageRouter)
app.use(leagueRouter)
app.use(leagueResultRouter)
app.use(gsRouter)
app.use(qfRouter)
app.use(sfRouter)
app.use(finRouter)
app.use(authRouter)

const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicPath))

app.listen(port, () => {
    console.log(`Server started at port ${port}`)
})