require('../../src/db/mongoose')

const LeagueResult = require('../../src/models/leagueResults')
const League = require('../../src/models/league')

const getResult = async (team) => {
  try {
    let count = 1
    const results = await LeagueResult.find({ season: 80 })

    const neededResults = results.forEach((res) => {
      res.result.map((data, i) => {
        if (data.ht === team || data.at === team) {
          console.log(
            `${count} Match(s) Played, Found on Match day: ${res.day}, Slot: ${i}`,
          )
          console.log(data)
          count++
        }
      })
    })
    process.exit()
  } catch (error) {
    console.log(error.message)
    process.exit()
  }
}
const getTeam = async (tm) => {
  try {
    let count = 0
    const league = await League.findOne({ season: 80 })
    // console.log(league)
    if (!league) {
      return console.log('Not Found')
    }
    const obj = league.toObject()

    const team = obj.teams.find((team) => tm === team.team)
    console.log(team)
    process.exit()
  } catch (error) {
    console.log(error.message)
    process.exit()
  }
}

getResult('droidgamegod')
// getTeam('droidgamegod')
