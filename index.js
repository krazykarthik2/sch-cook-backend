// File: index.js

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const {
  createEmployee,
  editEmployee,
  deleteEmployee,
  getEmployees,
  getEmployeeById,
  createBranch,
  editBranch,
  deleteBranch,
  getBranches,
  getBranchById,
  createSection,
  editSection,
  deleteSection,
  getSectionTimetable,
  editSectionTimetable,
  deleteSectionTimetable,
  getSubjects,
  getSubjectById,
  getEmpRelations,
  getEmpRelationBy_Id,
  createEmpRelation,
  editEmpRelation,
  deleteEmpRelation,
  editSubject,
  createSubject,
  getEmployeeSchedule,
  getBranches_simple,
  createBranchCode,
  editBranchCode,
  deleteBranchCode,
  getBranchCodes,
  getBranchCodeById,
  deleteSubject,
} = require("./crud");

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/timetable", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", async (req, res) => {
  res.status(201).json({
    routes: [
      "/employee/create",
      "/employee/edit/:id",
      "/employee/delete/:id",
      "/employee/get",
      "/employee/get/:id",
      "/employee/timetable/get/:id",
      "/branch/create",
      "/branch/edit/:id",
      "/branch/delete/:id",
      "/branch/get",
      "/branch/get/:id",
      "/branch/:branch_id/section/create",
      "/branch/:branch_id/section/edit/:id",
      "/branch/:branch_id/section/delete/:id",
      "/subject/get",
      "/subject/get/:id",
      "/subject/create",
      "/subject/edit/:id",
      "/subject/delete/:id",
      "/relation/get",
      "/relation/get/:id",
      "/relation/create",
      "/relation/edit/:id",
      "/relation/delete/:id",
    ],
  });
});
// Employee Routes
app.post("/employee/create", async (req, res) => {
  try {
    console.log(req.body);
    const employee = await createEmployee(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// curl -H 'Content-Type: application/json'  -d '{"name":"GOPAR","emp_id":"kar25"}' -X POST http://localhost:5000/employee/create
app.post("/employee/edit/:id", async (req, res) => {
  try {
    const employee = await editEmployee(req.params.id, req.body);
    res.json(employee);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// curl -H 'Content-Type: application/json'  -d '{"name":"GOPARAJU KARTHIK 2 "}' -X POST http://localhost:5000/employee/edit/kar25
app.delete("/employee/delete/:id", async (req, res) => {
  try {
    await deleteEmployee(req.params.id);
    res.status(201).json({ result: "success" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -X DELETE http://localhost:5000/employee/delete/kar25
app.all("/employee/get", async (req, res) => {
  try {
    let employees;
    console.log(req.body);
    if (req.body.get) {
      employees = await getEmployees({ emp_id: { $in: req.body.get } });
    } else {
      employees = await getEmployees(req.query);
    }
    res.json(employees);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -X GET http://localhost:5000/employee/get
//curl -H 'Content-type: application/json' -d '{"get":["kar25","asw5"]}' -X GET http://localhost:5000/employee/get/multiple

app.get("/employee/get/:id", async (req, res) => {
  try {
    const employee = await getEmployeeById(req.params.id);
    res.json(employee);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -X GET http://localhost:5000/employee/get/kar25

app.get("/employee/timetable/get/:id", async (req, res) => {
  try {
    const timetable = await getEmployeeSchedule(req.params.id);
    console.log(timetable);
    res.json(timetable);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -X GET http://localhost:5000/employee/timetable/get/kar25



// Branch Routes
app.post("/branch/create", async (req, res) => {
  try {
    const branch = await createBranch(req.body);
    res.status(201).json(branch);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -H 'Content-Type: application/json'  -d '{"branch_id":"CME","name":"computer science"}' -X POST http://localhost:5000/branch/create

app.post("/branch/edit/:id", async (req, res) => {
  try {
    const branch = await editBranch(req.params.id, req.body);
    res.json(branch);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -H 'Content-Type: application/json'  -d '{"name":"computer science and engg"}' -X POST http://localhost:5000/branch/edit/CME

app.delete("/branch/delete/:id", async (req, res) => {
  try {
    await deleteBranch(req.params.id);
    res.status(201).json({ result: "success" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -X DELETE http://localhost:5000/branch/delete/CME

app.get("/branch/get_simple", async (req, res) => {
  try {
    const branches = await getBranches_simple(req.query);
    res.json(branches);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -X GET http://localhost:5000/branch/get_simple

app.all("/branch/get", async (req, res) => {
  try {
    let branches;
    if (req.body.get) {
      branches = await getBranches({ branch_id: { $in: req.body.get } });
    } else {
      branches = await getBranches(req.query);
    }
    res.json(branches);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -X GET http://localhost:5000/branch/get

app.get("/branch/get/:id", async (req, res) => {
  try {
    const branch = await getBranchById(req.params.id);
    res.json(branch);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -X GET http://localhost:5000/branch/get/CME

//branch-codes

app.post("/branchcode/create", async (req, res) => {
  try {
    const branch = await createBranchCode(req.body);
    res.status(201).json(branch);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -H 'Content-Type: application/json'  -d '{"branch_code":"CME","name":"computer science"}' -X POST http://localhost:5000/branchcode/create

app.post("/branchcode/edit/:id", async (req, res) => {
  try {
    const branch = await editBranchCode(req.params.id, req.body);
    res.json(branch);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -H 'Content-Type: application/json'  -d '{"name":"computer science and engg"}' -X POST http://localhost:5000/branchcode/edit/CME

app.delete("/branchcode/delete/:id", async (req, res) => {
  try {
    await deleteBranchCode(req.params.id);
    res.status(201).json({ result: "success" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -X DELETE http://localhost:5000/branchcode/delete/CME

app.all("/branchcode/get", async (req, res) => {
  try {
    let branchcodes;
    if (req.body.get) {
      branchcodes = await getBranchCodes({
        branch_code: { $in: req.body.get },
      });
    } else {
      branchcodes = await getBranchCodes(req.query);
    }
    res.json(branchcodes);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -X GET http://localhost:5000/branchcode/get

app.get("/branchcode/get/:id", async (req, res) => {
  try {
    const branchcode = await getBranchCodeById(req.params.id);
    res.json(branchcode);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -X GET http://localhost:5000/branchcode/get/CME

// Section Routes (nested within Branch)
app.post("/branch/:branch_id/section/create", async (req, res) => {
  try {
    const section = await createSection(req.params.branch_id, req.body);
    res.status(201).json(section);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -H 'Content-Type: application/json'  -d '{"sec_id":"CSE_A","name":"section a"}' -X POST http://localhost:5000/branch/CME/section/create

app.post("/branch/:branch_id/section/edit/:id", async (req, res) => {
  try {
    const section = await editSection(
      req.params.branch_id,
      req.params.id,
      req.body
    );
    res.json(section);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -H 'Content-Type: application/json'  -d '{"name":"section-b"}' -X POST http://localhost:5000/branch/CME/section/edit/CSE_B

app.delete("/branch/:branch_id/section/delete/:id", async (req, res) => {
  try {
    await deleteSection(req.params.branch_id, req.params.id);
    res.status(201).json({ result: "success" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -X DELETE  http://localhost:5000/branch/CME/section/delete/CSE_B

// Timetable Routes (nested within Section)
app.get(
  "/branch/:branch_id/section/:section_id/timetable/get",
  async (req, res) => {
    try {
      const timetable = await getSectionTimetable(
        req.params.branch_id,
        req.params.section_id
      );
      res.json(timetable);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
// curl  -X GET http://localhost:5000/branch/CME/section/CSE_A/timetable/get

app.post(
  "/branch/:branch_id/section/:section_id/timetable/edit",
  async (req, res) => {
    try {
      const timetable = await editSectionTimetable(
        req.params.branch_id,
        req.params.section_id,
        req.body.timetable
      );
      res.json(timetable);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

// curl -H 'Content-Type: application/json'  -d '{"timetable":{"MON":["ml","ds","ml","ds","ml","ds","ml","ds"],"TUE":["ml","ds","ml","ds","ml","ds","ml","ds"],"WED":["ml","ds","ml","ds","ml","ds","ml","ds"],"THU":["ml","ds","ml","ds","ml","ds","ml","ds"],"FRI":["ml","ds","ml","ds","ml","ds","ml","ds"],"SAT":["ml","ds","ml","ds","ml","ds","ml","ds"]}}' -X POST http://localhost:5000/branch/CME/section/CSE_A/timetable/edit

app.delete(
  "/branch/:branch_id/section/:section_id/timetable/delete",
  async (req, res) => {
    try {
      await deleteSectionTimetable(req.params.branch_id, req.params.section_id);
      res.status(201).json({ result: "success" });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -X DELETE http://localhost:5000/branch/CME/section/CSE_A/timetable/delete"

app.all("/subject/get", async (req, res) => {
  try {
    let subjects;
    if (req.body.get) {
      subjects = await getSubjects({ subject_id: { $in: req.body.get } });
    } else {
      subjects = await getSubjects(req.query);
    }
    res.json(subjects);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl  -X GET  http://localhost:5000/subject/get
app.get("/subject/get/:id", async (req, res) => {
  try {
    const subject = await getSubjectById(req.params.id);
    res.json(subject);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl  -X GET  http://localhost:5000/subject/get/ml
app.post("/subject/create", async (req, res) => {
  try {
    const subject = await createSubject(req.body);
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -H 'Content-Type: application/json'  -d '{"subject_id":"ml","name":"machine learning"}' -X POST http://localhost:5000/subject/create

app.post("/subject/edit/:id", async (req, res) => {
  try {
    console.log(req.body)
    const subject = await editSubject(req.params.id, req.body);
    res.json(subject);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -H 'Content-Type: application/json'  -d '{"name":"machine learning(edit)"}' -X POST http://localhost:5000/subject/edit/ml

app.delete("/subject/delete/:id", async (req, res) => {
  try {
    await deleteSubject(req.params.id); 
    res.status(201).json({ result: "success" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -X DELETE http://localhost:5000/subject/delete/ml

// EmpRelation Routes

app.all("/relation/get", async (req, res) => {
  try {
    let relations;
    let opt = {};
    if (req.body.get) {
      if (req.body.get.emp_id) opt.emp_id = { $in: req.body.get.emp_id };
      if (req.body.get.branch_id)
        opt.branch_id = { $in: req.body.get.branch_id };
      if (req.body.get.sec_id) opt.sec_id = { $in: req.body.get.sec_id };
      if (req.body.get.subject_id)
        opt.subject_id = { $in: req.body.get.subject_id };

      relations = await getEmpRelations(opt);
    } else {
      relations = await getEmpRelations(req.query);
    }
    res.json(relations);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -X GET http://localhost:5000/relation/get/
//curl -H 'Content-Type: application/json'  -d '{"get":{"emp_id":["kar25"],"branch_id":["CME-I"],"sec_id":["CSE_A"]}}' -X GET http://localhost:5000/relation/get

app.get("/relation/get/:id", async (req, res) => {
  try {
    const relation = await getEmpRelationBy_Id(req.params.id);
    res.json(relation);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -X GET http://localhost:5000/relation/get/6672fd9940f69aafec555134

app.post("/relation/create", async (req, res) => {
  try {
    const relation = await createEmpRelation(req.body);
    res.status(201).json(relation);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -H 'Content-type: application/json' -d '{"emp_id":"kar25","branch_id":"CSM","sec_id":"CSE_A","subject_id":"ml"}' -X POST http://localhost:5000/relation/create

app.post("/relation/edit/:id", async (req, res) => {
  try {
    const relation = await editEmpRelation(req.params.id, req.body);
    res.json(relation);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -H 'Content-type: application/json' -d '{"emp_id":"asw5","branch_id":"CSM","sec_id":"CSE_A","subject_id":"ml"}' -X POST http://localhost:5000/relation/edit/curl -X GET http://localhost:5000/relation/get/6672fd9940f69aafec555134

app.delete("/relation/delete/:id", async (req, res) => {
  try {
    await deleteEmpRelation(req.params.id);
    res.status(201).json({ result: "success" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//curl -X DELETE http://localhost:5000/relation/delete/6672fd9940f69aafec555134

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
