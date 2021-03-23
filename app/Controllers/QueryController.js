const { getQueryVocabulary } = require('../Services/QueryServiceProvider.js');
const { parseTokenUserId } = require('../utils/index.js');

async function sendQueryVocabulary(req, res) {
  // get userId from request
  const userId = req.user.id;
  const languagePackageId = req.params.languagePackageId;
  const limit = req.query.limit;

  // parse vocabulary card id from response and create translations
  const vocabulary = await getQueryVocabulary(languagePackageId, userId, limit);

  res.send(vocabulary);
}

module.exports = {
  sendQueryVocabulary,
};
