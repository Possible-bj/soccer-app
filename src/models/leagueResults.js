const mongoose = require('mongoose')
const resultSchema = new mongoose.Schema({
    season: {
        type: Number,
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    result: [{
        ht: {
            type: String,
            trim: true
        },
        hs: {
            type: Number
        },
        as: {
            type: Number
        },
        at: {
            type: String,
            trim: true
        },
        leg: {
            type: String
        }
    }]
})

const leagueResult = mongoose.model('leagueResult', resultSchema)

module.exports = leagueResult