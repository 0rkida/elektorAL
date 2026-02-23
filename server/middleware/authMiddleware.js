const jwt = require("jsonwebtoken");
const HttpError = require("../models/ErrorModel");
const Voter = require("../models/voterModel");

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Provo nga cookie (MË E SIGURTA)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 2️⃣ Fallback nga Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new HttpError("I paautorizuar. Nuk ka token.", 401));
    }

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
    return next(new HttpError("Autentikimi deshtoi.", 401));
  }
};

module.exports = authMiddleware;