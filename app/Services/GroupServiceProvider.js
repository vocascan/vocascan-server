const { Group } = require('../../database');
const { deleteKeysFromObject } = require('../utils');

// create language package
async function createGroup({ name, active }, userId, languagePackageId, res) {
  try {
    const group = await Group.create({
      userId,
      languagePackageId,
      name,
      active,
    });
    return deleteKeysFromObject(['userId', 'createdAt', 'updatedAt'], group.toJSON());
  } catch {
    res.status(400).end();
    return false;
  }
}

// get groups
async function getGroups(userId, languagePackageId, res) {
  // Get user with email from database
  try {
    const groups = await Group.findAll({
      attributes: ['id', 'name', 'active'],
      where: {
        userId,
        languagePackageId,
      },
    });

    return groups;
  } catch {
    res.status(400).end();
    return false;
  }
}

async function destroyGroup(userId, groupId, res) {
  await Group.destroy({
    where: {
      id: groupId,
      userId,
    },
  })
    .then((deletedGroup) => {
      if (deletedGroup) {
        return false;
      }
      res.status(404).end();
      return false;
    })
    .catch(() => {
      res.status(400).end();
    });
  return false;
}

async function updateGroup(group, userId, groupId, res) {
  await Group.update(group, {
    fields: ['name', 'active'],
    where: {
      userId,
      id: groupId,
    },
  })
    .then((updatedGroup) => {
      if (updatedGroup[0]) {
        return false;
      }
      res.status(404).end();
      return false;
    })
    .catch(() => {
      res.status(400).end();
    });
}

module.exports = {
  createGroup,
  getGroups,
  destroyGroup,
  updateGroup,
};
