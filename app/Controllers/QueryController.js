const {
  getQueryVocabulary,
  handleCorrectQuery,
  handleWrongQuery,
  getUnactivatedVocabulary,
} = require('../Services/QueryServiceProvider.js');

async function sendQueryVocabulary(req, res) {
  // get userId from request
  const userId = req.user.id;
  const { languagePackageId } = req.params;
  const { limit } = { limit: '0', ...req.query };
  const { staged } = { staged: false, ...req.query };
  // convert to bool
  const isStaged = staged === 'true';

  let vocabulary;
  // if staged = true return the staged vocabulary
  if (isStaged) {
    vocabulary = await getUnactivatedVocabulary(languagePackageId, userId);
  } else {
    vocabulary = await getQueryVocabulary(languagePackageId, userId, limit);
  }

  res.send(vocabulary);
}

async function checkVocabulary(req, res) {
  // get userId from request
  const userId = req.user.id;
  const { vocabularyId } = req.params;
  const answer = req.query.answer;
  // convert to bool
  const isAnswerRight = answer === 'true';

  // check if vocabulary card got answered right
  if (isAnswerRight) {
    await handleCorrectQuery(userId, vocabularyId);
    res.sendStatus(204);
  } else {
    await handleWrongQuery(userId, vocabularyId);
    res.sendStatus(204);
  }
}

module.exports = {
  sendQueryVocabulary,
  checkVocabulary,
};
