const { useMiddleware } = require('./useMiddleware')

const fetchHousingPlan = (event, context) => {

}

const generateHousingPlan = (event, context) => {

}

const updateHousingPlan = (event, context) => {

}

const deleteHousingPlan = (event, context) => {

}

module.exports = {
    fetchHousingPlan: useMiddleware(fetchHousingPlan),
    generateHousingPlan: useMiddleware(generateHousingPlan),
    updateHousingPlan: useMiddleware(updateHousingPlan),
    deleteHousingPlan: useMiddleware(deleteHousingPlan)
}