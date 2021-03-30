const mongoose = require('mongoose')
const metaSchema = new mongoose.Schema({
    league: {
        season: {
            type: Number
        },
        day: {
            type: Number
        }
    },
    scl: {
        season: {
            type: Number
        },
        running: {
            type: String,
            default: 'none'
        },
        shortCode: {
            type: String,
            default: 'none'
        }
    }
}, {
    timestamps: true
})
const metadata = mongoose.model('metadata', metaSchema)

module.exports = metadata