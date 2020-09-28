

const teamPane = document.querySelector('#team-pane')
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        setUp()
    }, 2000)

const setUp = () => {
    fetch('/team/logo').then((response) => {
        response.json().then((data) => {
            plot(data)
        })
    })
}
const supreme = {
    name: 'supreme',
    leagueStats: {
        overall: { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 },
        current: { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 },
        trophies: 0
    },
    sclStats: {
        overall: { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 },
        current: { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 },
        trophies: 0
    }
}
const plot = (data) => {
    for (i = 0; i < data.length; i+=2) {
        const rightTeam = data[i+1] !== undefined? data[i+1] : supreme
        const rowDiv = document.createElement('div')
    rowDiv.classList.add('row')
    rowDiv.innerHTML = `<div class="team">
    <div class="team-logo"><img src="/team/logo/${data[i].name}"/></div>
    <div class="team-info">
    <div align="center" class="league-stats">
                            <h3 class="league-stats-header">
                                League Stats
                            </h3>
                            <table class="stats-table rel">
            <tr>
                <td></td>
                <td>P</td>
                <td>W</td>
                <td>D</td>
                <td>L</td>
                <td>GF</td>
                <td>GA</td>
                <td>GD</td>
                <td>Pts</td>
            </tr>
            <tr>
                <td>Overall</td>
                <td>${data[i].leagueStats.overall.P}</td>
                <td>${data[i].leagueStats.overall.W}</td>
                <td>${data[i].leagueStats.overall.D}</td>
                <td>${data[i].leagueStats.overall.L}</td>
                <td>${data[i].leagueStats.overall.GF}</td>
                <td>${data[i].leagueStats.overall.GA}</td>
                <td>${data[i].leagueStats.overall.GD}</td>
                <td>${data[i].leagueStats.overall.Pts}</td>
            </tr>
            <tr>
                <td>Current</td>
                <td>${data[i].leagueStats.current.P}</td>
                <td>${data[i].leagueStats.current.W}</td>
                <td>${data[i].leagueStats.current.D}</td>
                <td>${data[i].leagueStats.current.L}</td>
                <td>${data[i].leagueStats.current.GF}</td>
                <td>${data[i].leagueStats.current.GA}</td>
                <td>${data[i].leagueStats.current.GD}</td>
                <td>${data[i].leagueStats.current.Pts}</td>
            </tr>
            <tr>
                <td colspan="4">Trophies</td>
                <td colspan="5">${data[i].leagueStats.trophies}</td>
            </tr>
                            </table>
                        </div>
                        <hr>
                        <div align="center" class="scl-stats">
                            <h3 class="scl-stats-header">
                                SCL Stats
                            </h3>
                            <table class="stats-table rel">
                            <tr>
                                <td></td>
                                <td>P</td>
                                <td>W</td>
                                <td>D</td>
                                <td>L</td>
                                <td>GF</td>
                                <td>GA</td>
                                <td>GD</td>
                                <td>Pts</td>
                            </tr>
                            <tr>
                                <td>Overall</td>
                                <td>${data[i].sclStats.overall.P}</td>
                                <td>${data[i].sclStats.overall.W}</td>
                                <td>${data[i].sclStats.overall.D}</td>
                                <td>${data[i].sclStats.overall.L}</td>
                                <td>${data[i].sclStats.overall.GF}</td>
                                <td>${data[i].sclStats.overall.GA}</td>
                                <td>${data[i].sclStats.overall.GD}</td>
                                <td>${data[i].sclStats.overall.Pts}</td>
                            </tr>
                            <tr>
                                <td>Current</td>
                                <td>${data[i].sclStats.current.P}</td>
                                <td>${data[i].sclStats.current.W}</td>
                                <td>${data[i].sclStats.current.D}</td>
                                <td>${data[i].sclStats.current.L}</td>
                                <td>${data[i].sclStats.current.GF}</td>
                                <td>${data[i].sclStats.current.GA}</td>
                                <td>${data[i].sclStats.current.GD}</td>
                                <td>${data[i].sclStats.current.Pts}</td>
                            </tr>
                            <tr>
                                <td colspan="4">Trophies</td>
                                <td colspan="5">${data[i].sclStats.trophies}</td>
                            </tr>
                                            </table>
                        </div>
    </div>
</div>
<div class="team">
    <div class="team-logo"><img src="/team/logo/${rightTeam.name}"/></div>
    <div class="team-info">
    <div align="center" class="league-stats">
                            <h3 class="league-stats-header">
                                League Stats
                            </h3>
                            <table class="stats-table rel">
                            <tr>
                                <td></td>
                                <td>P</td>
                                <td>W</td>
                                <td>D</td>
                                <td>L</td>
                                <td>GF</td>
                                <td>GA</td>
                                <td>GD</td>
                                <td>Pts</td>
                            </tr>
                            <tr>
                                <td>Overall</td>
                                <td>${rightTeam.leagueStats.overall.P}</td>
                                <td>${rightTeam.leagueStats.overall.W}</td>
                                <td>${rightTeam.leagueStats.overall.D}</td>
                                <td>${rightTeam.leagueStats.overall.L}</td>
                                <td>${rightTeam.leagueStats.overall.GF}</td>
                                <td>${rightTeam.leagueStats.overall.GA}</td>
                                <td>${rightTeam.leagueStats.overall.GD}</td>
                                <td>${rightTeam.leagueStats.overall.Pts}</td>
                            </tr>
                            <tr>
                                <td>Current</td>
                                <td>${rightTeam.leagueStats.current.P}</td>
                                <td>${rightTeam.leagueStats.current.W}</td>
                                <td>${rightTeam.leagueStats.current.D}</td>
                                <td>${rightTeam.leagueStats.current.L}</td>
                                <td>${rightTeam.leagueStats.current.GF}</td>
                                <td>${rightTeam.leagueStats.current.GA}</td>
                                <td>${rightTeam.leagueStats.current.GD}</td>
                                <td>${rightTeam.leagueStats.current.Pts}</td>
                            </tr>
                            <tr>
                                <td colspan="4">Trophies</td>
                                <td colspan="5">${rightTeam.leagueStats.trophies}</td>
                            </tr>
                                            </table>
                        </div>
                        <hr>
                        <div align="center" class="scl-stats">
                            <h3 class="scl-stats-header">
                                SCL Stats
                            </h3>
                            <table class="stats-table rel">
                            <tr>
                                <td></td>
                                <td>P</td>
                                <td>W</td>
                                <td>D</td>
                                <td>L</td>
                                <td>GF</td>
                                <td>GA</td>
                                <td>GD</td>
                                <td>Pts</td>
                            </tr>
                            <tr>
                                <td>Overall</td>
                                <td>${rightTeam.sclStats.overall.P}</td>
                                <td>${rightTeam.sclStats.overall.W}</td>
                                <td>${rightTeam.sclStats.overall.D}</td>
                                <td>${rightTeam.sclStats.overall.L}</td>
                                <td>${rightTeam.sclStats.overall.GF}</td>
                                <td>${rightTeam.sclStats.overall.GA}</td>
                                <td>${rightTeam.sclStats.overall.GD}</td>
                                <td>${rightTeam.sclStats.overall.Pts}</td>
                            </tr>
                            <tr>
                                <td>Current</td>
                                <td>${rightTeam.sclStats.current.P}</td>
                                <td>${rightTeam.sclStats.current.W}</td>
                                <td>${rightTeam.sclStats.current.D}</td>
                                <td>${rightTeam.sclStats.current.L}</td>
                                <td>${rightTeam.sclStats.current.GF}</td>
                                <td>${rightTeam.sclStats.current.GA}</td>
                                <td>${rightTeam.sclStats.current.GD}</td>
                                <td>${rightTeam.sclStats.current.Pts}</td>
                            </tr>
                            <tr>
                                <td colspan="4">Trophies</td>
                                <td colspan="5">${rightTeam.sclStats.trophies}</td>
                            </tr>
                                            </table>
                        </div>
    </div>
</div>`
teamPane.append(rowDiv)
    }
}
})