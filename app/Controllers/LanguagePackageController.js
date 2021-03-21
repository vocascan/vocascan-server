const { createLanguagePackage, getLanguagePackages } = require('../Services/LanguagePackageServiceProvider.js');
const { createDrawer } = require('../Services/DrawerServiceProvider.js');
const { getUnresolvedVocabulary } = require('../Services/QueryServiceProvider.js');
const { parseTokenUserId } = require('../utils/index.js');

async function addLanguagePackage(req, res) {
  // get userId from request
  const userId = await parseTokenUserId(req);

  // create language Package
  const languagePackage = await createLanguagePackage(req.body, userId);

  // create drawers for language package
  const drawers = [
    { name: '1', queryInterval: 1 },
    { name: '2', queryInterval: 2 },
    { name: '3', queryInterval: 3 },
    { name: '4', queryInterval: 5 },
    { name: '5', queryInterval: 10 },
    { name: '6', queryInterval: 30 },
    { name: '7', queryInterval: 60 },
    { name: '8', queryInterval: 90 },
  ];

  // iterate over drawers and store them in the database
  Object.keys(drawers).forEach((key) => {
    createDrawer(languagePackage.id, drawers[key].name, drawers[key].queryInterval, userId);
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
      languagePackages[key].dataValues.unresolvedQuerys = await getUnresolvedVocabulary(
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
