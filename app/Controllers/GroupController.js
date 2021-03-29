const { createGroup, getGroups, destroyGroup } = require('../Services/GroupServiceProvider.js');

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
  const userId = req.user.id;
  const { groupId } = req.params;

  await destroyGroup(userId, groupId);

  res.status(204).end();
}

module.exports = {
  addGroup,
  sendGroups,
  deleteGroup,
};
