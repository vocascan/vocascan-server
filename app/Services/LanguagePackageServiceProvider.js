const { LanguagePackage } = require('../../database');

// create language package
async function createLanguagePackage(
  { name, foreignWordLanguage, translatedWordLanguage, vocabsPerDay, rightWords },
  userId
) {
  const languagePackage = await LanguagePackage.create({
    userId: userId,
    name: name,
    foreignWordLanguage: foreignWordLanguage,
    translatedWordLanguage: translatedWordLanguage,
    vocabsPerDay: vocabsPerDay,
    rightWords: rightWords,
  });

  return languagePackage;
}

// get language package
async function getLanguagePackages(userId, res) {
  // Get user with email from database
  const languagePackages = await LanguagePackage.findAll({
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

async function destroyLanguagePackage(userId, languagePackageId) {
  const languagePackage = await LanguagePackage.findOne({
    where: {
      id: languagePackageId,
      userId,
    },
  });

  await languagePackage.destroy();
}

async function updateLanguagePackage(
  { name, foreignWordLanguage, translatedWordLanguage, vocabsPerDay, rightWords },
  userId,
  languagePackageId
) {
  const languagePackage = await LanguagePackage.findOne({
    where: {
      id: languagePackageId,
      userId,
    },
  });

  languagePackage.name = name;
  languagePackage.foreignWordLanguage = foreignWordLanguage;
  languagePackage.translatedWordLanguage = translatedWordLanguage;
  languagePackage.vocabsPerDay = vocabsPerDay;
  languagePackage.rightWords = rightWords;

  languagePackage.save();

  return languagePackage;
}

module.exports = {
  createLanguagePackage,
  getLanguagePackages,
  destroyLanguagePackage,
  updateLanguagePackage,
};
