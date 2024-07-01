const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Organization } = require("../models");

// Helper function to generate JWT token 
function generateToken(user) {
  const opts = user.organization?{organization: user.organization}:{};
  const json = {
    user: { id: user._id, role: user.role, ...opts },
  };
  return jwt.sign(
    json,
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

// Login function
async function login(username, password) {
  //for governers
  let user = await User.findOne({ username: username, role: "governer" });//checking if he's a gov.
  if (!user) {
    user = await User.findOne({ username }).populate("organization");
  }
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user);
  return { token, user };
}

// Add Admin Login function
async function addAdminLogin({ username, password }, org_id) {
  const organization = await Organization.findOne({ org_id: org_id });
  if (!organization) {
    throw new Error("Organization not found");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    password: hashedPassword,
    role: "admin",
    organization: organization._id,
  });

  await user.save();
  return user;
}

// Add Viewer Login function
async function addViewerLogin({ username, password, organization_id }) {
  const organization = await Organization.findOne({ organization_id });
  if (!organization) {
    throw new Error("Organization not found");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    password: hashedPassword,
    role: "viewer",
    organization: organization._id,
  });

  await user.save();
  return user;
}

// Delete User function
async function deleteUser(id) {
  await User.findByIdAndDelete(id);
}

module.exports = {
  login,
  addAdminLogin,
  addViewerLogin,
  deleteUser,
};
