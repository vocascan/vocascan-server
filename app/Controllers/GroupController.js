const { createGroup, getGroups, destroyGroup } = require('../Services/GroupServiceProvider.js');

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
  const userId = req.user.id;
  const { groupId } = req.params;

  destroyGroup(userId, groupId);

  res.sendStatus(200);
}

module.exports = {
  addGroup,
  sendGroups,
  deleteGroup,
};
