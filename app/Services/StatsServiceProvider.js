const { LanguagePackage, Group, VocabularyCard } = require('../../database');
const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status');

async function getNumberOfLanguagePackages(userId) {
  try {
    const number = await LanguagePackage.count({
      where: {
        userId,
      },
    });
    return number;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'bad request');
  }
}

async function getNumberOfActiveGroups(userId) {
  try {
    const number = await Group.count({
      where: {
        userId,
        active: true,
      },
    });
    return number;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'bad request');
  }
}

async function getNumberOfInactiveGroups(userId) {
  try {
    const number = await Group.count({
      where: {
        userId,
        active: false,
      },
    });
    return number;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'bad request');
  }
}

async function getNumberOfActiveVocabulary(userId) {
  try {
    const number = await VocabularyCard.count({
      where: {
        userId,
        active: true,
      },
    });
    return number;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'bad request');
  }
}

async function getNumberOfInactiveVocabulary(userId) {
  try {
    const number = await VocabularyCard.count({
      where: {
        userId,
        active: false,
      },
    });
    return number;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'bad request');
  }
}

module.exports = {
  getNumberOfLanguagePackages,
  getNumberOfActiveGroups,
  getNumberOfInactiveGroups,
  getNumberOfActiveVocabulary,
  getNumberOfInactiveVocabulary,
};
