const {
  getQueryVocabulary,
  handleCorrectQuery,
  handleWrongQuery,
  getUnactivatedVocabulary,
} = require('../Services/QueryServiceProvider.js');
const catchAsync = require('../utils/catchAsync');

const sendQueryVocabulary = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;
  const { languagePackageId } = req.params;
  const { limit } = { limit: '100', ...req.query };
  const { staged } = { staged: false, ...req.query };
  // convert to bool
  const isStaged = staged === 'true';

  // if staged = true return the staged vocabulary
  if (isStaged) {
    const vocabulary = await getUnactivatedVocabulary(languagePackageId, userId);
    res.send(vocabulary);
  } else {
    const vocabulary = await getQueryVocabulary(languagePackageId, userId, limit);
    res.send(vocabulary);
  }
});

const checkVocabulary = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;
  const { vocabularyId } = req.params;
  const answer = req.query.answer;
  // convert to bool
  const isAnswerRight = answer === 'true';

  // check if vocabulary card got answered right
  if (isAnswerRight) {
    await handleCorrectQuery(userId, vocabularyId);
    res.status(204).end();
  } else {
    await handleWrongQuery(userId, vocabularyId);
    res.status(204).end();
  }
});

module.exports = {
  sendQueryVocabulary,
  checkVocabulary,
};
