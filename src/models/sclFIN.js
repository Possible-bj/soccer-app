const mongoose = require('mongoose')
const sclFINSchema = new mongoose.Schema({
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
        default: 'FIN'
    },
    fixtures: []
}, {
    timestamps: true
})

const sclFIN = mongoose.model('sclFIN', sclFINSchema)

module.exports = sclFIN