const { LanguagePackage, Group } = require('../../database');
const { deleteKeysFromObject } = require('../utils');
const { formatSequelizeError, getStatusCode } = require('../utils/error.js');

// create language package
async function createLanguagePackage(
  { name, foreignWordLanguage, translatedWordLanguage, vocabsPerDay, rightWords },
  userId
) {
  try {
    const languagePackage = await LanguagePackage.create({
      userId,
      name,
      foreignWordLanguage,
      translatedWordLanguage,
      vocabsPerDay,
      rightWords,
    });

    return [null, deleteKeysFromObject(['userId', 'createdAt', 'updatedAt'], languagePackage.toJSON())];
  } catch (err) {
    const error = formatSequelizeError(err);

    if (error) {
      return { status: getStatusCode(error), ...error };
    }
    return [null];
  }
}

// get language package
async function getLanguagePackages(userId, groups) {
  try {
    // Get user with email from database
    const languagePackages = await LanguagePackage.findAll({
      include: groups ? [{ model: Group, attributes: ['id', 'name', 'active'] }] : [],
      attributes: ['id', 'name', 'foreignWordLanguage', 'translatedWordLanguage', 'vocabsPerDay', 'rightWords'],
      where: {
        userId,
      },
    });

    if (!languagePackages) {
      return [{ status: 404, error: 'language package not found' }];
    }
    return [null, languagePackages];
  } catch (err) {
    const error = formatSequelizeError(err);

    if (error) {
      return { status: getStatusCode(error), ...error };
    }
  }
  return [null];
}

async function destroyLanguagePackage(userId, languagePackageId) {
  await LanguagePackage.destroy({
    where: {
      id: languagePackageId,
      userId,
    },
  })
    .then((deletedLanguagePackage) => {
      if (deletedLanguagePackage) {
        return [null];
      }
      return [{ status: 404, error: 'language package not found' }];
    })
    .catch((err) => {
      const error = formatSequelizeError(err);

      if (error) {
        return { status: getStatusCode(error), ...error };
      }
      return [null];
    });
}

async function updateLanguagePackage(package, userId, languagePackageId) {
  await LanguagePackage.update(package, {
    fields: ['name', 'foreignWordLanguage', 'translatedWordLanguage', 'vocabsPerDay', 'rightWords'],
    where: {
      id: languagePackageId,
      userId,
    },
  })
    .then((updatedLanguagePackage) => {
      if (updatedLanguagePackage[0]) {
        return [null];
      }
      return [{ status: 404, error: 'language package not found' }];
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
  createLanguagePackage,
  getLanguagePackages,
  destroyLanguagePackage,
  updateLanguagePackage,
};
