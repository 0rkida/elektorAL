
// ============= REGISTER NEW VOTER
//POST : api/voters/register
const registerVoter = (req, res, next) => {
    res.json("Register Voter")
}

// ============= OGIN VOTER
//POST : api/voters/login
const loginVoter = (req, res, next) => {
    res.json("Login Voter")
}

// ============= GET VOTER
//GET : api/voters/:ID
//PROTECTED

const getVoter = (req, res, next) => {
    res.json("Get Voter")
}

module.exports = {registerVoter, loginVoter, getVoter}