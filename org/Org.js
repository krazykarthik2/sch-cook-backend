const { default: mongoose } = require("mongoose");
const {
  Employee,
  BranchCode,
  Branch,
  EmployeeRelation,
  Subject,
  User,
  Organization,
} = require("../models");
const bcrypt = require("bcryptjs");
async function getOrgs(query) {
  const orgs = await Organization.find(query).populate("admin");
  return orgs;
}
// Create Organization with Admin Credentials
async function createOrgWithAdminCred({
  name,
  org_id,
  admin_username,
  admin_password,
}) {
  const _id = new mongoose.Types.ObjectId();
  const organization = new Organization({
    name: name,
    org_id: org_id,
    admin: _id,
  });

  await organization.save();

  const hashedPassword = await bcrypt.hash(admin_password, 10);

  const adminUser = new User({
    _id: _id,
    username: admin_username,
    password: hashedPassword,
    role: "admin",
    organization: organization,
  });

  await adminUser.save();

  return organization;
}

// Edit Organization
async function editOrg(id, data) {
  const organization = await Organization.findByIdAndUpdate(id, data, {
    new: true,
  });
  return organization;
}

// Delete Organization Forever
async function deleteOrgForever(id) {
  const organization = await Organization.findById(id);
  if (!organization) {
    throw new Error("Organization not found");
  }

  // Delete all everything associated with the organization
  await User.deleteMany({ organization: organization._id });
  await Branch.deleteMany({ organization: organization._id });
  await BranchCode.deleteMany({ organization: organization._id });
  await Employee.deleteMany({ organization: organization._id });
  await EmployeeRelation.deleteMany({ organization: organization._id });
  await Subject.deleteMany({ organization: organization._id });

  // Delete the organization
  await Organization.findByIdAndDelete(id);
  return true;
}

module.exports = {
  getOrgs,
  createOrgWithAdminCred,
  editOrg,
  deleteOrgForever,
};
