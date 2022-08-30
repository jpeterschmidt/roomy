const { HOUSING, BATHROOM } = require('../utils')

const canShareRoom = (personA, personB, { rules }) => {
    let ruleIndex = 0
    let canShare = true
    do {
        let { rule, appliesTo, name } = rules[ruleIndex]
        if (appliesTo.includes(BATHROOM)) {
            canShare = rule(personA, personB)
            if (!canShare) {
                console.debug(`${personA.name} and ${personB.name} can't share a bathroom because: ${name}`)
            }
        }
        ruleIndex++
    } while (ruleIndex < rules.length && canShare)
    if (canShare) console.debug(`${personA.name} and ${personB.name} are allowed to share a room!`)
    return canShare
}

const createBaseGroups = ({ people, rules }) => {
    let baseGroups = []
    people.forEach((person, index) => {
        if (index === 0) {
            baseGroups.push([person])
        } else {
            let groupIndex = 0
            let personNotGrouped = true
            do {
                if (canShareRoom(person, baseGroups[groupIndex][0], { rules })) {
                    baseGroups[groupIndex].push(person)
                    personNotGrouped = false
                }
                groupIndex++
            } while (groupIndex < baseGroups.length && personNotGrouped)
            if (personNotGrouped) {
                baseGroups.push([person])
            }
        }
    })
    return baseGroups
}

function createHousingPlan({ people, buildingsAndRooms, rules }) {
    const housingPlan = {}
    const baseGroups = createBaseGroups({ people, rules })
    const buildings = Object.entries(buildingsAndRooms)
    buildings.sort((buildingA, buildingB) => buildingA[1].totalBeds - buildingB[1].totalBeds)
    baseGroups.sort((groupA, groupB) => groupA.length - groupB.length)

    let bigGroups = []

    function findGroupABuildingThatFits(group) {
        let groupSize = group.length
        let smallestBuildingThatFitsIndex = buildings.findIndex(([buildingName, building]) => {
            return building.totalBeds >= groupSize
        })
        if (smallestBuildingThatFitsIndex > -1) {
            let smallestBuildingThatFits = buildings[smallestBuildingThatFitsIndex]
            buildings.splice(smallestBuildingThatFitsIndex, 1)
            housingPlan[smallestBuildingThatFits[0]] = {
                ...smallestBuildingThatFits[1],
                occupants: group,
                emptyBeds: smallestBuildingThatFits[1].totalBeds - group.length
            }
            return true
        } else {
            return false
        }
    }

    baseGroups.forEach(group => {
        let didHouseGroup = findGroupABuildingThatFits(group)
        if (!didHouseGroup) bigGroups.push(group)
        if (buildings.length < 1) {
            throw 'no buildings left!'
        }
    })

    if (bigGroups.length > 0) {
        bigGroups.forEach(bigGroup => {
            do {
                let biggestBuildingSize = buildings[buildings.length - 1][1].totalBeds
                let subgroup = bigGroup.splice(0, biggestBuildingSize)
                findGroupABuildingThatFits(subgroup)
            } while (bigGroup.length > 0)
        })
    }

    return housingPlan
}

const printHousingPlan = (plan) => {
    console.log('===== HOUSING PLAN =====')
    let plans = Object.entries(plan)
    plans.forEach(([buildingName, housingDetails]) => {
        console.log(`Building: ${buildingName}`)
        console.log(`   (${housingDetails.occupants.length} people)`)
        console.log(`   ${housingDetails.emptyBeds} empty beds`)
        console.log(`   Roster:`)
        housingDetails.occupants.forEach(occupant => console.log(`          ${occupant.name}`))
    })
}

module.exports = {
    canShareRoom,
    createBaseGroups,
    createHousingPlan,
    printHousingPlan
}