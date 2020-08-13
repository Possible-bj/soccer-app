const stageChanger = document.querySelector('.stage-chn-btn')
const fixctrl = document.querySelector('.scl-fixture-controls')
const stageIndicator = document.querySelector('.scl-stage-ind')
const entryFb = document.querySelector('#entry-fb')
window.addEventListener('DOMContentLoaded', () => {
    fetch('/request?command=sclprogress').then((response) => {
        response.json().then((data) => {
            switch (data.feedBack) {
                case 'group stage':
                    fixctrl.style.display = 'flex'
                    stageIndicator.textContent = 'Group Stage'
                    stageChanger.textContent = 'End Group Stage'
                    break;
                case 'quarter finals':
                    modify('Quarter finals')
                    stageChanger.textContent = 'End Qarter Finals'
                    break;
                case 'semi finals':
                    modify('Semi Finals')
                    stageChanger.textContent = 'End Semi Finals'
                    break;
                case 'final':
                    const legs = document.querySelectorAll('.scl-leg-chn-btn')
                    modify('Final', legs)
                    stageChanger.textContent = 'End Finals'
            }
        })
    })
})
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
const FB = document.querySelector('#FB')
const btnPane = document.querySelector('#btn-pane')
const upBtn = document.querySelector('#update-btn')
const authFrame = document.querySelector('.auth-pane')
const adminBoard = document.querySelector('.body-content')
const resForm = document.querySelector('#res-form')
const authPane = document.querySelector('.auth-box')
const authForm = document.querySelector('#auth-form-pane')
const ns = document.querySelector('#ns')
const nr = document.querySelector('#nr')
const nscl = document.querySelector('#nscl')
const sclResultUpdate = document.querySelector('.fix-res-sub')


btnPane.addEventListener('click', (e) => {
    FB.textContent = ''
    switch (e.target.textContent) {
        case 'Create':
             const team = document.querySelector('#team').value.toLowerCase()
            //  const sN = document.querySelector('#sn').value
             if (team === '' ) {
                 FB.style.color = 'blue'
                FB.textContent = 'Please Provide the team name and the season number'
            //     FB.scrollIntoView()
             } else {                
                updateTeam('add', team, 0, 0, 0, 0, 0, 0, 0, 0, FB)
             }
            break;
        case 'Update':
                const addTeam = document.querySelector('#team').value.toLowerCase()
                const P = document.querySelector('#P').value
                const W = document.querySelector('#W').value
                const D = document.querySelector('#D').value
                const L = document.querySelector('#L').value
                const GF = document.querySelector('#GF').value
                const GA = document.querySelector('#GA').value
                const GD = document.querySelector('#GD').value
                const Pts = document.querySelector('#Pts').value
                // const sn = document.querySelector('#sn').value
                if (addTeam === '' || P === '' || W === '' || D === '' || L === '' || GF === '' || GA === '' || GD === '' || Pts  === '') {
                    FB.style.color = 'blue'
                    return FB.textContent = 'Please provide all updates and season number!'
                }
                updateTeam('edit', addTeam, P, W, D, L, GF, GA, GD, Pts, FB)
                break;            
        case 'Delete':
            const remTeam = document.querySelector('#team').value.toLowerCase()
            // const Sn = document.querySelector('#sn').value
            if (remTeam === '') {
                FB.style.color = 'blue'
                return FB.textContent = 'Please provide team to delete and season number!'
            }
            deleteTeam('remove', remTeam, FB)
    }
   
})
//P = 0, W = 0, D = 0, L = 0, GF = 0, GA = 0, GD = 0, Pts = 0,
const updateTeam = (command, team, P, W, D, L, GF, GA, GD, Pts, FB) => {
    const url = `/leagueaction?command=${command}&team=${team}&P=${P}&W=${W}&D=${D}&L=${L}&GF=${GF}&GA=${GA}&GD=${GD}&Pts=${Pts}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            if  (data.process === 'Success') {
                FB.style.color = "green"
                FB.textContent = data.feedBack
            } else {
                FB.style.color = "Red"
                FB.textContent = data.feedBack
                FB.scrollIntoView()
            }

        })
    })

}

const deleteTeam = (command, team, FB) => {
    const url = `/leagueaction?command=${command}&team=${team}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            if  (data.process === 'Success') {
                FB.style.color = "green"
                FB.textContent = data.feedBack
            } else {
                FB.style.color = "Red"
                FB.textContent = data.feedBack
                FB.scrollIntoView()
            }
        })
    })
}

resForm.addEventListener('submit', (e) => {
    e.preventDefault()
            const ht = document.querySelector('#h').value.toLowerCase()
            const hs = document.querySelector('#h-s').value
            const as = document.querySelector('#a-s').value
            const at = document.querySelector('#a').value.toLowerCase()
            if (ht === '' || hs === '' || as === '' || at === '') {
                return alert('Please provide all result data')
            }
        updateResult('result', ht, hs, as, at)
})
const updateResult = (command, ht, hs, as, at) => {
    const url = `/leagueaction?command=${command}&ht=${ht}&hs=${hs}&as=${as}&at=${at}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            alert(data.feedBack)
        })
    })
}
ns.addEventListener('click', () => {
    const val = confirm('Are you sure you want to proceed to a new season?')
    if (!val) return 0
    nextLevel('nextLeagueSeason')
})
nscl.addEventListener('click', () => {
    const val = confirm('Are you sure you want to proceed to a new season?')
    if (!val) return 0
    nextLevel('nextSclSeason')   
})
nr.addEventListener('click', () => {
    const val = confirm('Are you sure you want to create a new match result?')
    if (!val) return 0
    nextLevel('nextLeagueDay')
})
const nextLevel = (command) => {
    fetch(`/leagueaction?command=${command}`).then((response) => {
        response.json().then((data) => {
            if(data.length !== 0) return alert('Success')
            alert('Fail')
        })
    }) 
}
const sclGroupAddForm = document.querySelector('.group-action-form')
sclGroupAddForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const team = document.querySelector('.group-action-input').value.toLowerCase()    
    if (team === '') return entryFb.textContent = 'Please insert a team'
    entryFb.textContent = ''
    const url = `/sclaction?command=selectGroup&team=${team}`
    fetch(url).then((response) => {
        response.json().then((data) => {
                entryFb.textContent = data.feedBack
        })
    })
})
sclResultUpdate.addEventListener('click', () => {
    
    const h = document.querySelector('.home-draw').value.toLowerCase()
    const hs = document.querySelector('.home-score').value
    const a = document.querySelector('.away-draw').value.toLowerCase()
    const as = document.querySelector('.away-score').value
    const legs = document.querySelectorAll('input[name="leg"]:checked')
    const leg = legs.length>0? legs[0].value: null
    const gs = document.querySelectorAll('input[name="group"]:checked')
    const g = gs.length>0? gs[0].value: null
    if (g && leg) url = `/sclaction?command=updateSclResult&h=${h}&hs=${hs}&a=${a}&as=${as}&leg=${leg}&g=${g}`
    else if (leg) url = `/sclaction?command=updateSclResult&h=${h}&hs=${hs}&a=${a}&as=${as}&leg=${leg}`
    else url = `/sclaction?command=updateSclResult&h=${h}&hs=${hs}&a=${a}&as=${as}&leg=firstLeg`
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
            sclProgress('startScl')
            break;
        case 'End Group Stage':
            modify('Quarter finals')
            e.target.textContent = 'End Qarter Finals'
            sclProgress('endGS')
            break;
        case 'End Qarter Finals':
            modify('Semi finals')
            e.target.textContent = 'End Semi Finals'
            sclProgress('endQF')
            break;
        case 'End Semi Finals':
            modify('finals', document.querySelectorAll('.scl-leg-chn-btn'))
            e.target.textContent = 'End Finals'
            sclProgress('endSF')
            break;
        case 'End Finals':
            modify('Season Ended', document.querySelectorAll('.scl-leg-chn-btn'))
            e.target.textContent = 'Season Ended'
            sclProgress('endSeason')
    }
})
const sclProgress = (command) => {
    fetch(`/sclaction?command=${command}`).then((response) => {
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
    const url = `/auth?command=auth&lockpass=${authInput}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            switch (data.feedBack) {
                case 'success':
                    if (data.admin === 'possible') {
                        document.querySelector('.admin-pane').style.display = 'block'
                    }
                    alert(`You are welcome ${data.admin}`)
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
    // e.preventDefault()
    const name = (document.querySelector('.admin-name').value).toLowerCase()
    const pass = (document.querySelector('.admin-pass').value).toLowerCase()
    switch (e.target.textContent) {
        case 'create':
            if (name === '' || pass === '') {
                return entryFb.textContent = 'please provide the name and pass!'
            }
            adminFunc('create', name, pass)
            break;
        case 'update':
            if (name === '' || pass === '') {
                return entryFb.textContent = 'please provide the name and pass!'
            }
            adminFunc('edit', name, pass)
            break;
        case 'delete':
            if (name === '') {
                return entryFb.textContent = 'please provide the admin name to delete!'
            }
            adminFunc('delete', name, pass)
    }
})
const adminFunc = (command, name, pass) => {
    const url = `/auth?command=${command}&name=${name}&pass=${pass}`
    fetch(url).then((response) => {
        response.json().then((data) => {
            entryFb.textContent = data.feedBack
        })
    })
}