const { EmployeeRelation } = require("./../models");

// EmpRelation Functions

async function createEmpRelation(data) {
  const relation = new EmployeeRelation(data);
  await relation.save();
  return relation;
}

async function editEmpRelation(id, data) {
  const relation = await EmployeeRelation.findByIdAndUpdate(id, data, {
    new: true,
  });
  return relation;
}

async function deleteEmpRelation(id) {
  return await EmployeeRelation.findByIdAndDelete(id);
}

async function getEmpRelations(params) {
  let opts = {};
  if (params.emp_id) opts.emp_id = params.emp_id;
  if (params.branch_id) opts.branch_id = params.branch_id;
  if (params.sec_id) opts.sec_id = params.sec_id;
  if (params.subject_id) opts.subject_id = params.subject_id;
  const relations = await EmployeeRelation.find(opts);
  return relations;
}

async function getEmpRelationsQuery(query) {
  const relations = await EmployeeRelation.find(query);
  return relations;
}

async function getEmpRelationBy_Id(id) {
  const relation = await EmployeeRelation.findById(id);
  return relation;
}

module.exports = {
  createEmpRelation,
  editEmpRelation,
  deleteEmpRelation,
  getEmpRelations,
  getEmpRelationsQuery,
  getEmpRelationBy_Id,
};
