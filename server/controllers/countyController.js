const County = require('../models/countyModel');
const HttpError = require('../models/ErrorModel');

// ============= GET ALL COUNTIES
// GET : api/counties
// Kjo metodë merr të gjitha qarqet nga databaza.
// Nuk ka nevojë për autentikim.
const getAllCounties = async (req, res, next) => {
    try {
        const counties = await County.find();
        res.status(200).json(counties);
    } catch (err) {
        return next(new HttpError("Nuk mund të merren qarqet.", 500));
    }
}

// ============= CREATE NEW COUNTY
// POST : api/counties
// Vetëm admin mund të shtojë qark të ri
const createCounty = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) {
            return next(new HttpError("Emri i qarkut nuk mund të jetë bosh.", 422));
        }

        const exists = await County.findOne({ name });
        if (exists) {
            return next(new HttpError("Ky qark ekziston tashmë.", 422));
        }

        const newCounty = await County.create({ name });
        res.status(201).json(`Qarku ${name} u krijua me sukses.`);
    } catch (err) {
        return next(new HttpError("Krijimi i qarkut deshtoi.", 500));
    }
}

module.exports = { getAllCounties, createCounty };
