const jwt = require("jsonwebtoken")
const HttpError = require("../models/ErrorModel")

const authMiddleware = async (req, res, next) => {
    const Authorization = req.headers.Authorization || req.headers.authorization;

    if(Authorization && Authorization.startsWith("Bearer")){
        const token = Authorization.split(' ')[1]

        jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
            if(err) {
                return next (new HttpError("I paautorizuar. Token i pavlefshem. ", 403))
            }

            req.user = info;
            next()
        })
        
    } else {
        return next (new HttpError("I paautorizuar. S'ka token. ", 403))
    }
}

module.exports = authMiddleware;