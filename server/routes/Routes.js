const {Router} = require("express")

const {registerVoter, loginVoter, getVoter} = require("../controllers/voterController")
const {addElection,getElection, getElections, updateElection, removeElection, 
    getCandidatesOfElection, getElectionVoters, getElectionResults} = require("../controllers/electionController") 
const {addCandidate, getCandidate,removeCandidate, voteCandidate } = require("../controllers/candidateControllers")
const { getAllCounties, createCounty } = require("../controllers/countyController")
const { getAllMunicipalities, createMunicipality, getMunicipalitiesByCounty } = require("../controllers/municipalityController")


const authMiddleware = require('../middleware/authMiddleware')

const router = Router()

router.post('/voters/register' , registerVoter);
router.post('/voters/login' , loginVoter);
router.get('/voters/:id' ,authMiddleware, getVoter);

router.post('/elections', authMiddleware, addElection)
router.get('/elections',authMiddleware, getElections)
router.get('/elections/:id',authMiddleware, getElection)
router.delete('/elections/:id',authMiddleware, removeElection)
router.patch('/elections/:id', authMiddleware,updateElection)
router.get('/elections/:id/candidates',authMiddleware, getCandidatesOfElection)
router.get('/elections/:id/voters', authMiddleware,  getElectionVoters)
router.get('/elections/:id/results', authMiddleware, getElectionResults)


router.post('/candidates', authMiddleware,addCandidate)
router.get('/candidates/:id', authMiddleware, getCandidate)
router.delete('/candidates/:id', authMiddleware, removeCandidate)
router.patch('/candidates/:id', authMiddleware, voteCandidate)

router.get('/counties', getAllCounties);
router.post('/counties', authMiddleware, createCounty);

router.get('/municipalities', getAllMunicipalities);
router.post('/municipalities', authMiddleware, createMunicipality);

router.get('/municipalities/by-county/:countyId', getMunicipalitiesByCounty);








module.exports = router