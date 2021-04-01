const {
  createLanguagePackage,
  getLanguagePackages,
  destroyLanguagePackage,
  updateLanguagePackage,
} = require('../Services/LanguagePackageServiceProvider.js');
const { createDrawers } = require('../Services/DrawerServiceProvider.js');
const { drawers } = require('../utils/constants.js');
const {
  getNumberOfUnresolvedVocabulary,
  getNumberOfUnactivatedVocabulary,
} = require('../Services/QueryServiceProvider.js');

async function addLanguagePackage(req, res) {
  // get userId from request
  const userId = req.user.id;

  // create language Package
  const languagePackage = await createLanguagePackage(req.body, userId);

  // store drawers for language package in database

  await createDrawers(drawers, languagePackage.id, userId);

  res.send(languagePackage);
}

async function sendLanguagePackages(req, res) {
  // get userId from request
  const userId = req.user.id;
  const groups = req.query.groups || false;

  // get language Package
  const languagePackages = await getLanguagePackages(userId, groups, res);

  // if groups is true, return groups to every language package
  const formatted = await Promise.all(
    languagePackages.map(async (languagePackage) => ({
      unresolvedVocabularies: await getNumberOfUnresolvedVocabulary(languagePackage.id, userId),

      // add number of unactivated vocabularies
      unactivatedVocabularies: await getNumberOfUnactivatedVocabulary(languagePackage.id, userId),

      ...languagePackage.toJSON(),
    }))
  );

  res.send(formatted);
}

async function deleteLanguagePackage(req, res) {
  // get userId from request
  const userId = req.user.id;
  const { languagePackageId } = req.params;

  await destroyLanguagePackage(userId, languagePackageId);

  res.status(204).end();
}

async function modifyLanguagePackage(req, res) {
  // get userId from request
  const userId = req.user.id;
  const { languagePackageId } = req.params;

  await updateLanguagePackage(req.body, userId, languagePackageId);

  res.status(204).end();
}

module.exports = {
  addLanguagePackage,
  sendLanguagePackages,
  deleteLanguagePackage,
  modifyLanguagePackage,
};
