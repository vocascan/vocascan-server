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
  try {
    // get userId from request
    const userId = req.user.id;

    // create language Package
    const languagePackage = await createLanguagePackage(req.body, userId, res);

    // store drawers for language package in database

    await createDrawers(drawers, languagePackage.id, userId, res);

    res.send(languagePackage);
  } catch (e) {
    console.log(e.message);
    res.status(500).end();
  }
}

async function sendLanguagePackages(req, res) {
  try {
    // get userId from request
    const userId = req.user.id;
    const groups = req.query.groups || false;
    const groupsActive = groups === 'true';

    // get language Package
    const languagePackages = await getLanguagePackages(userId, groupsActive, res);

    // if groups is true, return groups to every language package
    const formatted = await Promise.all(
      languagePackages.map(async (languagePackage) => ({
        unresolvedVocabularies: await getNumberOfUnresolvedVocabulary(languagePackage.id, userId, res),

        // add number of unactivated vocabularies
        unactivatedVocabularies: await getNumberOfUnactivatedVocabulary(languagePackage.id, userId, res),

        ...languagePackage.toJSON(),
      }))
    );

    res.send(formatted);
  } catch (e) {
    console.log(e.message);
    res.status(500).end();
  }
}

async function deleteLanguagePackage(req, res) {
  try {
    // get userId from request
    const userId = req.user.id;
    const { languagePackageId } = req.params;

    await destroyLanguagePackage(userId, languagePackageId, res);

    res.status(204).end();
  } catch (e) {
    console.log(e.message);
    res.status(500).end();
  }
}

async function modifyLanguagePackage(req, res) {
  try {
    // get userId from request
    const userId = req.user.id;
    const { languagePackageId } = req.params;

    await updateLanguagePackage(req.body, userId, languagePackageId, res);

    res.status(204).end();
  } catch (e) {
    console.log(e.message);
    res.status(500).end();
  }
}

module.exports = {
  addLanguagePackage,
  sendLanguagePackages,
  deleteLanguagePackage,
  modifyLanguagePackage,
};
