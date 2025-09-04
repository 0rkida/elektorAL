const {v4 : uuid} = require("uuid")
const HttpError = require('../models/ErrorModel')
const cloudinary = require("../utils/cloudinary")
const path = require("path")
const mongoose = require("mongoose")

const ElectionModel = require("../models/electionModel")
const CandidateModel = require("../models/candidateModel")
const VoterModel = require("../models/voterModel")



// ============= ADD CANDIDATE
//POST : api/candidates/
//PROTECTED (ONLY ADMIN)
const addCandidate = async (req, res, next) => {
     
    try {
        if(!req.user.isAdmin){
             return next(new HttpError("Vetem nje administrator mund ta kryeje kte veprim. ", 403))
         }

        const {fullName, motto, currentElection} = req.body;
        if ( !fullName || !motto) {
            return next (new HttpError("Mbushni te gjitha fushat", 422))
        }

        if(!req.files.image){
            return next(new HttpError("Zgjidhni nje imazh", 422))
        }

        const {image} = req.files;

        //check file size

        if(image.size > 1000000) {
            return next(new HttpError("Fotoja duhet te jete me pak se 1mb. ", 422))
        }

        let fileName = image.name;
     fileName = fileName.split(".")
     fileName = fileName[0] + uuid() + "." + fileName[fileName.length - 1]

     image.mv(path.join(__dirname, '..', 'uploads', fileName), async(err) => {
        if(err) {
            return next(new HttpError(err))
        }
        const result = await cloudinary.uploader.upload(path.join(__dirname, '..', 'uploads' , fileName), {resource_type: "image"})
        if(!result.secure_url) {
            return next(new HttpError("Fotoja nuk u ngarkua dot ne Cloudinary"))
        }

        //add candidate to db
        let newCandidate = await CandidateModel.create({fullName, motto, image: result.secure_url, election:currentElection})

        //get election adn push cndidate to election 
        let election = await ElectionModel.findById(currentElection)

        const sess = await mongoose.startSession()
        sess.startTransaction()
        await newCandidate.save({session: sess})
        election.candidates.push(newCandidate)
        await election.save({session:sess})
        await sess.commitTransaction()

        res.status(201).json("Kandidati u shtua me sukses")
     })

    } catch (error) {
        return next (new HttpError(error))
    }
}

// ============= GET CANDIDATE
//GET : api/candidates/
//PROTECTED 
const getCandidate = async (req, res, next) => {
    try {
        const {id} = req.params;
        const candidate = await CandidateModel.findById(id)
        res.json(candidate)
    } catch (error) {
        return next(new HttpError(error))
        
    }
}

// ============= REMOVE CANDIDATE
//DELETE : api/candidates/:id
//PROTECTED (ONLY ADMIN)
const removeCandidate = async (req, res, next) => {
    try {
         if(!req.user.isAdmin){
             return next(new HttpError("Vetem nje administrator mund ta kryeje kte veprim. ", 403))
         }

         const {id} = req.params;
         let currentCandidate = await CandidateModel.findById(id).populate('election')
         if (!currentCandidate) {
            return next (new HttpError("Couldn't delete candidate" , 422))
         } else {
            const sess = await mongoose.startSession()
            sess.startTransaction()
            await currentCandidate.deleteOne({session:sess})
            currentCandidate.election.candidates.pull(currentCandidate);
            await currentCandidate.election.save({session: sess})
            await sess.commitTransaction()

            res.status(200).json("Candidate deleted successfully. ")

         }
        
    } catch (error) {
        return next (new HttpError(error))
        
    }
}

// ============= VOTE CANDIDATE
//PATCH : api/candidates/:id
//PROTECTED 
const voteCandidate = async (req, res, next) => {
    try {
        const {id: candidateId} = req.params;
        const {selectedElection} = req.body;

        // get the candidate
        const candidate = await CandidateModel.findById(candidateId);
        if (!candidate) return next(new HttpError("Kandidati nuk u gjet.", 404));

        // update candidate vote count
        candidate.voteCount += 1;
        await candidate.save();

        // start session
        const sess = await mongoose.startSession();
        sess.startTransaction();

        // get the current voter
        let voter = await VoterModel.findById(req.user.id).session(sess);
        if (!voter) return next(new HttpError("Votuesi nuk u gjet.", 404));

        // get selected election
        let election = await ElectionModel.findById(selectedElection).session(sess);
        if (!election) return next(new HttpError("Zgjedhja nuk u gjet.", 404));

        // update relations
        election.voters.push(voter._id);
        voter.votedElections.push(election._id);

        await election.save({session:sess});
        await voter.save({session:sess});

        await sess.commitTransaction();
        sess.endSession();

        return res.status(200).json("Vota juaj u regjistrua me sukses !");
        
    } catch (error) {
        console.error(error);
        return next(new HttpError("Votimi dështoi.", 500));
    }
}



module.exports = {addCandidate, getCandidate,removeCandidate, voteCandidate }