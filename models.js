// File: models.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeeSchema = new Schema({
  emp_id: String,
  name: String,
});

const SubjectSchema = new Schema({
  subject_id: String,
  name: String,
  branches_taught:[String],
});

const EmpRelationSchema = new Schema({
  emp_id: String,
  branch_id: String,
  sec_id: String,
  subject_id: String,
});

const sectionSchema = new Schema({
  sec_id: String,
  name: String,
  timetable: {
    type: Map,
    of: Array,
  },
});

const branchSchema = new Schema({
  year:Number,//example 1
  branch_code:String,//example ECE
  branch_id: String,//example ECE-I
  sections: [sectionSchema],
});
const branchCodeSchema = new Schema({
  branch_code:String,//example ECE
  name: String,
});

const EmployeeRelation = mongoose.model("EmpRelations", EmpRelationSchema);
const Subject = mongoose.model("Subject", SubjectSchema);
const Employee = mongoose.model("Employee", employeeSchema);
const Branch = mongoose.model("Branch", branchSchema);
const BranchCode = mongoose.model("BranchCode",branchCodeSchema)
module.exports = { Employee, Branch, EmployeeRelation, Subject ,BranchCode};
