const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')
const housingPlanService = require('../../src/service/housingPlanService')
const { HOUSING, BATHROOM, EIGHTEEN_YEARS_IN_DAYS, TWENTY_ONE_YEARS_IN_DAYS, TWO_YEARS_IN_DAYS } = require('../../src/utils')

const BUILDINGS_AND_ROOMS = {}
const PEOPLE = []
const RULES = []

beforeAll(() => {  
;(() => {
    // load rooms
    const roomsFileContent = fs.readFileSync(path.resolve(__dirname, '..\\__resources\\rooms.csv'))
    const roomsEntries = parse(roomsFileContent, {columns: true})
    roomsEntries.forEach(room => {
        room.bedCount = Number(room.bedCount)
        room.cotSpace = Number(room.cotSpace)
        if (BUILDINGS_AND_ROOMS[room.sectionName]) {
            BUILDINGS_AND_ROOMS[room.sectionName].totalBeds += room.bedCount
            BUILDINGS_AND_ROOMS[room.sectionName].maxBeds += (room.bedCount + room.cotSpace)
            BUILDINGS_AND_ROOMS[room.sectionName].rooms.push({
                name: room.roomName,
                bedCount: room.bedCount,
                cotSpace: room.cotSpace
            })
        } else {
            BUILDINGS_AND_ROOMS[room.sectionName] = {
                totalBeds: room.bedCount,
                maxBeds: room.bedCount + room.cotSpace,
                rooms: [{
                    name: room.roomName,
                    bedCount: room.bedCount,
                    cotSpace: room.cotSpace
                }]
            }
        }
    })
})();

;(() => {
    // load people
    const peopleFileContent = fs.readFileSync(path.resolve(__dirname, '../__resources/people.csv'))
    const peopleEntries = parse(peopleFileContent, {columns: true})
    const NOW = Date.now()
    peopleEntries.forEach(person => {
        person.birthDate = new Date(person.birthDate)
        person.ageInDays = Math.ceil((NOW - person.birthDate.getTime()) / (1000 * 3600 * 24))
        person.isOver18 = person.ageInDays >= EIGHTEEN_YEARS_IN_DAYS
        person.isOver21 = person.ageInDays >= TWENTY_ONE_YEARS_IN_DAYS
        PEOPLE.push(person)
    })
})();

;(() => {
    // load rules
    // rules are functions like this:
    // const rule = (person, otherPerson) => {
    //      return true || false
    // }
    RULES.push(
        {
            name: 'male and female cannot share anything',
            isSlidingRule: false,
            appliesTo: [HOUSING, BATHROOM],
            rule: function (personA, personB) {
                return personA.gender === personB.gender
            }
        },
        {
            name: 'over 18/under 18 cannot share anything',
            isSlidingRule: false,
            appliesTo: [HOUSING, BATHROOM],
            rule: function (personA, personB) {
                return personA.isOver18 ? personB.isOver18 : !personB.isOver18
            }
        },
        {
            name: 'under 18 can only share housing with < 2 years in days age difference',
            isSlidingRule: true,
            appliesTo: [HOUSING],
            rule: function (personA, personB) {
                if (personA.isOver18 || personB.isOver18) {
                    return true
                } else {
                    return Number(Math.abs(personA.ageInDays - personB.ageInDays)) < TWO_YEARS_IN_DAYS
                }
            }
        }
    )
})();
})

describe('housing plan', () => {
    let plan

    beforeAll(() => {
        plan = housingPlanService.createHousingPlan({
            people: PEOPLE,
            buildingsAndRooms: BUILDINGS_AND_ROOMS,
            rules: RULES
        })
    })

    test('groups do not exceed assigned room beds', () => {
        for (roomName in plan) {
            let roomDetails = plan[roomName]
            expect(roomDetails.occupants.length).toBeLessThanOrEqual(roomDetails.maxBeds)
        }
    })

    test('groups do not violate rules', () => {
        for (roomName in plan) {
            let { occupants } = plan[roomName]
            leftOccupant: for (let i = 0 ; i < occupants.length - 1 ; i++) {
                let leftOccupantDetails = occupants[i]
                rightOccupant: for (let j = i+1 ; j < occupants.length ; j++) {
                    let rightOccupantDetails = occupants[j]
                    expect(housingPlanService.canShareRoom(leftOccupantDetails, rightOccupantDetails, { rules: RULES })).toBeTruthy()
                }
            }
        }
    })
})