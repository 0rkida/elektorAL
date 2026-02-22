const {v4 : uuid} = require("uuid")
const HttpError = require('../models/ErrorModel')
const cloudinary = require("../utils/cloudinary")
const path = require("path")

const ElectionModel = require("../models/electionModel")
const CandidateModel = require("../models/candidateModel")


// ============= ADD NEW ELECTION
//POST : api/elections/
//PROTECTED (ONLY ADMIN)
const addElection = async (req, res, next) => {
   try {
     //only admin can add election
 
     if(!req.user.isAdmin){
         return next(new HttpError("Vetem nje administrator mund ta kryeje kte veprim. ", 403))
     }
 
     const{title, description} = req.body;
     if (!title || !description) {
         return next(new HttpError("Mbushni te gjitha fushat. ", 422))
     }
 
     if(!req.files.thumbnail) {
         return next(new HttpError("Zgjidhni nje thumbnail. ", 422))
     }
 
     const{thumbnail} = req.files;
     if(thumbnail.size > 1000000) {
         return next(new HttpError("File shum e madhe. Duhet te jete me pak se 1 mb."))
     }
 
     let fileName = thumbnail.name;
     fileName = fileName.split(".")
     fileName = fileName[0] + uuid() + "." + fileName[fileName.length - 1]
 
     //upload file to uploads folder
 await thumbnail.mv(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
     if (err) {
         return next(new HttpError(err));
     }

     //store image on cloudinary
     const result = await cloudinary.uploader.upload(path.join(__dirname, "..", "uploads", fileName), { resource_type: "image" });
     if (!result.secure_url) {
         return next(new HttpError("Fotoja nuk u ngarkua dot ne Clodinary", 422));
     }

     //save election to db
     const newElection = await ElectionModel.create({
         title,
         description,
         thumbnail: result.secure_url
     });
     res.json(newElection);
 });
          
   } catch (error) {
    return next(new HttpError(error))
    
   }

}


// ============= GET ALL ELECTIONS
//GET : api/elections/
//PROTECTED 
const MunicipalityModel = require("../models/municipalityModel");

const getElections = async (req, res, next) => {
  try {
    const elections = await ElectionModel.find();
    res.status(200).json(elections);
  } catch (error) {
    console.error("GET ELECTIONS ERROR 👉", error);
    return next(
      new HttpError("Nuk mund te merren zgjedhjet.", 500)
    );
  }
};
// ============= GET SINGLE ELECTIONS
//GET : api/elections/:id
//PROTECTED
const getElection = async (req, res, next) => {
    try {
        const{id} = req.params;
        const election = await ElectionModel.findById(id)
        res.status(200).json(election)
    }
    catch (error) {
        return next(new HttpError(error))
    }
}

// ============= GET ELECTION CANDIDATES
//GET : api/elections/id/candidates
//PROTECTED

const getCandidatesOfElection = async (req, res, next) => {
  try {
    const { id } = req.params;
    let filter = { election: id };

    // ===== VOTER =====
    if (!req.user.isAdmin) {
      filter.municipality =
        req.user.municipality._id || req.user.municipality;
    }

    // ===== ADMIN =====
    if (req.user.isAdmin) {
      const { municipality, county } = req.query;

      if (municipality) {
        filter.municipality = municipality;
      } else if (county) {
        const munis = await MunicipalityModel.find({ county }).select("_id");
        filter.municipality = { $in: munis.map(m => m._id) };
      }
    }

    const candidates = await CandidateModel.find(filter)
      .populate("municipality", "name");

    res.status(200).json(candidates);
  } catch (err) {
    console.error("GET CANDIDATES ERROR 👉", err);
    return next(
      new HttpError("Nuk mund te merren kandidatet.", 500)
    );
  }
};
// ============= GET ELECTION VOTERS
//GET : api/elections/:id/voters
//PROTECTED
const getElectionVoters = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await ElectionModel.findById(id).populate('voters');
        res.status(200).json(response.voters);
        
    } catch (error) {
        return next(new HttpError(error))
        
    }
}

// ============= REMOVE ELECTION
//DELETE : api/elections/:id
//PROTECTED (ONLY ADMIN)
const removeElection = async (req, res, next) => {
   try {

    //only admin can add election
 
     if(!req.user.isAdmin){
         return next(new HttpError("Vetem nje administrator mund ta kryeje kte veprim. ", 403))
     }

     const {id} = req.params;
     await ElectionModel.findByIdAndDelete(id);

     //delete candidates that belong to this election
     await CandidateModel.deleteMany({election: id})
     res.status(200).json("Zgjedhja u fshi me sukses.")
    
   } catch (error) {
    return next(new HttpError(error))
    
   }
}

// ============= EDIT ELECTION
//PATCH : api/elections/:id
//PROTECTED (ONLY ADMIN)
const updateElection = async (req, res, next) => {
    try {

    //only admin can add election
 
     if(!req.user.isAdmin){
         return next(new HttpError("Vetem nje administrator mund ta kryeje kte veprim. ", 403))
     }

       const { id } = req.params;
        const { title, description } = req.body;

        if (!title || !description) {
            return next(new HttpError("Mbushni te gjitha fushat.", 422));
        }

        if (!req.files || !req.files.thumbnail) {
            return next(new HttpError("Ngarkoni nje foto thumbnail.", 422));
        }

        const { thumbnail } = req.files;

        if (thumbnail.size > 1000000) {
            return next(new HttpError("File shume e madhe. Duhet te jete me pak se 1MB.", 422));
        }

        let fileName = thumbnail.name;
        fileName = fileName.split(".");
        fileName = fileName[0] + uuid() + "." + fileName[fileName.length - 1];

        thumbnail.mv(path.join(__dirname, "..", "uploads", fileName), async (err) => {
            if (err) {
                return next(new HttpError("Gabim gjate ruajtjes se file", 500));
            }

            try {
                const result = await cloudinary.uploader.upload(
                    path.join(__dirname, "..", "uploads", fileName),
                    { resource_type: "image" }
                );

                if (!result.secure_url) {
                    return next(new HttpError("Fotoja nuk u ngarkua dot ne Cloudinary", 422));
                }

                await ElectionModel.findByIdAndUpdate(id, {
                    title,
                    description,
                    thumbnail: result.secure_url,
                });

                return res.status(200).json({ message: "Zgjedhja u perditesua me sukses" });
            } catch (error) {
                return next(new HttpError("Ngarkimi ne Cloudinary deshtoi", 500));
            }
        });
    } catch (error) {
        return next(new HttpError("Përditësimi i zgjedhjes dështoi", 500));
    }
}

module.exports = {addElection,getElection, getElections, updateElection, removeElection, 
    getCandidatesOfElection, getElectionVoters}


