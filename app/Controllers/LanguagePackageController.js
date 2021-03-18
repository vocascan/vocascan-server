const { createLanguagePackage, getLanguagePackages } = require('../Services/LanguagePackageServiceProvider.js');
const { parseTokenUserId } = require('../utils/index.js');

async function addLanguagePackage(req, res) {
  // get userId from request
  const userId = await parseTokenUserId(req);

  // create language Package
  const languagePackage = await createLanguagePackage(req.body, userId);

  res.send(languagePackage);
}

async function sendLanguagePackages(req, res) {
  // get userId from request
  const userId = await parseTokenUserId(req);

  // create language Package
  const languagePackages = await getLanguagePackages(userId, res);

  res.send(languagePackages);
}

module.exports = {
  addLanguagePackage,
  sendLanguagePackages,
};
