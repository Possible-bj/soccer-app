const mongoose = require('mongoose')
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    pass: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
})
const admin = mongoose.model('admin', adminSchema)

module.exports = admin