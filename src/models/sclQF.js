const mongoose = require('mongoose')
const sclQFSchema = new mongoose.Schema({
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
        default: 'QF'
    },
    fixtures: []
}, {
    timestamps: true
})

const sclQF = mongoose.model('sclQF', sclQFSchema)

module.exports = sclQF