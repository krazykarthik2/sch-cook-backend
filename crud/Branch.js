const { Branch } = require("./../models");

// Branch Functions

async function createBranch(data) {
  const branch = new Branch(data);
  await branch.save();
  return branch;
}

async function editBranch(id, data) {
  const bra_ = await getBranchById(id);
  const branch = await Branch.findByIdAndUpdate(bra_._id, data, { new: true });
  return branch;
}

async function deleteBranch(id) {
  const bra_ = await getBranchById(id);
  await Branch.findByIdAndDelete(bra_._id);
}

async function getBranches(query) {
  const branches = await Branch.find(query);
  return branches;
}

async function getBranchById(id) {
  const branch = await Branch.findOne({ branch_id: id });
  return branch;
}
async function getBranches_simple() {
  const branches = await Branch.find(query, {
    year: 1,
    branch_code: 1,
    branch_id: 1,
    name: 1,
    "sections.sec_id": 1,
    "sections.name": 1,
  });
}
async function getBranchBy_Id(id) {
  const branch = await Branch.findById(id);
  return branch;
}

module.exports = {
  createBranch,
  editBranch,
  deleteBranch,
  getBranches,
  getBranchById,
  getBranches_simple
};
