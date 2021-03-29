const {
  createLanguagePackage,
  getLanguagePackages,
  destroyLanguagePackage,
} = require('../Services/LanguagePackageServiceProvider.js');
const { createDrawers } = require('../Services/DrawerServiceProvider.js');
const { drawers } = require('../utils/constants.js');
const { getGroups } = require('../Services/GroupServiceProvider.js');
const {
  getNumberOfUnresolvedVocabulary,
  getNumberOfUnactivatedVocabulary,
} = require('../Services/QueryServiceProvider.js');

async function addLanguagePackage(req, res) {
  // get userId from request
  const { id } = req.user;

  // create language Package
  const languagePackage = await createLanguagePackage(req.body, id);

  // store drawers for language package in database

  await createDrawers(drawers, languagePackage.id, id);

  res.send(languagePackage);
}

async function sendLanguagePackages(req, res) {
  // get userId from request
  const { id } = req.user;
  const groups = req.query.groups || false;

  // get language Package
  const languagePackages = await getLanguagePackages(id, groups, res);

  let formatted;
  // if groups is true, return groups to every language package
  formatted = await Promise.all(
    languagePackages.map(async (languagePackage) => ({
      unresolvedVocabularies: await getNumberOfUnresolvedVocabulary(languagePackage.id, id),

      // add number of unactivated vocabularies
      unactivatedVocabularies: await getNumberOfUnactivatedVocabulary(languagePackage.id, id),

      ...languagePackage.toJSON(),
    }))
  );

  res.send(formatted);
}

async function deleteLanguagePackage(req, res) {
  // get userId from request
  const userId = req.user.id;
  const { languagePackageId } = req.params;

  destroyLanguagePackage(userId, languagePackageId);

  res.sendStatus(200);
}

module.exports = {
  addLanguagePackage,
  sendLanguagePackages,
  deleteLanguagePackage,
};
