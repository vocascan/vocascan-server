const { LanguagePackage, Group } = require('../../database');
const { deleteKeysFromObject } = require('../utils');

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
    return [{ status: 400, error: err.message }];
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
    return [{ status: 400, error: err.message }];
  }
}

async function destroyLanguagePackage(userId, languagePackageId) {
  try {
    const counter = await LanguagePackage.destroy({
      where: {
        id: languagePackageId,
        userId,
      },
    });
    if (counter === 0) {
      return [{ status: 404, error: 'language package not found' }];
    }
    return [null];
  } catch (err) {
    return [{ status: 400, error: err.message }];
  }
}

async function updateLanguagePackage(package, userId, languagePackageId) {
  try {
    const counter = await LanguagePackage.update(package, {
      fields: ['name', 'foreignWordLanguage', 'translatedWordLanguage', 'vocabsPerDay', 'rightWords'],
      where: {
        id: languagePackageId,
        userId,
      },
    });
    if (counter[0]) {
      return [{ status: 404, error: 'language package not found' }];
    }
    return [null];
  } catch (err) {
    return [{ status: 400, error: err.message }];
  }
}

module.exports = {
  createLanguagePackage,
  getLanguagePackages,
  destroyLanguagePackage,
  updateLanguagePackage,
};
