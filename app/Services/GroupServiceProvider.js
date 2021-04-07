const { Group } = require('../../database');
const { deleteKeysFromObject } = require('../utils');
const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status');

// create language package
async function createGroup({ name, active }, userId, languagePackageId) {
  try {
    const group = await Group.create({
      userId,
      languagePackageId,
      name,
      active,
    });
    return deleteKeysFromObject(['userId', 'createdAt', 'updatedAt'], group.toJSON());
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'bad request');
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

    return groups;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'bad request');
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
      throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
    }

    return false;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'bad request');
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
      throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
    }
    return false;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'bad request');
  }
}

module.exports = {
  createGroup,
  getGroups,
  destroyGroup,
  updateGroup,
};
