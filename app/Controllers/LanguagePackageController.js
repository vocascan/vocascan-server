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
const catchAsync = require('../utils/catchAsync');

const addLanguagePackage = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;

  // create language Package
  const languagePackage = await createLanguagePackage(req.body, userId);

  // store drawers for language package in database

  await createDrawers(drawers, languagePackage.id, userId);

  res.send(languagePackage);
});

const sendLanguagePackages = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;
  const groups = req.query.groups || false;
  const groupsActive = groups === 'true';

  // get language Package
  const languagePackages = await getLanguagePackages(userId, groupsActive);

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
});

const deleteLanguagePackage = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;
  const { languagePackageId } = req.params;

  const [error] = await destroyLanguagePackage(userId, languagePackageId);

  if (error) {
    res.status(error.status).send({ error: error.error });
  }

  res.status(204).end();
});

const modifyLanguagePackage = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;
  const { languagePackageId } = req.params;

  const [error] = await updateLanguagePackage(req.body, userId, languagePackageId);

  if (error) {
    res.status(error.status).send({ error: error.error });
  }

  res.status(204).end();
});

module.exports = {
  addLanguagePackage,
  sendLanguagePackages,
  deleteLanguagePackage,
  modifyLanguagePackage,
};
