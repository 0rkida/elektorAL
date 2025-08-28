// ============= ADD CANDIDATE
//POST : api/candidates/
//PROTECTED (ONLY ADMIN)
const addCandidate = (req, res, next) => {
    res.json("Add Candidate")
}

// ============= GET CANDIDATE
//GET : api/candidates/
//PROTECTED 
const getCandidate = (req, res, next) => {
    res.json("Get candidate")
}

// ============= REMOVE CANDIDATE
//DELETE : api/candidates/:id
//PROTECTED (ONLY ADMIN)
const removeCandidate = (req, res, next) => {
    res.json("Delete candidate")
}

// ============= VOTE CANDIDATE
//PATCH : api/candidates/:id
//PROTECTED 
const voteCandidate = (req, res, next) => {
    res.json("Vote candidate")
}

module.exports = {addCandidate, getCandidate,removeCandidate, voteCandidate }