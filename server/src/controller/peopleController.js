const { useMiddleware } = require('./useMiddleware')

const fetchPeople = (event, context) => {

}

const addPeople = (event, context) => {
    
}

const removePeople = (event, context) => {

}

const updatePeople = (event, context) => {

}

module.exports = {
    fetchPeople: useMiddleware(fetchPeople),
    addPeople: useMiddleware(addPeople),
    removePeople: useMiddleware(removePeople),
    updatePeople: useMiddleware(updatePeople)
}