// const fix = () => {
const chalk = require('chalk')
const { cookie } = require('express/lib/response')
const fs = require('fs')
const readline = require('readline')
const teams = [
  'elgin',
  'branco',
  'techie NiG',
  'United Kingdom',
  'captain',
  'Bodmas official',
  'made em',
  'wolf',
  'King-Possible',
  'King-Wizzy',
  '30BG',
  'Airegin',
]

// Schedule Single round 'j' for 'n' teams:
const round = (n, j) => {
  const m = n - 1
  let round = Array.from({ length: n }, (_, i) => (m + j - i) % m) // circular shift
  // console.log('round', round)
  round[(round[m] = (j * (n >> 1)) % m)] = m //swapping self match
  return round
}

// Schedule matches of 'n' teams :
const fixture = (n) => {
  let rounds = Array.from({ length: n - 1 }, (_, j) => round(n, j))
  // console.log('rounds', rounds)
  return Array.from({ length: n }, (_, i) => ({
    team: teams[i],
    matches: rounds.map((round) => teams[round[i]]),
  }))
}
// fixture(7)
const table = fixture(teams.length).map((team) => ({
  team: team.team,
  match: {
    day1: `${team.matches[0]} AND ${team.matches[1]} AND ${team.matches[10]}`,
    day2: `${team.matches[2]} AND ${team.matches[3]}`,
    day3: `${team.matches[4]} AND ${team.matches[5]}`,
    day4: `${team.matches[6]} AND ${team.matches[7]}`,
    day5: `${team.matches[8]} AND ${team.matches[9]}`,
  },
}))
// console.log(table)
// console.log(
//   'array',
//   Array.from({ length: 7 }, (_, i) => i + 1)
// )
//   const fixture = []
//   while (teams.length > 0) {
//     let index = Math.floor(Math.random() * teams.length) + 1
//     index = index >= teams.length ? teams.length - 1 : index
//     const existingFixture = previousFixtures.find((item) => (item === (`${teams[0]} Vs ${teams[index]}`)))

//     fixture.push(`${teams[0]} Vs ${teams[index]}`)
//     teams.splice(index, 1)
//     teams.splice(0, 1)
//   }
//   console.log(fixture)
// }
// fix()
// const one = ['item']
// const two = 'itemOne Vs itemTwo'
// console.log(one.concat(two))

// const matches = []
// const fixtures = {}
// let day = 1

// for (perm of G.combination(teams, 2)) {
//   matches.push(`${perm[0]} Vs ${perm[1]}`)
// }
// // console.log(matches.length)
// const fixtureOfFive = () => {
//   const fiveFixtures = []
//   for (i = 0; i < 5; i++) {
//     const index = Math.floor(Math.random() * matches.length)
//     fiveFixtures.push(matches[index])
//     // console.log(fiveFixtures)
//     matches.splice(index, 1)
//   }
//   return fiveFixtures
// }

// const makeFixtures = () => {
//   const fixture = []
//   while (fixture.length < 2) {
//     fixture.push(fixtureOfFive())
//     console.log(fixture)
//   }
//   return fixture
// }

// while (matches.length !== 0) {
//   console.log(matches.length)
//   const fix = makeFixtures()
//   fixtures[`day${day}`] = fix
//   day++
// }

// console.log(fixtures)

// print(fixtures)
// console.log(G.combination)

;('use strict')

// const fs = require('fs');

process.stdin.resume()
process.stdin.setEncoding('utf-8')

let inputString = ''
let currentLine = 0

process.stdin.on('data', function (inputStdin) {
  inputString += inputStdin
})

process.stdin.on('end', function () {
  inputString = inputString.split('\n')

  main()
})

function readLine() {
  return inputString[currentLine++]
}

/*
 * Complete the 'saveThePrisoner' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts following parameters:
 *  1. INTEGER n
 *  2. INTEGER m
 *  3. INTEGER s
 */

function saveThePrisoner(n, m, s) {
  // Write your code here
  let next = s
  for (let candyTracker = 1; candyTracker <= m; ) {
    if (candyTracker === m) return next
    candyTracker++

    if (next === n) next = 1
    else next++
  }
}
const fix = (arr, cb) => {
  const sortOrder = [0, 1, -1]
  const order = sortOrder[Math.floor(Math.random() * sortOrder.length)]
  const tm = arr.sort(deepSort(order)),
    fixtures = []
  while (tm.length > 0) {
    let num = Math.floor(Math.random() * tm.length)
    if (num === 0) num++
    const firstTeam = tm[0],
      secondTeam = tm[num]
    const draw = [`${firstTeam} and ${secondTeam}`]
    fixtures.push(draw)
    tm.splice(num, 1)
    tm.shift()
  }
  cb(fixtures)
}

const deepSort = (sortOrder) => {
  return function (a, b) {
    if (a < b) return -1 * sortOrder
    else if (a > b) return 1 * sortOrder
    return 0 * sortOrder
  }
}

async function main() {
  const teamArr = []
  // const ws = fs.createWriteStream('./saveThePrisoner.txt')
  const readLineInterface = readline.createInterface({
    input: fs.createReadStream('./playground/teamList.txt'),
    crlfDelay: Infinity,
  })

  for await (let line of readLineInterface) {
    // if (currentLine === 0) {
    //   continue
    // }
    // console.log(line)
    teamArr.push(line)
    // currentLine++
  }

  const rm = teamArr.length % 2
  if (rm) {
    const reservedMem = teamArr.splice(0, rm)
    fix(teamArr, (matches) => {
      console.log('Matched Team Members', matches)
      console.log('Remaining Team Member', reservedMem)
    })
    process.exit(1)
  }
  fix(teamArr, (matches) => {
    console.log('Matched Team Members', matches)
    // console.log('Remaining Team Member', reservedMem)
  })
  process.exit(1)
}
main()

// Oluwaseun Omojola
// Oluwaseun Omojola says:Email:
// Training@bincom.net

// Oluwaseun Omojola says:Password: Humanknowledge1!
const cookies = (k, A) => {
  const dynamicSort = () => {
    return (a, b) => {
      if (a < b) return -1
      else if (a > b) return 1
      else return 0
    }
  }
  let opRnd = -1
  const isSweetnessGreaterOrEqualToK = (k, A) => {
    const kIsGreater = A.find((a) => a < k)
    if (kIsGreater) {
      if (opRnd === -1) opRnd = 0
      return false
    }
    return true
  }
  while (!isSweetnessGreaterOrEqualToK(k, A)) {
    const [least, secondLeast] = A.sort(dynamicSort()).splice(0, 2)
    const mixedSweetness = 1 * least + 2 * secondLeast
    A.push(mixedSweetness)
    opRnd++
  }
  return opRnd
}

// This is a demo task.

// Write a function:

// function solution(A);

// that, given an array A of N integers, returns the smallest positive integer (greater than 0) that does not occur in A.

// For example, given A = [1, 3, 6, 4, 1, 2], the function should return 5.

// Given A = [1, 2, 3], the function should return 4.

// Given A = [−1, −3], the function should return 1.

// Write an efficient algorithm for the following assumptions:

// N is an integer within the range [1..100,000];
// each element of array A is an integer within the range [−1,000,000..1,000,000].
// [1, 3, 6, 4, 1, 2]
// [4, 6, 7, 8, 10, 11]
// [1, 2, 7, 5, 9, 14]
// [-1, -3, 60, 41, 1, 12]
// [1, 2, 3, 4, 5, 6, 7, 8, 15]
