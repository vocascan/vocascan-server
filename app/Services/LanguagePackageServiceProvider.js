const { LanguagePackage, Group } = require('../../database');

// create language package
async function createLanguagePackage(
  { name, foreignWordLanguage, translatedWordLanguage, vocabsPerDay, rightWords },
  userId
) {
  const languagePackage = await LanguagePackage.create({
    userId,
    name,
    foreignWordLanguage,
    translatedWordLanguage,
    vocabsPerDay,
    rightWords,
  });

  return languagePackage;
}

// get language package
async function getLanguagePackages(userId, groups, res) {
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
}

async function destroyLanguagePackage(userId, languagePackageId) {
  await LanguagePackage.destroy({
    where: {
      id: languagePackageId,
      userId,
    },
  });
}

async function updateLanguagePackage({ ...package }, userId, languagePackageId) {
  await LanguagePackage.update(package, {
    fields: ['name', 'foreignWordLanguage', 'translatedWordLanguage', 'vocabsPerDay', 'rightWords'],
    where: {
      id: languagePackageId,
      userId,
    },
  });
}

module.exports = {
  createLanguagePackage,
  getLanguagePackages,
  destroyLanguagePackage,
  updateLanguagePackage,
};
