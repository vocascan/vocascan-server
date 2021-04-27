const {
  getQueryVocabulary,
  handleCorrectQuery,
  handleWrongQuery,
  getUnactivatedVocabulary,
} = require('../Services/QueryServiceProvider.js');
const {
  getNumberOfUnresolvedVocabulary,
  getNumberOfLearnedTodayVocabulary,
} = require('../Services/StatsServiceProvider.js');
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
  const answer = (req.query.answer || false) === 'true';
  const progress = (req.query.progress || false) === 'true';

  let vocabularyCard;

  // check if vocabulary card got answered right
  if (answer) {
    vocabularyCard = await handleCorrectQuery(userId, vocabularyId);
  } else {
    vocabularyCard = await handleWrongQuery(userId, vocabularyId);
  }

  if (progress) {
    const [unresolved, queryProgress] = await Promise.all([
      getNumberOfUnresolvedVocabulary({
        languagePackageId: vocabularyCard.languagePackageId,
        userId,
      }),

      getNumberOfLearnedTodayVocabulary({
        userId,
        languagePackageId: vocabularyCard.languagePackageId,
      }),
    ]);

    if (unresolved < queryProgress.dueToday) {
      queryProgress.dueToday = unresolved;
    }

    return res.send({ queryProgress });
  }

  return res.status(204).end();
});

module.exports = {
  sendQueryVocabulary,
  checkVocabulary,
};
