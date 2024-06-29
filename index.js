// File: index.js

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

const {
  login,
  addAdminLogin,
  addViewerLogin,
  deleteUser,
} = require("./auth/Auth");

const {
  createOrgWithAdminCred,
  editOrg,
  deleteOrgForever,
} = require("./org/Org");

const {
  authenticate,
  authorize,
  checkOrganization,
  getAuthOf,
} = require("./auth/SessionAuth");

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGO_CON_STRING, {
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

//auth
app.post("/auth/login", async (req, res) => {
  try {
    console.log(req.body);
    const result__ = await login(req.body.username, req.body.password);
    res.status(201).json(result__);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});
//jwt
app.post("/auth/login/jwt", [authenticate], (req, res) => {
  // If token is valid, send back user data or a message
  res.json({ message: "Token verified", user: req.user });
});

app.post(
  "/auth/addAdmin",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      console.log(req.body);
      const result__ = await addAdminLogin(req.body, req.organization._id);
      res.status(201).json(result__);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
app.post(
  "/auth/addViewer",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      console.log(req.body);
      const result__ = await addViewerLogin(req.body, req.organization._id);
      res.status(201).json(result__);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
app.delete(
  "/auth/admin/delete",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      console.log(req.body);
      const result__ = await deleteUser(req.user);
      res.status(201).json(result__);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

app.delete(
  "/auth/admin/delete/viewer",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      console.log(req.body);
      const viewer = await getAuthOf(req.body.viewer_id);
      if (!viewer) {
        return res.status(401).json({ msg: "User not found" });
      }
      if (viewer.organization._id != admin.organization._id) {
        return res.status(403).json({ msg: "User belongs to other org" });
      }
      const result__ = await deleteUser(req.body.viewer_id);
      res.status(201).json(result__);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

app.delete(
  "/auth/user/delete",
  [authenticate, authorize("viewer"), checkOrganization],
  async (req, res) => {
    try {
      console.log(req.body);
      const result__ = await deleteUser(req.user);
      res.status(201).json(result__);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

//organization
app.post(
  "/organization/create",
  [authenticate, authorize("governer")],
  async (req, res) => {
    try {
      const organization = await createOrgWithAdminCred(req.body);
      res.status(201).json(organization);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Server error", error });
    }
  }
);
// curl -H 'Content-Type: application/json'  -d '{"name":"no_name","org_id":"nothing","admin_username":"karthikkrazy","admin_password":"iloveqwertyA@123"}' -X POST http://localhost:5000/organization/create

// Route to edit an organization
app.post(
  "/organization/edit/:id",
  authenticate,
  authorize("governer"),
  async (req, res) => {
    try {
      const organization = await editOrg(req.params.id, req.body);
      res.status(200).json(organization);
    } catch (error) {
      res.status(500).json({ msg: "Server error", error });
    }
  }
);

// Route to delete an organization forever
app.delete(
  "/organization/delete/:id",
  authenticate,
  authorize("governer"),
  async (req, res) => {
    try {
      await deleteOrgForever(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ msg: "Server error", error });
    }
  }
);

// Employee Routes
app.post(
  "/employee/create",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      console.log(req.body);
      const employee = await createEmployee(req.body);
      res.status(201).json(employee);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
// curl -H 'Content-Type: application/json'  -d '{"name":"GOPAR","emp_id":"kar25"}' -X POST http://localhost:5000/employee/create
app.post(
  "/employee/edit/:id",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      const employee = await editEmployee(req.params.id, req.body);
      res.json(employee);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
// curl -H 'Content-Type: application/json'  -d '{"name":"GOPARAJU KARTHIK 2 "}' -X POST http://localhost:5000/employee/edit/kar25
app.delete(
  "/employee/delete/:id",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      await deleteEmployee(req.params.id);
      res.status(201).json({ result: "success" });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -X DELETE http://localhost:5000/employee/delete/kar25
app.all(
  "/employee/get",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
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
  }
);
//curl -X GET http://localhost:5000/employee/get
//curl -H 'Content-type: application/json' -d '{"get":["kar25","asw5"]}' -X GET http://localhost:5000/employee/get/multiple

app.get(
  "/employee/get/:id",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      const employee = await getEmployeeById(req.params.id);
      res.json(employee);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -X GET http://localhost:5000/employee/get/kar25

app.get(
  "/employee/timetable/get/:id",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      const timetable = await getEmployeeSchedule(req.params.id);
      console.log(timetable);
      res.json(timetable);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -X GET http://localhost:5000/employee/timetable/get/kar25

// Branch Routes
app.post(
  "/branch/create",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      const branch = await createBranch(req.body);
      res.status(201).json(branch);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -H 'Content-Type: application/json'  -d '{"branch_id":"CME","name":"computer science"}' -X POST http://localhost:5000/branch/create

app.post(
  "/branch/edit/:id",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      const branch = await editBranch(req.params.id, req.body);
      res.json(branch);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -H 'Content-Type: application/json'  -d '{"name":"computer science and engg"}' -X POST http://localhost:5000/branch/edit/CME

app.delete(
  "/branch/delete/:id",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      await deleteBranch(req.params.id);
      res.status(201).json({ result: "success" });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -X DELETE http://localhost:5000/branch/delete/CME

app.get(
  "/branch/get_simple",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      const branches = await getBranches_simple(req.query);
      res.json(branches);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -X GET http://localhost:5000/branch/get_simple

app.all(
  "/branch/get",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
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
  }
);
//curl -X GET http://localhost:5000/branch/get

app.get(
  "/branch/get/:id",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      const branch = await getBranchById(req.params.id);
      res.json(branch);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -X GET http://localhost:5000/branch/get/CME

//branch-codes

app.post(
  "/branchcode/create",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      const branch = await createBranchCode(req.body);
      res.status(201).json(branch);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -H 'Content-Type: application/json'  -d '{"branch_code":"CME","name":"computer science"}' -X POST http://localhost:5000/branchcode/create

app.post(
  "/branchcode/edit/:id",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      const branch = await editBranchCode(req.params.id, req.body);
      res.json(branch);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -H 'Content-Type: application/json'  -d '{"name":"computer science and engg"}' -X POST http://localhost:5000/branchcode/edit/CME

app.delete(
  "/branchcode/delete/:id",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      await deleteBranchCode(req.params.id);
      res.status(201).json({ result: "success" });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -X DELETE http://localhost:5000/branchcode/delete/CME

app.all(
  "/branchcode/get",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
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
  }
);
//curl -X GET http://localhost:5000/branchcode/get

app.get(
  "/branchcode/get/:id",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      const branchcode = await getBranchCodeById(req.params.id);
      res.json(branchcode);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -X GET http://localhost:5000/branchcode/get/CME

// Section Routes (nested within Branch)
app.post(
  "/branch/:branch_id/section/create",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      const section = await createSection(req.params.branch_id, req.body);
      res.status(201).json(section);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -H 'Content-Type: application/json'  -d '{"sec_id":"CSE_A","name":"section a"}' -X POST http://localhost:5000/branch/CME/section/create

app.post(
  "/branch/:branch_id/section/edit/:id",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
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
  }
);
//curl -H 'Content-Type: application/json'  -d '{"name":"section-b"}' -X POST http://localhost:5000/branch/CME/section/edit/CSE_B

app.delete(
  "/branch/:branch_id/section/delete/:id",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      await deleteSection(req.params.branch_id, req.params.id);
      res.status(201).json({ result: "success" });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -X DELETE  http://localhost:5000/branch/CME/section/delete/CSE_B

// Timetable Routes (nested within Section)
app.get(
  "/branch/:branch_id/section/:section_id/timetable/get",
  [authenticate, authorize("admin"), checkOrganization],
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
  [authenticate, authorize("admin"), checkOrganization],
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
  [authenticate, authorize("admin"), checkOrganization],
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

app.all(
  "/subject/get",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
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
  }
);
//curl  -X GET  http://localhost:5000/subject/get
app.get(
  "/subject/get/:id",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      const subject = await getSubjectById(req.params.id);
      res.json(subject);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl  -X GET  http://localhost:5000/subject/get/ml
app.post(
  "/subject/create",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      const subject = await createSubject(req.body);
      res.status(201).json(subject);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -H 'Content-Type: application/json'  -d '{"subject_id":"ml","name":"machine learning"}' -X POST http://localhost:5000/subject/create

app.post(
  "/subject/edit/:id",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      console.log(req.body);
      const subject = await editSubject(req.params.id, req.body);
      res.json(subject);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -H 'Content-Type: application/json'  -d '{"name":"machine learning(edit)"}' -X POST http://localhost:5000/subject/edit/ml

app.delete(
  "/subject/delete/:id",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      await deleteSubject(req.params.id);
      res.status(201).json({ result: "success" });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -X DELETE http://localhost:5000/subject/delete/ml

// EmpRelation Routes

app.all(
  "/relation/get",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
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
  }
);
//curl -X GET http://localhost:5000/relation/get/
//curl -H 'Content-Type: application/json'  -d '{"get":{"emp_id":["kar25"],"branch_id":["CME-I"],"sec_id":["CSE_A"]}}' -X GET http://localhost:5000/relation/get

app.get(
  "/relation/get/:id",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      const relation = await getEmpRelationBy_Id(req.params.id);
      res.json(relation);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -X GET http://localhost:5000/relation/get/6672fd9940f69aafec555134

app.post(
  "/relation/create",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      const relation = await createEmpRelation(req.body);
      res.status(201).json(relation);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -H 'Content-type: application/json' -d '{"emp_id":"kar25","branch_id":"CSM","sec_id":"CSE_A","subject_id":"ml"}' -X POST http://localhost:5000/relation/create

app.post(
  "/relation/edit/:id",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      const relation = await editEmpRelation(req.params.id, req.body);
      res.json(relation);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -H 'Content-type: application/json' -d '{"emp_id":"asw5","branch_id":"CSM","sec_id":"CSE_A","subject_id":"ml"}' -X POST http://localhost:5000/relation/edit/curl -X GET http://localhost:5000/relation/get/6672fd9940f69aafec555134

app.delete(
  "/relation/delete/:id",
  [authenticate, authorize("admin"), checkOrganization],
  async (req, res) => {
    try {
      await deleteEmpRelation(req.params.id);
      res.status(201).json({ result: "success" });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
//curl -X DELETE http://localhost:5000/relation/delete/6672fd9940f69aafec555134

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
