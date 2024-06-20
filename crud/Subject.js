const { Subject } = require("./../models");

async function createSubject(data) {
  const subject = new Subject(data);
  await subject.save();
  return subject;
}

async function editSubject(id, data) {
  const subject = await Subject.findByIdAndUpdate(id, data, { new: true });
  return subject;
}

async function deleteSubject(id) {
  await Subject.findByIdAndDelete(id);
}

async function getSubjects(query) {
  const subjects = await Subject.find(query);
  return subjects;
}

async function getSubjectById(id) {
  const sub__ = await Subject.findOne({ subject_id: id });
  const subject = await Subject.findById(sub__._id);
  return subject;
}

async function getSubjectBy_Id(id) {
  const subject = await Subject.findById(id);
  return subject;
}

module.exports = {
  createSubject,
  editSubject,
  deleteSubject,
  getSubjects,
  getSubjectById,
};
