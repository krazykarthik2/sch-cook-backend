const { Branch } = require("./../models");

// Branch Functions

async function createBranch(org_id, data) {
  const branch = new Branch({ ...data, organization: org_id });
  await branch.save();
  return branch;
}

async function editBranch(org_id, id, data) {
  const bra_ = await getBranchById(org_id, id);
  const branch = await Branch.findByIdAndUpdate(bra_._id, data, { new: true });
  return branch;
}

async function deleteBranch(org_id, id) {
  const bra_ = await getBranchById(org_id, id);
  await Branch.findByIdAndDelete(bra_._id);
}

async function getBranches(org_id, query) {
  const branches = await Branch.find({ query, organization: org_id });
  return branches;
}

async function getBranchById(org_id, id) {
  const branch = await Branch.findOne({ branch_id: id, organization: org_id });
  return branch;
}
async function getBranches_simple(org_id, query) {
  const branches = await Branch.find(
    { ...query, organization: org_id },
    {
      year: 1,
      branch_code: 1,
      branch_id: 1,
      name: 1,
      "sections.sec_id": 1,
      "sections.name": 1,
    }
  );
  return branches;
}
async function getBranchBy_Id(org_id, id) {
  const branch = await Branch.findById(id);
  if (branch.organization == org_id) return branch;
  else throw new Error("Branch belongs to another organization");
}

module.exports = {
  createBranch,
  editBranch,
  deleteBranch,
  getBranches,
  getBranchById,
  getBranches_simple,
};
