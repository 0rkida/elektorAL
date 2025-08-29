const bcrypt = require('bcryptjs')

VoterModel = require('../models/voterModel')
const HttpError = require('../models/ErrorModel')

// ============= REGISTER NEW VOTER
//POST : api/voters/register
const registerVoter = async (req, res, next) => {
    try {
        const {fullName, email, password, password2} = req.body;
        if ( !fullName || !email || !password || !password2) {
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
        if (newEmail == "achiever@gmail.com"){
            isAdmin == true
        }

        //save new voter to db
        const newVoter = await VoterModel.create({fullName, email: newEmail, password: hashedPassword, isAdmin})
        res.status(201).json(`Votues i ri ${fullName} u krijua.`)

        
    } catch (error) {
        return next(new HttpError("Regjistrimi i votuesit deshtoi. ", 422))
    }
    
}

// ============= LOGIN VOTER
//POST : api/voters/login
const loginVoter = async (req, res, next) => {
    res.json("Login Voter")
}

// ============= GET VOTER
//GET : api/voters/:ID
//PROTECTED

const getVoter = async (req, res, next) => {
    res.json("Get Voter")
}

module.exports = {registerVoter, loginVoter, getVoter}