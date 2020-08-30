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
})

const sclGS = mongoose.model('sclGS', sclGSSchema)

module.exports = sclGS
// const data = new sclGS({
//     season: 15,
//     groups: {
//         A: [{
//             teams: []
//         },
//     {
//         fixtures: []
//     }],
//         B: [{
//             teams: []
//         },
//     {
//         fixtures: []
//     }],
//         C: [{
//             teams: []
//         },
//     {
//         fixtures: []
//     }],
//         D: [{
//             teams: []
//         },
//     {
//         fixtures: []
//     }]
//     }
// })
// .save().then((data) => {
//     console.log(data)
// }).catch((e) => {
//     console.log(e.message)
// })