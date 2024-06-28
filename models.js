// File: models.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrganizationRef = {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Organization",
  required: true,
};
const employeeSchema = new Schema({
  emp_id: { type: String, required: true },
  name: { type: String, required: true },
  organization: OrganizationRef,
});

const SubjectSchema = new Schema({
  subject_id: { type: String, required: true },
  name: { type: String, required: true },
  organization: OrganizationRef,
});

const EmpRelationSchema = new Schema({
  emp_id: { type: String, required: true },
  branch_id: { type: String, required: true },
  sec_id: { type: String, required: true },
  subject_id: { type: String, required: true },
  organization: OrganizationRef,
});

const sectionSchema = new Schema({
  sec_id: { type: String, required: true },
  name: { type: String, required: true },
  timetable: {
    type: Map,
    of: Array,
  },
  organization: OrganizationRef,
});

const branchSchema = new Schema({
  year: {type:Number,required:true}, //example 1
  branch_code: { type: String, required: true }, //example ECE
  branch_id: { type: String, required: true }, //example ECE-I
  sections: [sectionSchema],
  organization: OrganizationRef,

});
const branchCodeSchema = new Schema({
  branch_code: { type: String, required: true }, //example ECE
  name: { type: String, required: true },
  organization: OrganizationRef,
});

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  org_id: { type: String, unique: true, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});


const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "viewer"], default: "viewer" },
  organization: OrganizationRef,
});

const EmployeeRelation = mongoose.model("EmpRelations", EmpRelationSchema);
const Subject = mongoose.model("Subject", SubjectSchema);
const Employee = mongoose.model("Employee", employeeSchema);
const Branch = mongoose.model("Branch", branchSchema);
const BranchCode = mongoose.model("BranchCode", branchCodeSchema);
const Organization = mongoose.model("Organization", OrganizationSchema);
const User = mongoose.model("User", UserSchema);
module.exports = { Employee, Branch, EmployeeRelation, Subject, BranchCode,Organization,User };
