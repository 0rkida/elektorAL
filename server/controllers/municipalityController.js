const Municipality = require('../models/municipalityModel');
const HttpError = require('../models/ErrorModel');

// ============= GET ALL MUNICIPALITIES
// GET : api/municipalities
// Kjo metodë merr të gjitha bashkitë nga databaza.
// Nuk ka nevojë për autentikim.
const getAllMunicipalities = async (req, res, next) => {
    try {
        const municipalities = await Municipality.find().populate('county', 'name');
        res.status(200).json(municipalities);
    } catch (err) {
        return next(new HttpError("Nuk mund të merren bashkitë.", 500));
    }
}

// ============= CREATE NEW MUNICIPALITY
// POST : api/municipalities
// Vetëm admin mund të shtojë bashki të re
const createMunicipality = async (req, res, next) => {
    try {
        const { name, county } = req.body;
        if (!name || !county) {
            return next(new HttpError("Emri i bashkisë dhe qarku janë të nevojshëm.", 422));
        }

        const exists = await Municipality.findOne({ name, county });
        if (exists) {
            return next(new HttpError("Kjo bashki ekziston tashmë në këtë qark.", 422));
        }

        const newMunicipality = await Municipality.create({ name, county });
        res.status(201).json(`Bashkia ${name} u krijua me sukses.`);
    } catch (err) {
        return next(new HttpError("Krijimi i bashkisë deshtoi.", 500));
    }
}

module.exports = { getAllMunicipalities, createMunicipality };
