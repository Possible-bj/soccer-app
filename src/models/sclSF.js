const mongoose = require('mongoose')
const sclSFSchema = new mongoose.Schema({
    season: {
        type: Number,
        unique: true
    },
    running: {
        type: String,
        default: 'NO'
    },
    code: {
        type: String,
        default: 'SF'
    },
    fixtures: []
})

const sclSF = mongoose.model('sclSF', sclSFSchema)

module.exports = sclSF