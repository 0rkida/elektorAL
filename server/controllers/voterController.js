const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Voter = require('../models/voterModel')
const HttpError = require('../models/ErrorModel')

// ============= REGISTER NEW VOTER
//POST : api/voters/register
const registerVoter = async (req, res, next) => {
    try {
        const { emri, mbiemri, email, password, password2, idPersonal, county, municipality } = req.body;

        const fullName = `${emri?.trim() || ""} ${mbiemri?.trim() || ""}`.trim();

        if (
            !fullName || !email?.trim() || !password || !password2 ||
            !idPersonal || !county || !municipality
        ) {
            return next(new HttpError("Mbushni te gjitha fushat", 422));
        }

        if (password !== password2) {
            return next(new HttpError("Fjalekalimet nuk përputhen", 422));
        }

        if (password.trim().length < 6) {
            return next(new HttpError("Fjalekalimi duhet të jetë të paktën 6 karaktere", 422));
        }

        const newEmail = email.toLowerCase();

        const emailExists = await Voter.findOne({ email: newEmail });
        if (emailExists) {
            return next(new HttpError("Ky email është i regjistruar!", 422));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let isAdmin = newEmail === "orkida@gmail.com";

        // SAVE në DB
        const newVoter = await Voter.create({
            fullName,
            idNumber: idPersonal,
            email: newEmail,
            password: hashedPassword,
            county,
            municipality,
            isAdmin
        });

        res.status(201).json(`Votues i ri ${fullName} u krijua.`);

    } catch (error) {
        console.error("REGISTER ERROR 👉", error);
        return next(new HttpError(error.message, 500));
    }
};

//function to generate token

const generateToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1d"})
    return token;
}

// ============= LOGIN VOTER
//POST : api/voters/login
const loginVoter = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new HttpError("Mbushni te gjitha fushat.", 422));
    }

    const voter = await Voter.findOne({ email: email.toLowerCase() })
      .populate("county", "name")
      .populate("municipality", "name");

    if (!voter) {
      return next(new HttpError("Kredenciale te pasakta!", 422));
    }

    const comparePass = await bcrypt.compare(password, voter.password);
    if (!comparePass) {
      return next(new HttpError("Kredenciale te pasakta!", 422));
    }

    const token = generateToken({
      id: voter._id,
      isAdmin: voter.isAdmin
    });

    // ✅ KTHEJE USER-IN TË PLOTË
    res.status(200).json({
      id: voter._id,
      token,
      isAdmin: voter.isAdmin,
      votedElections: voter.votedElections,
      county: voter.county,
      municipality: voter.municipality
    });

  } catch (error) {
    console.error(error);
    return next(
      new HttpError(
        "Hyrja ne aplikacion deshtoi. Provoni me vone.",
        500
      )
    );
  }
};

// ============= GET VOTER
//GET : api/voters/:ID
//PROTECTED

const getVoter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const voter = await Voter.findById(id)
      .select("-password")
      .populate("county", "name")
      .populate("municipality", "name");

    if (!voter) {
      return next(new HttpError("Votuesi nuk u gjend", 404));
    }

    res.status(200).json(voter);
  } catch (error) {
    return next(new HttpError("Votuesi nuk u gjend", 404));
  }
};

module.exports = {registerVoter, loginVoter, getVoter}