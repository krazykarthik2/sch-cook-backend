const { BranchCode } = require("./../models");

// Branch Functions

async function createBranchCode(org_id, data) {
  const branchCode = new BranchCode({ ...data, organization: org_id });
  await branchCode.save();
  return branchCode;
}

async function editBranchCode(org_id, id, data) {
  const bra_code = await getBranchCodeById(org_id, id);
  const branchCode = await BranchCode.findByIdAndUpdate(bra_code._id, data, {
    new: true,
  });
  return branchCode;
}

async function deleteBranchCode(org_id, id) {
  const bra_code = await getBranchCodeById(org_id, id);
  await BranchCode.findByIdAndDelete(bra_code._id);
}

async function getBranchCodes(org_id, query) {
  const branches = await BranchCode.find({ ...query, organization: org_id });
  return branches;
}

async function getBranchCodeById(org_id, branch_code) {
  const branch = await BranchCode.findOne({
    branch_code: branch_code,
    organization: org_id,
  });
  return branch;
}
async function getBranchCodeBy_Id(org_id, id) {
  const branch = await BranchCode.findById(id);
  if (branch.organization == org_id) return branch;
  else throw new Error("BranchCode belongs to another Organization");
}

module.exports = {
  createBranchCode,
  editBranchCode,
  deleteBranchCode,
  getBranchCodes,
  getBranchCodeById,
};
