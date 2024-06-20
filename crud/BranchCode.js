const {  BranchCode } = require("./../models");

// Branch Functions

async function createBranchCode(data) {
  const branchCode = new BranchCode(data);
  await branchCode.save();
  return branchCode;
}

async function editBranchCode(id, data) {
  const bra_code = await getBranchCodeById(id);
  const branchCode = await BranchCode.findByIdAndUpdate(bra_code._id, data, {new:  true } );
  return branchCode;
}

async function deleteBranchCode(id) {
  const bra_code = await getBranchCodeById(id);
  await BranchCode.findByIdAndDelete(bra_code._id);
}

async function getBranchCodes(query) {
  const branches = await BranchCode.find(query);
  return branches;
}

async function getBranchCodeById(branch_code) {
  const branch = await BranchCode.findOne({  branch_code:branch_code });
  return branch;
}
async function getBranchCodeBy_Id(id) {
  const branch = await BranchCode.findById(id);
  return branch;
}

module.exports = {
   createBranchCode,
   editBranchCode,
   deleteBranchCode,
  getBranchCodes,
   getBranchCodeById,
};
