const jwt = require("jsonwebtoken");
const HttpError = require("../models/ErrorModel");
const Voter = require("../models/voterModel");

const authMiddleware = async (req, res, next) => {
  try {
    const authorization =
      req.headers.authorization || req.headers.Authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(new HttpError("I paautorizuar. S'ka token.", 403));
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const voter = await Voter.findById(decoded.id)
      .select("-password")
      .populate("county", "name")
      .populate("municipality", "name");

    if (!voter) {
      return next(new HttpError("User nuk u gjet.", 404));
    }

    req.user = voter; 
    next();
  } catch (err) {
    console.error("AUTH ERROR 👉", err);
    return next(new HttpError("Autentikimi deshtoi.", 403));
  }
};

module.exports = authMiddleware;