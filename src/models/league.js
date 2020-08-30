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
        P: {
            type: Number,
            default: 0,
        validate(value) {
            if (value < 0 ) {
                throw new Error('Number of games played must be a positive number')
            }
        }
        },
        W: {
            type: Number,
            default: 0,
        validate(value) {
            if (value < 0 ) {
                throw new Error('Number of games won must be a positive number')
            }
        }
        },
        D: {
            type: Number,
            default: 0,
        validate(value) {
            if (value < 0 ) {
                throw new Error('Number of draws must be a positive number')
            }
        }
        },
        L: {
            type: Number,
            default: 0,
        validate(value) {
            if (value < 0 ) {
                throw new Error('Number of losses must be a positive number')
            }
        }
        },
        GF: {
            type: Number,
            default: 0,
        validate(value) {
            if (value < 0 ) {
                throw new Error('Number of goals scored must be a positive number')
            }
        }
        },
        GA: {
            type: Number,
            default: 0,
        validate(value) {
            if (value < 0 ) {
                throw new Error('Number of goals conceeded must be a positive number')
            }
        }
        },
        GD: {
            type: Number,
            default: 0,
        },
        Pts: {
            type: Number,
            default: 0,
        validate(value) {
            if (value < 0 ) {
                throw new Error('Number of points gathered must be a positive number')
            }
        }
        }
    }],
    fixtures: []
})
// leagueSchema.statics.findByCredentials = async (season, password) => {
//     const user = await User.findOne({ email })
//     if (!user) {
//         throw new Error('Unable to login')
//     }
//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) {
//         throw new Error('Unable to login')
//     }
//     return user
// }
const league = mongoose.model('league', leagueSchema)
// leagueStatUpdate(15, 'possible', 2, 1, 'pain')
module.exports = league