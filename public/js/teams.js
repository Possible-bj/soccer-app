const teamPane = document.querySelector('#team-pane')
window.addEventListener('DOMContentLoaded', () => {
    
const setUp = () => {
  fetch('/team/logo')
    .then((response) => {
      response.json()
        .then((data) => {
          personalise()
          plot(data)
      })
  })
}
const personalise = () => {
  const pane = document.querySelector('.body-content')
  for (i=0; i<pane.childElementCount; i++) {
    if ( pane.children[i].classList.contains('frame') ) {
      pane.removeChild(pane.children[i])
    }
  }
}

const plot = (data) => {
  for (i = 0; i < data.length; i++) {
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