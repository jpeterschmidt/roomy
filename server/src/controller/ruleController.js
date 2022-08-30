const { useMiddleware } = require('./useMiddleware')

const fetchRule = (event, context) => {

}

const createRule = (event, context) => {

}

const updateRule = (event, context) => {

}

const deleteRule = (event, context) => {

}

module.exports = {
    fetchRule: useMiddleware(fetchRule),
    createRule: useMiddleware(createRule),
    updateRule: useMiddleware(updateRule),
    deleteRule: useMiddleware(deleteRule)
}