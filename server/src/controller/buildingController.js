const { useMiddleware } = require('./useMiddleware')

const fetchBuildings = (event, context) => {

}

const addBuildings = (event, context) => {

}

const removeBuildings = (event, context) => {

}

const updateBuildings = (event, context) => {

}

module.exports = {
    fetchBuildings: useMiddleware(fetchBuildings),
    addBuildings: useMiddleware(addBuildings),
    removeBuildings: useMiddleware(removeBuildings),
    updateBuildings: useMiddleware(updateBuildings)
}