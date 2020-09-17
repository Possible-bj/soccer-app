const mongoose = require('mongoose')
const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    logo: {
        type: Buffer,
        required: true
    }
}, {
    timestamps: true
})

const team = mongoose.model('team', teamSchema)

module.exports = team