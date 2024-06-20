const { getBranchById } = require("./Branch");
const { Employee } = require("./../models");
const { getEmpRelations, getEmpRelationsQuery } = require("./EmployeeRelation");

// Employee Functions

async function createEmployee(data) {
  const employee = new Employee(data);
  await employee.save();
  return employee;
}

async function editEmployee(id, data) {
  const emp_ = await getEmployeeById(id);
  const employee = await Employee.findByIdAndUpdate(emp_._id, data, {
    new: true,
  });
  return employee;
}

async function deleteEmployee(id) {
  const emp_ = await getEmployeeById(id);
  await Employee.findByIdAndDelete(emp_._id);
}

async function getEmployees(query) {
  const employees = await Employee.find(query);
  return employees;
}

async function getEmployeeById(id) {
  const employee = await Employee.findOne({ emp_id: id });
  return employee;
}
async function getEmployeeBy_Id(id) {
  const employee = await Employee.findById(id);
  return employee;
}
async function getEmployeeSchedule(emp_id) {
  const relations = await getEmpRelationsQuery({ emp_id: emp_id });

  const schedule = {};
  for (const relation of relations) {
    const branch = await getBranchById(relation.branch_id);
    if (branch) {
      const section = branch.sections.find(
        (sec) => sec.sec_id === relation.sec_id
      );
      if (section) {
        for (let day of section.timetable.keys()) {
          let periods = section.timetable.get(day);
          if (!schedule[day]) {
            schedule[day] = [];
          }
          periods.forEach((subject, index) => {
            if (subject === relation.subject_id) {
              schedule[day][index] = {
                branch_id: relation.branch_id,
                sec_id: relation.sec_id,
                subject_id: relation.subject_id,
              };
            } else {
              //fill in blank data if teacher is idle
              if (!schedule[day][index]) schedule[day][index] = null;
            }
          });
        }
      }
    }
  }
  return schedule;
}

module.exports = {
  createEmployee,
  editEmployee,
  deleteEmployee,
  getEmployees,
  getEmployeeById,
  getEmployeeSchedule,
};
