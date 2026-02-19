const { v4: uuid } = require("uuid");
const HttpError = require('../models/ErrorModel');
const cloudinary = require("../utils/cloudinary");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const ElectionModel = require("../models/electionModel");
const CandidateModel = require("../models/candidateModel");

// ================= ADD CANDIDATE
// POST : /api/candidates
// PROTECTED (ADMIN)
const addCandidate = async (req, res, next) => {
  try {
    console.log("ADD CANDIDATE BODY:", req.body);
    console.log("ADD CANDIDATE FILES:", req.files);
    // admin check
    if (!req.user || !req.user.isAdmin) {
      return next(new HttpError("Vetëm administratori mund ta kryejë këtë veprim.", 403));
    }

    const { fullName, motto, currentElection, municipality } = req.body;

    // required fields check
    if (!fullName || !motto || !currentElection || !municipality) {
      return next(new HttpError("Mbushni të gjitha fushat.", 422));
    }

    // image check
    if (!req.files || !req.files.image) {
      return next(new HttpError("Zgjidhni një imazh.", 422));
    }

    const image = req.files.image;

    // file size check (1MB)
    if (image.size > 1_000_000) {
      return next(new HttpError("Fotoja duhet të jetë më pak se 1MB.", 422));
    }

    // generate filename
    const ext = path.extname(image.name);
    const fileName = `${path.basename(image.name, ext)}-${uuid()}${ext}`;
    const uploadPath = path.join(__dirname, "..", "uploads", fileName);

    // move image locally
    image.mv(uploadPath, async (err) => {
      if (err) {
        return next(new HttpError(err.message || "Gabim në ngarkimin e fotos.", 500));
      }

      try {
        // upload to cloudinary
        const result = await cloudinary.uploader.upload(uploadPath, {
          resource_type: "image",
          folder: "candidates"
        });

        // delete local file
        fs.unlink(uploadPath, () => {});

        if (!result.secure_url) {
          return next(new HttpError("Ngarkimi në Cloudinary dështoi.", 500));
        }

        // start transaction
        const sess = await mongoose.startSession();
        sess.startTransaction();

        // create candidate
        const newCandidate = await CandidateModel.create([{
          fullName,
          motto,
          municipality,
          image: result.secure_url,
          election: currentElection
        }], { session: sess });

        // link candidate to election
        const election = await ElectionModel.findById(currentElection).session(sess);
        election.candidates.push(newCandidate[0]._id);
        await election.save({ session: sess });

        await sess.commitTransaction();
        sess.endSession();

        return res.status(201).json({
          message: "Kandidati u shtua me sukses",
          candidate: newCandidate[0]
        });

      } catch (error) {
        return next(new HttpError(error.message || "Shtimi i kandidatit dështoi.", 500));
      }
    });

  } catch (error) {
    return next(new HttpError(error.message || "Gabim serveri.", 500));
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
    const sess = await mongoose.startSession();
    sess.startTransaction();

    try {
        const { id: candidateId } = req.params;
        const { selectedElection } = req.body;

        if (!selectedElection) {
            return next(new HttpError("Zgjedhja nuk është specifikuar.", 422));
        }

        const candidate = await CandidateModel
            .findById(candidateId)
            .session(sess);

        if (!candidate) {
            await sess.abortTransaction();
            sess.endSession();
            return next(new HttpError("Kandidati nuk u gjet.", 404));
        }

        const voter = await VoterModel
            .findById(req.user.id)
            .session(sess);

        if (!voter) {
            await sess.abortTransaction();
            sess.endSession();
            return next(new HttpError("Votuesi nuk u gjet.", 404));
        }

        const election = await ElectionModel
            .findById(selectedElection)
            .session(sess);

        if (!election) {
            await sess.abortTransaction();
            sess.endSession();
            return next(new HttpError("Zgjedhja nuk u gjet.", 404));
        }

        
        if (voter.votedElections.includes(election._id)) {
            await sess.abortTransaction();
            sess.endSession();
            return next(
                new HttpError("Ju keni votuar tashmë në këtë zgjedhje.", 403)
            );
        }

        // update everything
        candidate.voteCount += 1;
        election.voters.push(voter._id);
        voter.votedElections.push(election._id);

        await candidate.save({ session: sess });
        await election.save({ session: sess });
        await voter.save({ session: sess, validateBeforeSave: false });

        await sess.commitTransaction();
        sess.endSession();

        return res.status(200).json(voter.votedElections);

    } catch (error) {
        await sess.abortTransaction();
        sess.endSession();
        console.error(error);
        return next(new HttpError("Votimi dështoi.", 500));
    }
};


module.exports = {addCandidate, getCandidate,removeCandidate, voteCandidate }