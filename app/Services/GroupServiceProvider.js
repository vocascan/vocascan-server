const { Group } = require('../../database');

// create language package
async function createGroup({ name, active }, userId, languagePackageId) {
  const group = await Group.create({
    userId: userId,
    languagePackageId: languagePackageId,
    name: name,
    active: active,
  });

  return group;
}

// get groups
async function getGroups(userId, languagePackageId, res) {
  // Get user with email from database
  const groups = await Group.findAll({
    attributes: ['id', 'name', 'active'],
    where: {
      userId: userId,
      languagePackageId: languagePackageId,
    },
  });

  if (!groups) {
    res.status(404).end();
    return false;
  }

  return groups;
}

async function destroyGroup(userId, groupId) {
  const group = await Group.findOne({
    where: {
      id: groupId,
      userId,
    },
  });

  await group.destroy();
}

module.exports = {
  createGroup,
  getGroups,
  destroyGroup,
};
