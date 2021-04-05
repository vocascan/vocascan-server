const { LanguagePackage, Group, VocabularyCard } = require('../../database');
const { formatSequelizeError, getStatusCode } = require('../utils/error.js');

async function getNumberOfLanguagePackages(userId) {
  try {
    const number = await LanguagePackage.count({
      where: {
        userId,
      },
    });
    return [null, number];
  } catch (err) {
    const error = formatSequelizeError(err);

    if (error) {
      return { status: getStatusCode(error), ...error };
    }
    return [null];
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
    return [null, number];
  } catch (err) {
    const error = formatSequelizeError(err);

    if (error) {
      return { status: getStatusCode(error), ...error };
    }
    return [null];
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
    return [null, number];
  } catch (err) {
    const error = formatSequelizeError(err);

    if (error) {
      return { status: getStatusCode(error), ...error };
    }
    return [null];
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
    return [null, number];
  } catch (err) {
    const error = formatSequelizeError(err);

    if (error) {
      return { status: getStatusCode(error), ...error };
    }
    return [null];
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
    return [null, number];
  } catch (err) {
    const error = formatSequelizeError(err);

    if (error) {
      return { status: getStatusCode(error), ...error };
    }
    return [null];
  }
}

module.exports = {
  getNumberOfLanguagePackages,
  getNumberOfActiveGroups,
  getNumberOfInactiveGroups,
  getNumberOfActiveVocabulary,
  getNumberOfInactiveVocabulary,
};
