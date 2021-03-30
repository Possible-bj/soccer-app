const mongoose = require('mongoose')
const sclGSSchema = new mongoose.Schema({
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
        default: 'GS'
    },
    groups: {}
}, {
    timestamps: true
})

const sclGS = mongoose.model('sclGS', sclGSSchema)

module.exports = sclGS