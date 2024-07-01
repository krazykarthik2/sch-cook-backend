const {
  createEmployee,
  editEmployee,
  deleteEmployee,
  getEmployees,
  getEmployeeById,
  getEmployeeSchedule,
} = require("./Employee");
const {
  createBranch,
  editBranch,
  deleteBranch,
  getBranches,
  getBranchById,
  getBranches_simple,
} = require("./Branch");
const { createSection, editSection, deleteSection } = require("./Section");
const {
  getSectionTimetable,
  editSectionTimetable,
  deleteSectionTimetable,
} = require("./Timetable");
const {
  createSubject,
  editSubject,
  deleteSubject,
  getSubjects,
  getSubjectById,
} = require("./Subject");
const {
  createEmpRelation,
  editEmpRelation,
  deleteEmpRelation,
  getEmpRelations,
} = require("./EmployeeRelation");
const {
  createBranchCode,
  editBranchCode,
  deleteBranchCode,
  getBranchCodes,
  getBranchCodeById,
} = require("./BranchCode");
module.exports = {
  createEmployee,
  editEmployee,
  deleteEmployee,
  getEmployees,
  getEmployeeById,
  getEmployeeSchedule, //delete either of this
  createBranch,
  editBranch,
  deleteBranch,
  getBranches,
  getBranchById,
  getBranches_simple,
  createSection,
  editSection,
  deleteSection,
  getSectionTimetable,
  editSectionTimetable,
  deleteSectionTimetable,
  createSubject,
  editSubject,
  deleteSubject,
  getSubjects,
  getSubjectById,
  createEmpRelation,
  editEmpRelation,
  deleteEmpRelation,
  getEmpRelations,
  createBranchCode,
  editBranchCode,
  deleteBranchCode,
  getBranchCodes,
  getBranchCodeById,
};
