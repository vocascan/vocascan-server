const { createLanguagePackage, getLanguagePackages } = require('../Services/LanguagePackageServiceProvider.js');
const { createDrawer } = require('../Services/DrawerServiceProvider.js');
const {
  getNumberOfUnresolvedVocabulary,
  getNumberOfUnactivatedVocabulary,
} = require('../Services/QueryServiceProvider.js');
const { parseTokenUserId } = require('../utils/index.js');

async function addLanguagePackage(req, res) {
  // get userId from request
  const userId = await parseTokenUserId(req);

  // create language Package
  const languagePackage = await createLanguagePackage(req.body, userId);

  // create drawers for language package
  const drawers = [
    { stage: '0', queryInterval: 0 },
    { stage: '1', queryInterval: 1 },
    { stage: '2', queryInterval: 2 },
    { stage: '3', queryInterval: 3 },
    { stage: '4', queryInterval: 5 },
    { stage: '5', queryInterval: 10 },
    { stage: '6', queryInterval: 30 },
    { stage: '7', queryInterval: 60 },
    { stage: '8', queryInterval: 90 },
  ];

  // iterate over drawers and store them in the database
  Object.keys(drawers).forEach((key) => {
    createDrawer(languagePackage.id, drawers[key].stage, drawers[key].queryInterval, userId);
  });

  res.send(languagePackage);
}

async function sendLanguagePackages(req, res) {
  // get userId from request
  const userId = await parseTokenUserId(req);

  // create language Package
  const languagePackages = await getLanguagePackages(userId, res);

  await Promise.all(
    Object.keys(languagePackages).map(async (key) => {
      languagePackages[key].dataValues.unresolvedQuerys = await getNumberOfUnresolvedVocabulary(
        languagePackages[key].id,
        userId
      );
      // add number of unactivated vocabularies
      languagePackages[key].dataValues.unactivatedVocabularies = await getNumberOfUnactivatedVocabulary(
        languagePackages[key].id,
        userId
      );
      return languagePackages[key].toJSON();
    })
  );

  res.send(languagePackages);
}

module.exports = {
  addLanguagePackage,
  sendLanguagePackages,
};
