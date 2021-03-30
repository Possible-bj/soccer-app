const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const validator = require('validator')
const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password can not contain \"password\"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
        }
    }]
}, {
    timestamps: true
})

adminSchema.methods.generateAuthToken = async function () {
    const admin = this
    const token = jwt.sign({_id: admin._id.toString()}, process.env.JWT_SECRET)
    admin.tokens = admin.tokens.concat({ token })
    await admin.save()
    return token
}
adminSchema.statics.findByCredentials = async function (username, password) {
    const admin = await this.findOne({ username })
    if ( !admin ) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if ( !isMatch ) {
        throw new Error('Unable to login')
    }
    return admin
}

adminSchema.pre('save', async function (next) {
    const admin = this
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }
    next()
})
const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin