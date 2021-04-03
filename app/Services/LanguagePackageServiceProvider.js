const { LanguagePackage, Group } = require('../../database');
const { deleteKeysFromObject } = require('../utils');

// create language package
async function createLanguagePackage(
  { name, foreignWordLanguage, translatedWordLanguage, vocabsPerDay, rightWords },
  userId,
  res
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

    return deleteKeysFromObject(['userId', 'createdAt', 'updatedAt'], languagePackage.toJSON());
  } catch {
    res.status(400).end();
    return false;
  }
}

// get language package
async function getLanguagePackages(userId, groups, res) {
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
      res.status(404).end();
      return false;
    }
    return languagePackages;
  } catch {
    res.status(400).end();
    return false;
  }
}

async function destroyLanguagePackage(userId, languagePackageId, res) {
  await LanguagePackage.destroy({
    where: {
      id: languagePackageId,
      userId,
    },
  })
    .then((deletedLanguagePackage) => {
      if (deletedLanguagePackage) {
        return false;
      }
      res.status(404).end();
      return false;
    })
    .catch(() => {
      res.status(400).end();
      return false;
    });
}

async function updateLanguagePackage(package, userId, languagePackageId, res) {
  await LanguagePackage.update(package, {
    fields: ['name', 'foreignWordLanguage', 'translatedWordLanguage', 'vocabsPerDay', 'rightWords'],
    where: {
      id: languagePackageId,
      userId,
    },
  })
    .then((updatedLanguagePackage) => {
      if (updatedLanguagePackage[0]) {
        return false;
      }
      res.status(404).end();
      return false;
    })
    .catch(() => {
      res.status(400).end();
      return false;
    });
}

module.exports = {
  createLanguagePackage,
  getLanguagePackages,
  destroyLanguagePackage,
  updateLanguagePackage,
};
