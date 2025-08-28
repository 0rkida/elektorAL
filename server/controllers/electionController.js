// ============= ADD NEW ELECTION
//POST : api/elections/
//PROTECTED (ONLY ADMIN)
const addElection = (req, res, next) => {
    res.json("Add Election")
}

// ============= GET ALL ELECTIONS
//GET : api/elections/
//PROTECTED 
const getElections = (req, res, next) => {
    res.json("Get all elections")
}

// ============= GET SINGLE ELECTIONS
//GET : api/elections/:id
//PROTECTED
const getElection = (req, res, next) => {
    res.json("Get single election")
}

// ============= GET ELECTION CANDIDATES
//GET : api/elections/id/candidates
//PROTECTED
const getCandidatesOfElection = (req, res, next) => {
    res.json("Get candidates of election")
}

// ============= GET ELECTION VOTERS
//GET : api/elections/:id/voters
//PROTECTED
const getElectionVoters = (req, res, next) => {
    res.json("Get election voters")
}

// ============= REMOVE ELECTION
//DELETE : api/elections/:id
//PROTECTED (ONLY ADMIN)
const removeElection = (req, res, next) => {
    res.json("Delete election")
}

// ============= EDIT ELECTION
//PATCH : api/elections/:id
//PROTECTED (ONLY ADMIN)
const updateElection = (req, res, next) => {
    res.json("Edit election")
}

module.exports = {addElection,getElection, getElections, updateElection, removeElection, 
    getCandidatesOfElection, getElectionVoters}


