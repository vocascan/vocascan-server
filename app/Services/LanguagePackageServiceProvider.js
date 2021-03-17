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

module.exports = {
  createLanguagePackage,
};
