const { createGroup, getGroups, destroyGroup, updateGroup } = require('../Services/GroupServiceProvider.js');

async function addGroup(req, res) {
  try {
    // get userId from request
    const userId = req.user.id;

    // get language package id from params
    const { languagePackageId } = req.params;

    // create language Package
    const group = await createGroup(req.body, userId, languagePackageId, res);

    res.send(group);
  } catch (e) {
    console.log(e.message);
    res.status(500).end();
  }
}

async function sendGroups(req, res) {
  try {
    // get userId from request
    const userId = req.user.id;

    // get language package id from params
    const { languagePackageId } = req.params;

    // create language Package
    const groups = await getGroups(userId, languagePackageId, res);

    res.send(groups);
  } catch (e) {
    console.log(e.message);
    res.status(500).end();
  }
}

async function deleteGroup(req, res) {
  try {
    // get userId from request
    const userId = req.user.id;
    const { groupId } = req.params;

    await destroyGroup(userId, groupId, res);

    res.status(204).end();
  } catch (e) {
    console.log(e.message);
    res.status(500).end();
  }
}

async function modifyGroup(req, res) {
  try {
    // get userId from request
    const userId = req.user.id;
    const { groupId } = req.params;

    await updateGroup(req.body, userId, groupId, res);

    res.status(204).end();
  } catch (e) {
    console.log(e.message);
    res.status(500).end();
  }
}

module.exports = {
  addGroup,
  sendGroups,
  deleteGroup,
  modifyGroup,
};
