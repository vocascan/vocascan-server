const { Group } = require('../../database');
const { deleteKeysFromObject } = require('../utils');
const { formatSequelizeError, getStatusCode } = require('../utils/error.js');

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
    const error = formatSequelizeError(err);

    if (error) {
      return { status: getStatusCode(error), ...error };
    }
    return [false];
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
    const error = formatSequelizeError(err);

    if (error) {
      return { status: getStatusCode(error), ...error };
    }
    return [null];
  }
}

async function destroyGroup(userId, groupId) {
  await Group.destroy({
    where: {
      id: groupId,
      userId,
    },
  })
    .then((deletedGroup) => {
      if (deletedGroup) {
        return [null];
      }
      return [{ status: 404, error: 'group not found' }];
    })
    .catch((err) => {
      const error = formatSequelizeError(err);

      if (error) {
        return { status: getStatusCode(error), ...error };
      }
      return [null];
    });
}

async function updateGroup(group, userId, groupId) {
  await Group.update(group, {
    fields: ['name', 'active'],
    where: {
      userId,
      id: groupId,
    },
  })
    .then((updatedGroup) => {
      if (updatedGroup[0]) {
        return [null];
      }
      return [{ status: 404, error: 'group not found' }];
    })
    .catch((err) => {
      const error = formatSequelizeError(err);

      if (error) {
        return { status: getStatusCode(error), ...error };
      }
      return [null];
    });
}

module.exports = {
  createGroup,
  getGroups,
  destroyGroup,
  updateGroup,
};
