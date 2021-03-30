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
            trim: true,
            validate(value) {
                if (value.includes('.')) {
                    throw new Error('Team name can not contain a dot \"(.)\"')    
                }
            }
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
}, {
    timestamps: true
})

const league = mongoose.model('league', leagueSchema)
module.exports = league