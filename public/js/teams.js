const teamPane = document.querySelector('#team-pane')
window.addEventListener('DOMContentLoaded', () => {
const setUp = () => {
    fetch('/team/logo')
      .then((response) => {
        response.json()
          .then((data) => {
            plot(data)
        })
    })
}
// const supreme = {
//     name: 'supreme',
//     leagueStats: {
//         overall: { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 },
//         current: { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 },
//         trophies: 0
//     },
//     sclStats: {
//         overall: { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 },
//         current: { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 },
//         trophies: 0
//     }
// }
const plot = (data) => {
    for (i = 0; i < data.length; i++) {
        // const team = data[i]
        //  !== undefined? data[i+1] : supreme
        const team = document.createElement('div')
    team.classList.add('team')
    team.innerHTML = `
    <div class="team-logo margin-auto"><img src="/team/logo/${data[i].name}"/></div>
    <div class="team-info">
    <div class="stats-pane league-stats">
              <h3 class="hd league-stats-header">
                  League Stats
              </h3>

                <div></div>
                <div>P</div>
                <div>W</div>
                <div>D</div>
                <div>L</div>
                <div>GF</div>
                <div>GA</div>
                <div>GD</div>
                <div>Pts</div>

                <div>Overall</div>
                <div>${data[i].leagueStats.overall.P}</div>
                <div>${data[i].leagueStats.overall.W}</div>
                <div>${data[i].leagueStats.overall.D}</div>
                <div>${data[i].leagueStats.overall.L}</div>
                <div>${data[i].leagueStats.overall.GF}</div>
                <div>${data[i].leagueStats.overall.GA}</div>
                <div>${data[i].leagueStats.overall.GD}</div>
                <div>${data[i].leagueStats.overall.Pts}</div>

                <div>Current</div>
                <div>${data[i].leagueStats.current.P}</div>
                <div>${data[i].leagueStats.current.W}</div>
                <div>${data[i].leagueStats.current.D}</div>
                <div>${data[i].leagueStats.current.L}</div>
                <div>${data[i].leagueStats.current.GF}</div>
                <div>${data[i].leagueStats.current.GA}</div>
                <div>${data[i].leagueStats.current.GD}</div>
                <div>${data[i].leagueStats.current.Pts}</div>

                <div class="span-col-5">Trophies</div>
                <div class="span-col-6">${data[i].leagueStats.trophies}</div>
  
                        </div>
                        
                        <div class="stats-pane scl-stats">
                            <h3 class="hd scl-stats-header">
                                SCL Stats
                            </h3>
                                <div></div>
                                <div>P</div>
                                <div>W</div>
                                <div>D</div>
                                <div>L</div>
                                <div>GF</div>
                                <div>GA</div>
                                <div>GD</div>
                                <div>Pts</div>

                                <div>Overall</div>
                                <div>${data[i].sclStats.overall.P}</div>
                                <div>${data[i].sclStats.overall.W}</div>
                                <div>${data[i].sclStats.overall.D}</div>
                                <div>${data[i].sclStats.overall.L}</div>
                                <div>${data[i].sclStats.overall.GF}</div>
                                <div>${data[i].sclStats.overall.GA}</div>
                                <div>${data[i].sclStats.overall.GD}</div>
                                <div>${data[i].sclStats.overall.Pts}</div>
                            
                                <div>Current</div>
                                <div>${data[i].sclStats.current.P}</div>
                                <div>${data[i].sclStats.current.W}</div>
                                <div>${data[i].sclStats.current.D}</div>
                                <div>${data[i].sclStats.current.L}</div>
                                <div>${data[i].sclStats.current.GF}</div>
                                <div>${data[i].sclStats.current.GA}</div>
                                <div>${data[i].sclStats.current.GD}</div>
                                <div>${data[i].sclStats.current.Pts}</div>

                                <div class="span-col-5">Trophies</div>
                                <div class="span-col-6">${data[i].sclStats.trophies}</div>
                        </div>
    </div>`
teamPane.append(team)
    }
}
setUp()
})



// </div>
// <div class="team">
//     <div class="team-logo"><img src="/team/logo/${rightTeam.name}"/></div>
//     <div class="team-info">
//     <div align="center" class="league-stats">
//                             <h3 class="league-stats-header">
//                                 League Stats
//                             </h3>
//                             <table class="stats-table rel">
//                             <tr>
//                                 <td></td>
//                                 <td>P</td>
//                                 <td>W</td>
//                                 <td>D</td>
//                                 <td>L</td>
//                                 <td>GF</td>
//                                 <td>GA</td>
//                                 <td>GD</td>
//                                 <td>Pts</td>
//                             </tr>
//                             <tr>
//                                 <td>Overall</td>
//                                 <td>${rightTeam.leagueStats.overall.P}</td>
//                                 <td>${rightTeam.leagueStats.overall.W}</td>
//                                 <td>${rightTeam.leagueStats.overall.D}</td>
//                                 <td>${rightTeam.leagueStats.overall.L}</td>
//                                 <td>${rightTeam.leagueStats.overall.GF}</td>
//                                 <td>${rightTeam.leagueStats.overall.GA}</td>
//                                 <td>${rightTeam.leagueStats.overall.GD}</td>
//                                 <td>${rightTeam.leagueStats.overall.Pts}</td>
//                             </tr>
//                             <tr>
//                                 <td>Current</td>
//                                 <td>${rightTeam.leagueStats.current.P}</td>
//                                 <td>${rightTeam.leagueStats.current.W}</td>
//                                 <td>${rightTeam.leagueStats.current.D}</td>
//                                 <td>${rightTeam.leagueStats.current.L}</td>
//                                 <td>${rightTeam.leagueStats.current.GF}</td>
//                                 <td>${rightTeam.leagueStats.current.GA}</td>
//                                 <td>${rightTeam.leagueStats.current.GD}</td>
//                                 <td>${rightTeam.leagueStats.current.Pts}</td>
//                             </tr>
//                             <tr>
//                                 <td colspan="4">Trophies</td>
//                                 <td colspan="5">${rightTeam.leagueStats.trophies}</td>
//                             </tr>
//                                             </table>
//                         </div>
//                         <hr>
//                         <div align="center" class="scl-stats">
//                             <h3 class="scl-stats-header">
//                                 SCL Stats
//                             </h3>
//                             <table class="stats-table rel">
//                             <tr>
//                                 <td></td>
//                                 <td>P</td>
//                                 <td>W</td>
//                                 <td>D</td>
//                                 <td>L</td>
//                                 <td>GF</td>
//                                 <td>GA</td>
//                                 <td>GD</td>
//                                 <td>Pts</td>
//                             </tr>
//                             <tr>
//                                 <td>Overall</td>
//                                 <td>${rightTeam.sclStats.overall.P}</td>
//                                 <td>${rightTeam.sclStats.overall.W}</td>
//                                 <td>${rightTeam.sclStats.overall.D}</td>
//                                 <td>${rightTeam.sclStats.overall.L}</td>
//                                 <td>${rightTeam.sclStats.overall.GF}</td>
//                                 <td>${rightTeam.sclStats.overall.GA}</td>
//                                 <td>${rightTeam.sclStats.overall.GD}</td>
//                                 <td>${rightTeam.sclStats.overall.Pts}</td>
//                             </tr>
//                             <tr>
//                                 <td>Current</td>
//                                 <td>${rightTeam.sclStats.current.P}</td>
//                                 <td>${rightTeam.sclStats.current.W}</td>
//                                 <td>${rightTeam.sclStats.current.D}</td>
//                                 <td>${rightTeam.sclStats.current.L}</td>
//                                 <td>${rightTeam.sclStats.current.GF}</td>
//                                 <td>${rightTeam.sclStats.current.GA}</td>
//                                 <td>${rightTeam.sclStats.current.GD}</td>
//                                 <td>${rightTeam.sclStats.current.Pts}</td>
//                             </tr>
//                             <tr>
//                                 <td colspan="4">Trophies</td>
//                                 <td colspan="5">${rightTeam.sclStats.trophies}</td>
//                             </tr>
//                                             </table>
//                         </div>
//     </div>
// </div>