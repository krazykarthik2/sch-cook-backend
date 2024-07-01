const { getBranchById } = require("./Branch");

// Timetable Functions (Nested within Section)

async function getSectionTimetable(org_id,branch_id, section_id) {
  const branch = await getBranchById(org_id,branch_id);
  const sec__ = branch.sections.find((e) => e.sec_id == section_id);
  if (branch) {
    const section = branch.sections.id(sec__._id);
    if (section) {
      return section.timetable || {};
    } else {
      throw new Error("Section not found");
    }
  } else {
    throw new Error("Branch not found");
  }
}

async function editSectionTimetable(org_id,branch_id, section_id, timetable) {
  const branch = await getBranchById(org_id,branch_id);
  const sec__ = branch.sections.find((e) => e.sec_id == section_id);
  if (branch) {
    const section = branch.sections.id(sec__._id);
    if (section) {
      section.timetable = timetable;
      await branch.save();
      return section.timetable;
    } else {
      throw new Error("Section not found");
    }
  } else {
    throw new Error("Branch not found");
  }
}

async function deleteSectionTimetable(org_id,branch_id, section_id) {
  const branch = await getBranchById(org_id,branch_id);
  const sec__ = branch.sections.find((e) => e.sec_id == section_id);
  if (branch) {
    const section = branch.sections.id(sec__._id);
    if (section) {
      section.timetable = undefined;

      await branch.save();
    } else {
      throw new Error("Section not found");
    }
  } else {
    throw new Error("Branch not found");
  }
}

module.exports = {
  getSectionTimetable,
  editSectionTimetable,
  deleteSectionTimetable,
};
