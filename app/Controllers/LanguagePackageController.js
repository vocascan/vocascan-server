const { createLanguagePackage } = require('../Services/LanguagePackageServiceProvider.js');
const { parseTokenUserId } = require('../utils/index.js');

async function addLanguagePackage(req, res) {
  // get userId from request
  const userId = await parseTokenUserId(req);

  // create language Package
  const languagePackage = await createLanguagePackage(req.body, userId);

  res.send(languagePackage);
}

module.exports = {
  addLanguagePackage,
};
