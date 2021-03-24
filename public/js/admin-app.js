// import { fix } from './fa-draw.js'
// Variable Declaration scl-stage-ind
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
const authForm = document.querySelector('#auth-form-pane')
const ns = document.querySelector('#ns')
const nr = document.querySelector('#nr')
const nscl = document.querySelector('#nscl')
const sclResultUpdate = document.querySelector('.fix-res-sub')
const resInfo = document.querySelector('.res-info')
const correctPaneInfo = document.querySelector('.correct-pane-info')
window.addEventListener('DOMContentLoaded', () => {
    fetch('/fix/fixture').then((response) => {
        response.json().then((data) => {
            entryFb.textContent = data.feedBack
        })
    })
    leagueIsRunning(); sclIsRunning(); loadCurrentLeagueTeams();
    fetch('/scl/running').then((response) => {
        response.json().then((data) => {
            switch (data.code) {
                case 'GS':
                    fixctrl.style.display = 'flex'
                    stageIndicator.textContent = 'Group Stage'
                    stageChanger.textContent = 'End Group Stage'
                    addGroupEventListener()
                    break;
                case 'QF':
                    modify('Quarter Finals')
                    loadCurrentKOTeams(data.code)
                    stageChanger.textContent = 'End Qarter Finals'
                    break;
                case 'SF':
                    modify('Semi Finals')
                    loadCurrentKOTeams(data.code)
                    stageChanger.textContent = 'End Semi Finals'
                    break;
                case 'FIN':                    
                    modify('Final', document.querySelectorAll('.scl-leg-chn-btn'))
                    loadCurrentKOTeams(data.code)
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
const addGroupEventListener = () => {
    const groupBtns =  document.querySelectorAll('input[name="group"]')
    for (let i = 0; i < groupBtns.length; i++) {
        groupBtns[i].addEventListener('click', (e) => {
            clearSelectOption(document.querySelector('.home-draw'), document.querySelector('.away-draw'))
            loadCurrentGroupTeams(e.target.value)
        })
    }
}
const loadCurrentLeagueTeams = () => {
    fetch('/current/league/teams').then((response) => {
        response.json().then((data) => {
            for (let i = 0; i<data.length; i++) {
                const homeTeam = document.createElement('option'), awayTeam = document.createElement('option')                
                homeTeam.textContent = data[i]; awayTeam.textContent = data[i]
                document.querySelector('#h').append(homeTeam); document.querySelector('#a').append(awayTeam)                
            }
        })
    })    
}
const loadCurrentGroupTeams = (group) => {
    const url = `/current/scl/group/teams?group=${group}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            for (let i = 0; i<data.length; i++) {
                const homeTeam = document.createElement('option'), awayTeam = document.createElement('option')
                homeTeam.textContent = data[i]; awayTeam.textContent = data[i]
                document.querySelector('.home-draw').append(homeTeam); document.querySelector('.away-draw').append(awayTeam)
            }
        })
    })
}
const loadCurrentKOTeams = (stage) => {
    const url = `/current/scl/ko/teams?stage=${stage}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            const len = data.home.length
            for (let i = 0; i < len; i++) {
                const homeTeam = document.createElement('option'), awayTeam = document.createElement('option')
                homeTeam.textContent = data.home[i]; awayTeam.textContent = data.away[i]
                document.querySelector('.home-draw').append(homeTeam); document.querySelector('.away-draw').append(awayTeam)
            }
        })
    })
}
const selectNum = () => {
    for (let i = 0; i <=30; i++ ) {
        const homeScore = document.createElement('option'), awayScore = document.createElement('option')
        const sclHomeScore = document.createElement('option'), sclAwayScore = document.createElement('option')
        homeScore.textContent = i; awayScore.textContent = i
        sclHomeScore.textContent = i; sclAwayScore.textContent = i
        document.querySelector('#h-s').append(homeScore); document.querySelector('#a-s').append(awayScore)
        document.querySelector('.home-score').append(sclHomeScore); document.querySelector('.away-score').append(sclAwayScore)
    }
}; selectNum() 

const clearSelectOption = (homeOpt, awayOpt) => {
    const len = homeOpt.children.length
    let i = len
    if (len === 1) return 0
    do {
        homeOpt.removeChild(homeOpt.children[i - 1])
        awayOpt.removeChild(awayOpt.children[i - 1])
        i--
    } while ( i > 1)
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
            const ht = document.querySelector('#h').value
            const hs = document.querySelector('#h-s').value
            const as = document.querySelector('#a-s').value
            const at = document.querySelector('#a').value
            if (ht === at) {
                return resInfo.textContent = ('You can not record duplicate teams!')
            }
            if (hs === '' || as === '') {
                return resInfo.textContent = ('Please select the scores to record!')
            }            
            let leagueLeg = document.querySelector('input[name="league-leg"]')
            let leg = leagueLeg.checked? 'secondLeg' : 'firstLeg'
            updateResult(ht, hs, as, at, leg, resInfo)
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
            if ( command.includes('newscl')) entryFb.textContent = data.feedBack
                else resInfo.textContent = (data.feedBack)
            
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
    else {
        if (stageIndicator.textContent === 'Group Stage' || stageIndicator.textContent === 'Quarter Finals' || stageIndicator.textContent === 'Semi Finals') {
            return entryFb.textContent = "Please select the Leg to record!"
        } 
        url = `/scl/result/add?h=${h}&hs=${hs}&a=${a}&as=${as}&leg=firstLeg`
    }
    if (h === a) return entryFb.textContent = "You can not record duplicate teams!"
    if (hs === '' || as === '') return entryFb.textContent = "Please select the scores to record!"
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
            clearSelectOption(document.querySelector('.home-draw'), document.querySelector('.away-draw'));
            break;
        case 'End Group Stage':
            const GsEndConsent = confirm('Group Stage is running, do you wish to end however?')
            if ( !GsEndConsent ) return 0 
            modify('Quarter Finals')
            e.target.textContent = 'End Qarter Finals'
            sclProgress('/scl/start/QF')
            clearSelectOption(document.querySelector('.home-draw'), document.querySelector('.away-draw'));
            break;
        case 'End Qarter Finals':
            const QfEndConsent = confirm('Quarter Finals is running, do you wish to end however?')
            if (!QfEndConsent) return 0
            modify('Semi Finals')
            e.target.textContent = 'End Semi Finals'
            sclProgress('/scl/start/SF')
            clearSelectOption(document.querySelector('.home-draw'), document.querySelector('.away-draw'));
            break;
        case 'End Semi Finals':
            const SfEndConsent = confirm('Semi Finals is running, do you wish to end however?')
            if (!SfEndConsent) return 0
            modify('Final', document.querySelectorAll('.scl-leg-chn-btn'))
            e.target.textContent = 'End Finals'
            sclProgress('/scl/start/FIN')
            clearSelectOption(document.querySelector('.home-draw'), document.querySelector('.away-draw'));
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
            } else if (data.feedBack.includes('Quarter Finals')) loadCurrentKOTeams('QF')
                else if (data.feedBack.includes('Semi Finals')) loadCurrentKOTeams('SF')
                    else if (data.feedBack.includes('Final')) loadCurrentKOTeams('FIN')
            entryFb.textContent = data.feedBack
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
                clearSelectOption(document.querySelector('#h'), document.querySelector('#a'));
                loadCurrentLeagueTeams()
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
const leagueLegNob = document.querySelector('.league-leg-nob')
const leagueLeg = document.querySelector('.league-leg')
leagueLegNob.addEventListener('click', () => {
    if(!leagueLeg.checked) {        
        leagueLegNob.style.transform = 'translateX(30px)';
        leagueLeg.checked = true
    } else {
        leagueLegNob.style.transform = 'translateX(0)';
        leagueLeg.checked = false
    }
})
const deductBtn = document.querySelector('.deduct-btn')
deductBtn.addEventListener('click', () => {
    correctPaneInfo.textContent = ''
    const deductTeam = document.querySelector('#deduct-team').value.toLowerCase()
    const deductPoint = document.querySelector('#deduct-point').value
    if ( deductTeam === '' || deductPoint === '') return correctPaneInfo.textContent = 'Please provide the team and the point to deduct!'
    const url = `/league/deduct?team=${deductTeam}&val=${deductPoint}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            correctPaneInfo.textContent = data.feedBack
        })
    })
})
const deleteBtn = document.querySelector('.delete-btn')
deleteBtn.addEventListener('click', () => {
    correctPaneInfo.textContent = ''
    const slotId = document.querySelector('#slot-id').value
    const day = document.querySelector('#match-day').value
    if ( slotId === '' || day === '') return correctPaneInfo.textContent = 'Please provide the position number and the match day!'
    const url = `/league/result/delete?slotId=${slotId}&day=${day}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            correctPaneInfo.textContent = data.feedBack
        })
    })
})
const correctBtn = document.querySelector('.correct-btn')
correctBtn.addEventListener('click', () => {
    correctPaneInfo.textContent = ''
    const slotId = document.querySelector('#slot-id').value
    const day = document.querySelector('#match-day').value
    const hs = document.querySelector('#hs').value
    const as = document.querySelector('#as').value
    if ( slotId === '' || day === '' || hs === '' || as === '') 
    return correctPaneInfo.textContent = 'Please provide the position number and the match day!'
    const url = `/league/result/correct?slotId=${slotId}&day=${day}&hs=${hs}&as=${as}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            correctPaneInfo.textContent = data.feedBack
        })
    })
})
const logOut = () => {
    const token = document.querySelector('#token').textContent
    fetch(`/admin/logout`).then((response) => {
        response.json().then((data) => {
            if (data) return window.location.replace('/admin/login')
            console.log(data)
        })
    })
}
document.querySelector('#log-out-btn').addEventListener('click', logOut)
const getCookie = (cname) => {
    var name = `${cname}=`
    const ca = document.cookie.split(';')
    for (i=0;i<ca.length;i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        } 
        if (c.indexOf(name) == 0) {
            return (c.substring(name.length, c.length))
        }
    }
    return ''
}
document.querySelector('.admin-presence').textContent = getCookie('username');