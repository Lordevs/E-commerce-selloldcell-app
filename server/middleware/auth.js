const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const userModel = require("../models/users");

exports.loginCheck = (req, res, next) => {
  try {
    let token = req.headers.token;
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    token = token.replace("Bearer ", "");
    const decode = jwt.verify(token, JWT_SECRET);
    req.userDetails = decode;
    next();
  } catch (err) {
    res.status(401).json({
      error: "You must be logged in",
    });
  }
};

exports.isAuth = (req, res, next) => {
  let { loggedInUserId } = req.body;
  if (
    !loggedInUserId ||
    !req.userDetails._id ||
    loggedInUserId != req.userDetails._id
  ) {
    res.status(403).json({ error: "You are not authenticate" });
  }
  next();
};

exports.isAdmin = async (req, res, next) => {
  try {
    // req.userDetails is set by loginCheck middleware
    if (req.userDetails && (req.userDetails.role === 1 || req.userDetails.userRole === 1)) {
      next();
    } else {
      res.status(403).json({ error: "Access denied" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
