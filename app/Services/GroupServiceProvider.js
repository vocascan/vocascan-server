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
      userId,
      languagePackageId,
    },
  });

  if (!groups) {
    res.status(404).end();
    return false;
  }

  return groups;
}

async function destroyGroup(userId, groupId) {
  const group = await Group.destroy({
    where: {
      id: groupId,
      userId,
    },
  });
}

async function updateGroup({ name, active }, userId, groupId) {
  const group = await Group.update(
    { name, active },
    {
      fields: ['name', 'active'],
      where: {
        userId,
        id: groupId,
      },
    }
  );
}

module.exports = {
  createGroup,
  getGroups,
  destroyGroup,
  updateGroup,
};
