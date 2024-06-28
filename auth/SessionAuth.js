const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function authenticate(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).populate("organization");
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}

// Authorize middleware
function authorize(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ msg: "Access denied" });
    }
    next();
  };
}

// Check Organization middleware
async function checkOrganization(req, res, next) {
  const { organization } = req.user;
  if (!organization) {
    return res.status(403).json({ msg: "No organization found for this user" });
  }
  req.organization = organization;
  next();
}

async function getAuthOf(id) {
  const user = await User.findById(id).populate("organization");
  return user;
}

module.exports = {
  authenticate,
  authorize,
  checkOrganization,
  getAuthOf,
};
