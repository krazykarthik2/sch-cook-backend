const { default: mongoose } = require("mongoose");
const { EmployeeRelation } = require("./../models");

// EmpRelation Functions

async function createEmpRelation(org_id, data) {
  const relation = new EmployeeRelation({ ...data, organization: org_id });
  await relation.save();
  return relation;
}

async function editEmpRelation(org_id, id, data) {
  const relation = await EmployeeRelation.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id), organization: org_id },
    data,
    {
      new: true,
    }
  );
  return relation;
}

async function deleteEmpRelation(org_id, id) {
  return await EmployeeRelation.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(id),
    organization: org_id,
  });
}

async function getEmpRelationsQuery(org_id, query) {
  const relations = await EmployeeRelation.find({...query,organization:org_id});
  return relations;
}
async function getEmpRelations(org_id, params) {
  let opts = {};
  if (params.emp_id) opts.emp_id = params.emp_id;
  if (params.branch_id) opts.branch_id = params.branch_id;
  if (params.sec_id) opts.sec_id = params.sec_id;
  if (params.subject_id) opts.subject_id = params.subject_id;
  const relations = await getEmpRelationsQuery(org_id, opts);
  return relations;
}

async function getEmpRelationBy_Id(org_id, id) {
  const relation = await EmployeeRelation.findById(id);
  if (relation.organization == org_id) return relation;
  else throw new Error("Employee Relation belongs to another organization");
}

module.exports = {
  createEmpRelation,
  editEmpRelation,
  deleteEmpRelation,
  getEmpRelations,
  getEmpRelationsQuery,
};
