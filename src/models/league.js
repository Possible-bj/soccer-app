const mongoose = require('mongoose')
const leagueSchema = new mongoose.Schema({
    season: { 
        type: Number,
        unique: true
     },
     running: {
         type: String,
         default: 'no'
     },
    teams: [{
        team: {
            type: String,
            trim: true
        },
        deduction: {
            type: Number,
            default: 0,
        validate(value) {
            if (value < 0 ) {
                throw new Error('Number of points to deduct must be a positive number')
            }
        }
        }
    }],
    fixtures: []
})

const league = mongoose.model('league', leagueSchema)
module.exports = league