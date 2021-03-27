const {
  createLanguagePackage,
  getLanguagePackages,
  destroyLanguagePackage,
  updateLanguagePackage,
} = require('../Services/LanguagePackageServiceProvider.js');
const { createDrawer } = require('../Services/DrawerServiceProvider.js');
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

  // iterate over drawers and store them in the database
  await Promise.all(
    drawers.map(async (drawer) => {
      await createDrawer(languagePackage.id, drawer.stage, drawer.queryInterval, id);
    })
  );

  res.send(languagePackage);
}

async function sendLanguagePackages(req, res) {
  // get userId from request
  const { id } = req.user;
  const { groups } = req.query || false;

  // get language Package
  const languagePackages = await getLanguagePackages(id, res);

  let formatted;
  // if groups is true, return groups to every language package
  if (groups) {
    formatted = await Promise.all(
      languagePackages.map(async (languagePackage) => ({
        unresolvedVocabularies: await getNumberOfUnresolvedVocabulary(languagePackage.id, id),

        // add number of unactivated vocabularies
        unactivatedVocabularies: await getNumberOfUnactivatedVocabulary(languagePackage.id, id),

        groups: await getGroups(id, languagePackage.id, res),

        ...languagePackage.toJSON(),
      }))
    );
  } else {
    formatted = await Promise.all(
      languagePackages.map(async (languagePackage) => ({
        unresolvedVocabularies: await getNumberOfUnresolvedVocabulary(languagePackage.id, id),

        // add number of unactivated vocabularies
        unactivatedVocabularies: await getNumberOfUnactivatedVocabulary(languagePackage.id, id),

        ...languagePackage.toJSON(),
      }))
    );
  }

  res.send(formatted);
}

async function deleteLanguagePackage(req, res) {
  // get userId from request
  const { id } = req.user;
  const { languagePackageId } = req.params;

  destroyLanguagePackage(id, languagePackageId);

  res.sendStatus(200);
}

async function modifyLanguagePackage(req, res) {
  // get userId from request
  const { id } = req.user;
  const { languagePackageId } = req.params;

  const languagePackage = await updateLanguagePackage(req.body, id, languagePackageId);

  res.send(languagePackage);
}

module.exports = {
  addLanguagePackage,
  sendLanguagePackages,
  deleteLanguagePackage,
  modifyLanguagePackage,
};
