const league = require('../models/league')
const  updateFixture = async (h, hs, as, a, leg, season, operation, callback) => {
    const table = await league.findOne({ season })
    
    if (`${h} vs ${a}` in table.fixtures[0]) {  

        switch (table.fixtures[0][`${h} vs ${a}`][leg].played) {
            case true:
                if ( operation === 'update' ) {
                    return callback(`${leg} already recorded! (${table.fixtures[0][`${h} vs ${a}`][leg].home}
                    ${table.fixtures[0][`${h} vs ${a}`][leg].hs} : ${table.fixtures[0][`${h} vs ${a}`][leg].as}
                    ${table.fixtures[0][`${h} vs ${a}`][leg].away})`)
                } // if else if statement end
                await set(h, hs, as, a, h, leg, table, season, operation, callback)
                break;                
            case false:
                await set(h, hs, as, a, h, leg, table, season, operation, callback)
        } // switch end
    } else if (`${a} vs ${h}` in table.fixtures[0]) {

        switch (table.fixtures[0][`${a} vs ${h}`][leg].played) {
            case true:
                if ( operation === 'update' ) {
                    return callback(`${leg} already recorded! (${table.fixtures[0][`${a} vs ${h}`][leg].home}
                    ${table.fixtures[0][`${a} vs ${h}`][leg].hs} : ${table.fixtures[0][`${a} vs ${h}`][leg].as}
                    ${table.fixtures[0][`${a} vs ${h}`][leg].away})`)
                }// if statement end
                await set(a, hs, as, h, h, leg, table, season, operation, callback) 
                break;
            case false:
                    await set(a, hs, as, h, h, leg, table, season, operation, callback)
        } //switch ends
    } // else if statement ens
} // updateFixture ends
const set = async (t1, hs, as, t2, h, leg, table, season, operation, callback) => {
    if (table.fixtures[0][`${t1} vs ${t2}`][leg].home === h) {
        await league.updateOne({ season }, {
            $set: {
                [`fixtures.0.${t1} vs ${t2}.${leg}.hs`]: hs,
                [`fixtures.0.${t1} vs ${t2}.${leg}.as`]: as
            }
        })
        await validatePlayed(t1, t2, leg, operation, season, callback)
        } else {
            await league.updateOne({ season }, {
                $set: {
                    [`fixtures.0.${t1} vs ${t2}.${leg}.hs`]: as,
                    [`fixtures.0.${t1} vs ${t2}.${leg}.as`]: hs
                }
            })
            await validatePlayed(t1, t2, leg, operation, season, callback)
            }
} // set function ends
const validatePlayed = async (t1, t2, leg, operation, season, callback) => {
    switch (operation) {
        case 'delete':
                await league.updateOne({ season }, {
                    $set: {
                        [`fixtures.0.${t1} vs ${t2}.${leg}.played`]: false
                    }
                })
            break;
        case 'correct':
            break;
        case 'update':
                await league.updateOne({ season }, {
                    $set: {
                        [`fixtures.0.${t1} vs ${t2}.${leg}.played`]: true
                    }
                })
        }
        callback()
}
module.exports = updateFixture