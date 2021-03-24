const { getQueryVocabulary, handleCorrectQuery, handleWrongQuery } = require('../Services/QueryServiceProvider.js');

async function sendQueryVocabulary(req, res) {
  // get userId from request
  const { id } = req.user;
  const { languagePackageId } = req.params;
  const { limit } = req.query;

  // parse vocabulary card id from response and create translations
  const vocabulary = await getQueryVocabulary(languagePackageId, id, limit);

  res.send(vocabulary);
}

async function checkVocabulary(req, res) {
  // get userId from request
  const { id } = req.user;
  const { vocabularyId } = req.params;
  const { answer } = req.body;

  // check if vocabulary card got answered right
  if (answer === true) {
    handleCorrectQuery(id, vocabularyId);
    res.statusCode(204).send();
  } else {
    handleWrongQuery(id, vocabularyId);
    res.statusCode(204).send();
  }
}

module.exports = {
  sendQueryVocabulary,
  checkVocabulary,
};
