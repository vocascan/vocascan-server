const { createLanguagePackage, getLanguagePackages } = require('../Services/LanguagePackageServiceProvider.js');
const { createDrawers } = require('../Services/DrawerServiceProvider.js');
const { drawers } = require('../utils/constants.js');
const {
  getNumberOfUnresolvedVocabulary,
  getNumberOfUnactivatedVocabulary,
} = require('../Services/QueryServiceProvider.js');

async function addLanguagePackage(req, res) {
  // get userId from request
  const { id } = await req.user;

  // create language Package
  const languagePackage = await createLanguagePackage(req.body, id);

  // store drawers for language package in database

  await createDrawers(drawers, languagePackage.id, id);

  res.send(languagePackage);
}

async function sendLanguagePackages(req, res) {
  // get userId from request
  const { id } = await req.user;

  // get language Package
  const languagePackages = await getLanguagePackages(id, res);

  const formatted = await Promise.all(
    languagePackages.map(async (languagePackage) => ({
      unresolvedVocabularies: await getNumberOfUnresolvedVocabulary(languagePackage.id, id),

      // add number of unactivated vocabularies
      unactivatedVocabularies: await getNumberOfUnactivatedVocabulary(languagePackage.id, id),

      ...languagePackage.toJSON(),
    }))
  );

  res.send(formatted);
}

module.exports = {
  addLanguagePackage,
  sendLanguagePackages,
};
