const { getBranchById } = require("./Branch");

// Section Functions (Nested within Branch)

async function createSection(org_id,branch_id, data) {
  const branch = await getBranchById(org_id,branch_id);
  if (branch) {
    branch.sections.push(data);
    await branch.save();
    return branch.sections[branch.sections.length - 1];
  } else {
    throw new Error("Branch not found");
  }
}

async function editSection(org_id,branch_id, section_id, data) {
  const branch = await getBranchById(org_id,branch_id);
  if (branch) {
    const section = branch.sections.find((e) => e.sec_id == section_id);

    if (section) {
      Object.assign(section, data);
      await branch.save();
      return section;
    } else {
      throw new Error("Section not found");
    }
  } else {
    throw new Error("Branch not found");
  }
}

async function deleteSection(org_id,branch_id, section_id) {
  const branch = await getBranchById(org_id,branch_id);
  const __id = branch.sections.find((e) => e.sec_id == section_id)._id;
  if (branch) {
    branch.sections.id(__id).deleteOne();
    await branch.save();
  } else {
    throw new Error("Branch not found");
  }
}

module.exports = {
  createSection,
  editSection,
  deleteSection,
};
