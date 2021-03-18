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
      userId: userId
    },
  });

  if (!languagePackages) {
    res.status(404).end();
    return false;
  }

  return languagePackages;
}

module.exports = {
  createLanguagePackage,
  getLanguagePackages
};
