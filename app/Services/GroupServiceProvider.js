const { Group } = require('../../database');

// create language package
async function createGroup({ name, active }, userId, languagePackageId, res) {
  const group = await Group.create({
    userId: userId,
    languagePackageId: languagePackageId,
    name: name,
    active: active,
  });

  if (!group) {
    res.status(400).end();
    return false;
  }

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

async function destroyGroup(userId, groupId, res) {
  const group = await Group.findOne({
    where: {
      id: groupId,
      userId,
    },
  });

  if (!group) {
    res.status(404).end();
    return false;
  }

  await group.destroy();
  return false;
}

async function updateGroup({ name, active }, userId, groupId, res) {
  const group = await Group.findOne({
    where: {
      userId,
      id: groupId,
    },
  });

  if (!group) {
    res.status(404).end();
    return false;
  }

  group.name = name;
  group.active = active;

  await group.save();

  return group;
}

module.exports = {
  createGroup,
  getGroups,
  destroyGroup,
  updateGroup,
};
