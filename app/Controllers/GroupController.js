const { createGroup, getGroups, destroyGroup, updateGroup } = require('../Services/GroupServiceProvider.js');

async function addGroup(req, res) {
  // get userId from request
  const userId = req.user.id;

  // get language package id from params
  const { languagePackageId } = req.params;

  // create language Package
  const group = await createGroup(req.body, userId, languagePackageId);

  res.send(group);
}

async function sendGroups(req, res) {
  // get userId from request
  const userId = req.user.id;

  // get language package id from params
  const { languagePackageId } = req.params;

  // create language Package
  const groups = await getGroups(userId, languagePackageId, res);

  res.send(groups);
}

async function deleteGroup(req, res) {
  // get userId from request
  const { id } = req.user;
  const { groupId } = req.params;

  await destroyGroup(userId, groupId);

  res.status(204).end();
}

async function modifyGroup(req, res) {
  // get userId from request
  const { id } = req.user;
  const { groupId } = req.params;

  const group = await updateGroup(req.body, id, groupId);

  res.send(group);
}

module.exports = {
  addGroup,
  sendGroups,
  deleteGroup,
  modifyGroup,
};
