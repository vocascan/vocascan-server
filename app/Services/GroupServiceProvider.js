const { Group } = require('../../database');
const { deleteKeysFromObject } = require('../utils');

// create language package
async function createGroup({ name, active }, userId, languagePackageId) {
  try {
    const group = await Group.create({
      userId,
      languagePackageId,
      name,
      active,
    });
    return [null, deleteKeysFromObject(['userId', 'createdAt', 'updatedAt'], group.toJSON())];
  } catch (err) {
    return [{ status: 400, error: err.message }];
  }
}

// get groups
async function getGroups(userId, languagePackageId) {
  // Get user with email from database
  try {
    const groups = await Group.findAll({
      attributes: ['id', 'name', 'active'],
      where: {
        userId,
        languagePackageId,
      },
    });

    return [null, groups];
  } catch (err) {
    return [{ status: 400, error: err.message }];
  }
}

async function destroyGroup(userId, groupId) {
  try {
    const counter = await Group.destroy({
      where: {
        id: groupId,
        userId,
      },
    });

    if (counter === 0) {
      return [{ status: 404, error: 'group not found' }];
    }

    return [null];
  } catch (err) {
    return [{ status: 400, error: err.message }];
  }
}

async function updateGroup(group, userId, groupId) {
  try {
    const counter = await Group.update(group, {
      fields: ['name', 'active'],
      where: {
        userId,
        id: groupId,
      },
    });
    if (counter[0] === 0) {
      return [{ status: 404, error: 'group not found' }];
    }
    return [null];
  } catch (err) {
    return [{ status: 400, error: err.message }];
  }
}

module.exports = {
  createGroup,
  getGroups,
  destroyGroup,
  updateGroup,
};
