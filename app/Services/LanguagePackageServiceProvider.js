const { LanguagePackage, Group } = require('../../database');
const { deleteKeysFromObject } = require('../utils');

// create language package
async function createLanguagePackage(
  { name, foreignWordLanguage, translatedWordLanguage, vocabsPerDay, rightWords },
  userId,
  res
) {
  const languagePackage = await LanguagePackage.create({
    userId: userId,
    name: name,
    foreignWordLanguage: foreignWordLanguage,
    translatedWordLanguage: translatedWordLanguage,
    vocabsPerDay: vocabsPerDay,
    rightWords: rightWords,
  });

  if (!languagePackage) {
    res.status(400).end();
    return false;
  }

  return deleteKeysFromObject(['userId', 'createdAt', 'updatedAt'], languagePackage.toJSON());
}

// get language package
async function getLanguagePackages(userId, groups, res) {
  // Get user with email from database
  const languagePackages = await LanguagePackage.findAll({
    include: groups ? [{ model: Group, attributes: ['id', 'name', 'active'] }] : [],
    attributes: ['id', 'name', 'foreignWordLanguage', 'translatedWordLanguage', 'vocabsPerDay', 'rightWords'],
    where: {
      userId: userId,
    },
  });

  if (!languagePackages) {
    res.status(404).end();
    return false;
  }

  return languagePackages;
}

async function destroyLanguagePackage(userId, languagePackageId, res) {
  const languagePackage = await LanguagePackage.findOne({
    where: {
      id: languagePackageId,
      userId,
    },
  });

  if (!languagePackage) {
    res.status(404).end();
    return false;
  }

  await languagePackage.destroy();
  return false;
}

async function updateLanguagePackage(
  { name, foreignWordLanguage, translatedWordLanguage, vocabsPerDay, rightWords },
  userId,
  languagePackageId,
  res
) {
  const languagePackage = await LanguagePackage.findOne({
    where: {
      id: languagePackageId,
      userId,
    },
  });

  if (!languagePackage) {
    res.status(404).end();
    return false;
  }

  languagePackage.name = name;
  languagePackage.foreignWordLanguage = foreignWordLanguage;
  languagePackage.translatedWordLanguage = translatedWordLanguage;
  languagePackage.vocabsPerDay = vocabsPerDay;
  languagePackage.rightWords = rightWords;

  languagePackage.save();

  return deleteKeysFromObject(['userId', 'createdAt', 'updatedAt'], languagePackage.toJSON());
}

module.exports = {
  createLanguagePackage,
  getLanguagePackages,
  destroyLanguagePackage,
  updateLanguagePackage,
};
