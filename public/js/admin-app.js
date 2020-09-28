// Variable Declaration
const stageChanger = document.querySelector('.stage-chn-btn')
const fixctrl = document.querySelector('.scl-fixture-controls')
const stageIndicator = document.querySelector('.scl-stage-ind')
const sclTeamAddBtn = document.querySelector('.scl-team-add-btn')
const sclTeamRemoveBtn = document.querySelector('.scl-team-remove-btn')
const entryFb = document.querySelector('#entry-fb')
const FB = document.querySelector('#FB')
const btnPane = document.querySelector('#btn-pane')
const upBtn = document.querySelector('#update-btn')
const authFrame = document.querySelector('.auth-pane')
const adminBoard = document.querySelector('.body-content')
const leageResBtn = document.querySelector('.res-sub')
const authPane = document.querySelector('.auth-box')
const adminInfo = document.querySelector('.admin-info')
const authForm = document.querySelector('#auth-form-pane')
const ns = document.querySelector('#ns')
const nr = document.querySelector('#nr')
const nscl = document.querySelector('#nscl')
const sclResultUpdate = document.querySelector('.fix-res-sub')
const resInfo = document.querySelector('.res-info')
window.addEventListener('DOMContentLoaded', () => {
    leagueIsRunning(); sclIsRunning(); adminBuilder()
    fetch('/scl/running').then((response) => {
        response.json().then((data) => {
            switch (data.code) {
                case 'GS':
                    fixctrl.style.display = 'flex'
                    stageIndicator.textContent = 'Group Stage'
                    stageChanger.textContent = 'End Group Stage'
                    break;
                case 'QF':
                    modify('Quarter finals')
                    stageChanger.textContent = 'End Qarter Finals'
                    break;
                case 'SF':
                    modify('Semi Finals')
                    stageChanger.textContent = 'End Semi Finals'
                    break;
                case 'FIN':                    
                    modify('Final', document.querySelectorAll('.scl-leg-chn-btn'))
                    stageChanger.textContent = 'End Finals'
                    break;
                case 'END':                    
                    modify('POST SEASON', document.querySelectorAll('.scl-leg-chn-btn'))
                    stageChanger.textContent = 'Season Ended!'
            }
        })
    })
})
const leagueIsRunning = () => {
    fetch('/league/running').then((response) => {
        response.json().then((data) => {
            if (data.feedBack === "yes") {
                document.querySelector('.league-st-btn').setAttribute('disabled', true)
            }
            if ( data.feedBack === "ended" ) {
                document.querySelector('.league-st-btn').setAttribute('disabled', true)
                document.querySelector('.league-end-btn').setAttribute('disabled', true)
            }
        })
    })
}
const sclIsRunning = () => {
    fetch('/scl/running').then((response) => {
        response.json().then((data) => {
            if (data.feedBack === 'yes') {
                sclTeamAddBtn.setAttribute('disabled', true)
                sclTeamRemoveBtn.setAttribute('disabled', true)
            }
        })
    })
}
const adminBuilder = () => {
    fetch('/admin/check').then((response) => {
        response.json().then((data) => {
            
        })
    })
}
const modify = (stage, leg) => {
    fixctrl.style.display = 'flex'
    stageIndicator.textContent = stage                    
    stageIndicator.style.width = '100%'
    stageIndicator.style.textAlign = 'center'
for (i=0;i<4;i++) {
    const sclGCB = document.querySelectorAll('.scl-group-chn-btn')
    sclGCB[i].style.display = 'none'
    }
 if (leg) {
     for (i=0;i<2;i++) {
         leg[i].style.display = 'none'
     }
 }
}
btnPane.addEventListener('click', (e) => {
    FB.textContent = ''
    switch (e.target.textContent) {
        case 'Add':
             const team = document.querySelector('#team').value
             if (team === '' ) {
                 FB.style.color = 'blue'
                FB.textContent = 'Please Provide the team name!'
             } else {                
                addTeam(team)
             }
            break;         
        case 'Remove':
            const remTeam = document.querySelector('#team').value
            if (remTeam === '') {
                FB.style.color = 'blue'
                return FB.textContent = 'Please provide team to delete!'
            }
            deleteTeam(remTeam, FB)
    }
   
})
const addTeam = (team) => {
    const url = `/league/team/add?team=${team}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            if  (data.process === 'Success') {
                FB.style.color = "green"
                FB.textContent = data.feedBack
            } else {
                FB.style.color = "Red"
                FB.textContent = data.feedBack
            }

        })
    })
}
const deleteTeam = (team) => {
    const url = `/league/team/remove?team=${team}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            if  (data.process === 'Success') {
                FB.style.color = "green"
                FB.textContent = data.feedBack
            } else {
                FB.style.color = "Red"
                FB.textContent = data.feedBack
            }
        })
    })
}
leageResBtn.addEventListener('click', (e) => {            
            resInfo.textContent = ''
            const ht = document.querySelector('#h').value.toLowerCase().trim()
            const hs = document.querySelector('#h-s').value
            const as = document.querySelector('#a-s').value
            const at = document.querySelector('#a').value.toLowerCase().trim()      
            if (ht === '' || hs === '' || as === '' || at === '') {
                return resInfo.textContent = ('Please provide all result data')
            }
            let leg = document.querySelectorAll('input[name="league-leg"]:checked')
            if (leg.length === 0) return resInfo.textContent = 'Please check a leg!'
            updateResult(ht, hs, as, at, leg[0].value, resInfo)
})
const updateResult = (ht, hs, as, at, leg, resInfo) => {
    const url = `/league/result/add?ht=${ht}&hs=${hs}&as=${as}&at=${at}&leg=${leg}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            resInfo.textContent = (data.feedBack)
        })
    })
}
ns.addEventListener('click', () => {
    const val = confirm('Are you sure you want to modify the league season?')
    if (!val) return 0
    const inc = prompt('Would you like to decrease or increase the league season?', '+ or -')
    if (!inc) return 0 
    nextLevel(`newleague/${inc}`)
})
nscl.addEventListener('click', () => {
    const val = confirm('Are you sure you want to modify the scl season?')
    if (!val) return 0
    const inc = prompt('Would you like to decrease or increase the scl season?', '+ or -')
    if (!inc) return 0 
    nextLevel(`newscl/${inc}`)   
})
nr.addEventListener('click', () => {
    const val = confirm('Are you sure you want to modify the match result day?')
    if (!val) return 0
    const inc = prompt('Would you like to decrease or increase the match day?', '+ or -')
    if (!inc) return 0 
    nextLevel(`newday/${inc}`)
})
const nextLevel = (command) => {
    fetch(`/${command}`).then((response) => {
        response.json().then((data) => {
            if(data.feedBack) return resInfo.textContent = (data.feedBack)
            resInfo.textContent = ('Fail')
        })
    }) 
}
sclTeamAddBtn.addEventListener('click', () => {
    entryFb.textContent = ''
    const team = document.querySelector('.group-action-input').value.toLowerCase().trim()
    if (team === '') return entryFb.textContent = 'Please insert the team to add!'
    entryFb.textContent = ''
    const url = `/scl/groups/team/add?team=${team}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            if (data.feedBack === 'Success') {
                return entryFb.textContent = `Team has been added to group ${data.group}`
            }
            entryFb.textContent = data.feedBack
        })
    })
})
sclTeamRemoveBtn.addEventListener('click', () => {
    const team = document.querySelector('.group-action-input').value.toLowerCase().trim()  
    if (team === '') return entryFb.textContent = 'Please insert the team to remove!'
    entryFb.textContent = ''
    const url = `/scl/groups/team/remove?team=${team}`
    fetch(url).then((response) => {
        response.json().then((data) => {
                entryFb.textContent = data.feedBack
        })
    })
})
sclResultUpdate.addEventListener('click', () => { 
    entryFb.textContent = ''
    const h = document.querySelector('.home-draw').value.toLowerCase().trim()
    const hs = document.querySelector('.home-score').value
    const a = document.querySelector('.away-draw').value.toLowerCase().trim()
    const as = document.querySelector('.away-score').value
    const legs = document.querySelectorAll('input[name="leg"]:checked')
    const leg = legs.length>0? legs[0].value: null
    const gs = document.querySelectorAll('input[name="group"]:checked')
    const g = gs.length>0? gs[0].value: null
    if (g && leg) url = `/scl/result/add?h=${h}&hs=${hs}&a=${a}&as=${as}&leg=${leg}&g=${g}`
    else if (leg) url = `/scl/result/add?&h=${h}&hs=${hs}&a=${a}&as=${as}&leg=${leg}`
    else url = `/scl/result/add?h=${h}&hs=${hs}&a=${a}&as=${as}&leg=firstLeg`
    if (h === '' || hs === '' || a === '' || as === '') return entryFb.textContent = "Please provide all data"
    sclFixtureUpdate(url)
})
const sclFixtureUpdate = (url) => {
    fetch(url).then((response) => {
        response.json().then((data) => {
            entryFb.textContent = data.feedBack
        })
    })
}
stageChanger.addEventListener('click', (e) => {
    switch (e.target.textContent) {
        case 'Start Scl':
            sclProgress('/scl/start/GS')
            break;
        case 'End Group Stage':
            const GsEndConsent = confirm('Group Stage is running, do you wish to end however?')
            if ( !GsEndConsent ) return 0 
            modify('Quarter finals')
            e.target.textContent = 'End Qarter Finals'
            sclProgress('/scl/start/QF')
            break;
        case 'End Qarter Finals':
            const QfEndConsent = confirm('Quarter Finals is running, do you wish to end however?')
            if (!QfEndConsent) return 0
            modify('Semi finals')
            e.target.textContent = 'End Semi Finals'
            sclProgress('/scl/start/SF')
            break;
        case 'End Semi Finals':
            const SfEndConsent = confirm('Semi Finals is running, do you wish to end however?')
            if (!SfEndConsent) return 0
            modify('finals', document.querySelectorAll('.scl-leg-chn-btn'))
            e.target.textContent = 'End Finals'
            sclProgress('/scl/start/FIN')
            break;
        case 'End Finals':
            const FinEndConsent = confirm('Final is running, if you wish to end however, check that yoou have recorded the result!')
            if (!FinEndConsent) return 0
            modify('POST SEASON', document.querySelectorAll('.scl-leg-chn-btn'))
            e.target.textContent = 'Season Ended!'
            sclProgress('/scl/end')
    }
})
const sclProgress = (url) => {
    fetch(url).then((response) => {
        response.json().then((data) => {
            if (data.feedBack === 'teams have not been submitted!') {
                stageChanger.textContent = 'Start Scl'
            } else if (data.feedBack === 'Fixtures created; Scl Started!') {
                stageChanger.textContent = 'End Group Stage'
                document.querySelector('.scl-fixture-controls').style.display = 'flex'
                document.querySelector('.scl-stage-ind').textContent = 'Group Stage'
            }
            entryFb.textContent = data.feedBack
        })
    })
}
let openOrCloseForm = (command) => {
    if (command === 'open') {
        adminBoard.style.display = 'block'
        authFrame.style.display = 'none'
        document.querySelector('footer').style.display = 'block'
    } else if (command === 'openAuthPane') {
        authPane.style.display = 'block'
        document.querySelector('#auth-input').value = ''
    }
} 
upBtn.addEventListener('click', (e) => {
    upBtn.style.display = 'none'
    openOrCloseForm('openAuthPane')
})
authForm.addEventListener('submit', (e) => {
    e.preventDefault()
    authPane.style.display = 'none'
    const authInput = document.querySelector('#auth-input').value
    const url = `/admin/auth?pass=${authInput}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            switch (data.feedBack) {
                case 'success':
                    if (data.admin === 'possible') {
                        document.querySelector('.admin-pane').style.display = 'block'
                    }
                    document.querySelector('.admin-presence').textContent = data.admin.toUpperCase()
                    openOrCloseForm('open')
                    break;
                case 'fail':
                    alert('You are not authenticated')
                    upBtn.style.display = 'block'
            }
        })
    })
})

const adminPaneBtn = document.querySelector('.admin-pane-btn-row')
adminPaneBtn.addEventListener('click', (e) => {
    const name = (document.querySelector('.admin-name').value).toLowerCase().trim()
    const pass = (document.querySelector('.admin-pass').value).toLowerCase().trim()
    switch (e.target.textContent) {
        case 'create':
            if (name === '' || pass === '') {
                return adminInfo.textContent = 'please provide the name and pass!'
            }
            adminFunc('/admin/add', name, pass)
            break;
        case 'update':
            if (name === '' || pass === '') {
                return adminInfo.textContent = 'please provide the name and pass!'
            }
            adminFunc('/admin/update', name, pass)
            break;
        case 'delete':
            if (name === '') {
                return adminInfo.textContent = 'please provide the admin name to delete!'
            }
            adminFunc('/admin/remove', name)
    }
})
const adminFunc = (command, name, pass) => {
    const url = `${command}?name=${name}&pass=${pass}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            adminInfo.textContent = data.feedBack
        })
    })
}
const leagueStBtn = document.querySelector('.league-st-btn')
leagueStBtn.addEventListener('click', () => {
    const endConsent = confirm('Are you sure you want to start league? if sure, Ensure that you have added all teams before starting!')
    if (!endConsent) return 0
    fetch('/league/start').then((response) => {
        response.json().then((data) => {
            if (data.feedBack === 'yes') {
                FB.textContent = "League Started!"
                leagueStBtn.setAttribute('disabled', true)
            } else {
                FB.textContent = data.feedBack
            }
        })
    })
})
const leagueEndBtn = document.querySelector('.league-end-btn')
leagueEndBtn.addEventListener('click', () => {
    const endConsent = confirm('Are you sure you want to end league? if sure, Ensure that you have updated all results before ending!')
    if (!endConsent) return 0
    leagueEndBtn.setAttribute('disabled', true)
    fetch('/league/end').then((response) => {
        response.json().then((data) => {
            FB.textContent = data.feedBack
        })
    })
})