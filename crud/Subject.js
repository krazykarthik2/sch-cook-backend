const { Subject } = require("./../models");

async function createSubject(org_id, data) {
  const subject = new Subject({ ...data, organization: org_id });
  await subject.save();
  return subject;
}

async function editSubject(org_id, id, data) {
  const subject = await Subject.findOneAndUpdate(
    { subject_id: id, organization: org_id },
    data,
    { new: true }
  );
  return subject;
}

async function deleteSubject(org_id, id) {
  await Subject.findOneAndDelete({ subject_id: id, organization: org_id });
}

async function getSubjects(org_id, query) {
  const subjects = await Subject.find({ ...query, organization: org_id });
  return subjects;
}

async function getSubjectById(org_id, id) {
  const sub__ = await Subject.findOne({ subject_id: id, organization: org_id });
  const subject = await Subject.findById(sub__._id);
  return subject;
}

async function getSubjectBy_Id(org_id, id) {
  const subject = await Subject.findById(id);
  if (subject.organization == org_id) return subject;
  else throw new Error("Subject belongs to another organization");
}

module.exports = {
  createSubject,
  editSubject,
  deleteSubject,
  getSubjects,
  getSubjectById,
};
