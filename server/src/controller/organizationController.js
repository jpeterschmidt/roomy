const { useMiddleware } = require('./useMiddleware')

const fetchOrganization = (event, context) => {

}

const createOrganization = (event, context) => {

}

const updateOrganization = (event, context) => {

}

module.exports = {
    fetchOrganization: useMiddleware(fetchOrganization),
    createOrganization: useMiddleware(createOrganization),
    updateOrganization: useMiddleware(updateOrganization)
}