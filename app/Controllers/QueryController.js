const {
  getQueryVocabulary,
  handleCorrectQuery,
  handleWrongQuery,
  getUnactivatedVocabulary,
} = require('../Services/QueryServiceProvider.js');

async function sendQueryVocabulary(req, res) {
  try {
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
      vocabulary = await getUnactivatedVocabulary(languagePackageId, userId, res);
    } else {
      vocabulary = await getQueryVocabulary(languagePackageId, userId, limit, res);
    }

    res.send(vocabulary);
  } catch (e) {
    res.status(500).end();
  }
}

async function checkVocabulary(req, res) {
  try {
    // get userId from request
    const userId = req.user.id;
    const { vocabularyId } = req.params;
    const answer = req.query.answer;
    // convert to bool
    const isAnswerRight = answer === 'true';

    // check if vocabulary card got answered right
    if (isAnswerRight) {
      await handleCorrectQuery(userId, vocabularyId, res);
      res.status(204).end();
    } else {
      await handleWrongQuery(userId, vocabularyId, res);
      res.status(204).end();
    }
  } catch (e) {
    res.status(500).end();
  }
}

module.exports = {
  sendQueryVocabulary,
  checkVocabulary,
};
