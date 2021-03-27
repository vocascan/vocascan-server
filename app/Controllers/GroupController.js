const { createGroup, getGroups, destroyGroup, updateGroup } = require('../Services/GroupServiceProvider.js');

async function addGroup(req, res) {
  // get userId from request
  const { id } = req.user;

  // get language package id from params
  const { languagePackageId } = req.params;

  // create language Package
  const group = await createGroup(req.body, id, languagePackageId);

  res.send(group);
}

async function sendGroups(req, res) {
  // get userId from request
  const { id } = req.user;

  // get language package id from params
  const { languagePackageId } = req.params;

  // create language Package
  const groups = await getGroups(id, languagePackageId, res);

  res.send(groups);
}

async function deleteGroup(req, res) {
  // get userId from request
  const { id } = req.user;
  const { groupId } = req.params;

  destroyGroup(id, groupId);

  res.sendStatus(200);
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
