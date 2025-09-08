const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

VoterModel = require('../models/voterModel')
const HttpError = require('../models/ErrorModel')

// ============= REGISTER NEW VOTER
//POST : api/voters/register
const registerVoter = async (req, res, next) => {
    try {
        const {fullName, email, password, password2, county, municipality} = req.body;
        if ( !fullName || !email || !password || !password2 || county || municipality) {
            return next(new HttpError("Mbushni te gjitha fushat ", 442))
        }

        //make all emails lowercased
        const newEmail = email.toLowerCase()

        //check if email exists in db
        const emailExists = await VoterModel.findOne({email: newEmail})
        if(emailExists) {
            return next (new HttpError("Ky email eshte i regjistruar !", 442))
        }

        //make sure password 6+ chars
        if ((password.trim().length) < 6) {
            return next(new HttpError("Fjalekalimi duhet te jete te pakten 6 karaktere", 422))
        }

        //make sure passwords march
        if (password != password2){
            return next(new HttpError("Fjalekalimet nuk perputhen", 422))
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //no user/voter should be admin

        let isAdmin = false;
        if (newEmail === "orkida@gmail.com"){
            isAdmin = true
        }

        //save new voter to db
        const newVoter = await VoterModel.create({fullName, email: newEmail, password: hashedPassword, isAdmin, county, municipality})
        res.status(201).json(`Votues i ri ${fullName} u krijua.`)

        
    } catch (error) {
        return next(new HttpError("Regjistrimi i votuesit deshtoi. ", 422))
    }
    
}

//function to generate token

const generateToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1d"})
    return token;
}

// ============= LOGIN VOTER
//POST : api/voters/login
const loginVoter = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if (!email || !password ){
            return next(new HttpError("Mbushni te gjitha fushat." , 422))
        }

        const newEmail = email.toLowerCase();
        const voter = await VoterModel.findOne({email: newEmail});

        if(!voter) {
            return next(new HttpError("Kredenciale te pasakta!", 422));
        }

        // compare passwords
        const comparePass = await bcrypt.compare(password, voter.password);
        if(!comparePass) {
            return next(new HttpError("Kredenciale te pasakta!", 422));
        }

        const {_id: id, isAdmin, votedElections} = voter;
        const token = generateToken({id, isAdmin});

        res.json({token, id, votedElections, isAdmin});
         
    } catch (error) {
        console.error(error); // shih gabimin real
        return next(new HttpError("Hyrja ne aplikacion deshtoi. Kontrolloni kredencialet ose provoni me vone." , 500))
    } 
}


// ============= GET VOTER
//GET : api/voters/:ID
//PROTECTED

const getVoter = async (req, res, next) => {
    const {id} = req.params;
    try {
        const {id} = req.params;
        const voter = await VoterModel.findById(id).select("-password").populate('county', 'name')
    .populate('municipality', 'name')
        res.json(voter)
    } catch (error) {
        return next(HttpError("Votuesi nuk u gjend", 404))
    }
}

module.exports = {registerVoter, loginVoter, getVoter}