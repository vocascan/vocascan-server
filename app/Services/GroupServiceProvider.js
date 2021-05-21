const { LanguagePackage, Group } = require('../../database');
const { deleteKeysFromObject } = require('../utils');
const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status');

// create language package
async function createGroup({ name, description, active }, userId, languagePackageId) {
  const group = await Group.create({
    userId,
    languagePackageId,
    name,
    description,
    active,
  });

  return deleteKeysFromObject(['userId', 'createdAt', 'updatedAt'], group.toJSON());
}

// get groups
async function getGroups(userId, languagePackageId) {
  const languagePackage = await LanguagePackage.count({
    where: {
      id: languagePackageId,
      userId,
    },
  });

  if (languagePackage === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'no groups found, because the language package does not exist');
  }

  const groups = await Group.findAll({
    attributes: ['id', 'name', 'description', 'active'],
    where: {
      userId,
      languagePackageId,
    },
  });

  return groups;
}

async function destroyGroup(userId, groupId) {
  const counter = await Group.destroy({
    where: {
      id: groupId,
      userId,
    },
  });

  if (counter === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Group not found', 'group');
  }

  return false;
}

async function updateGroup(group, userId, groupId) {
  const counter = await Group.update(group, {
    fields: ['name', 'description', 'active'],
    where: {
      userId,
      id: groupId,
    },
  });

  if (counter[0] === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Group not found', 'group');
  }
  return false;
}

module.exports = {
  createGroup,
  getGroups,
  destroyGroup,
  updateGroup,
};
