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
const { getGroupsVocabulary } = require('../Services/VocabularyServiceProvider.js');
const catchAsync = require('../utils/catchAsync');

const sendQueryVocabulary = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;
  const { languagePackageId } = req.params;
  const { limit } = { limit: '100', ...req.query };
  const isStaged = (req.query.staged || false) === 'true';
  let { groupId } = { groupId: null, ...req.query };

  // convert groups to Array, if only one group was sent. Express is storing it a string instead of an Array
  if (!Array.isArray(groupId)) {
    if (groupId != null) {
      groupId = [groupId];
    }
  }

  // if groups are set return vocabs of group independ from their current stage
  // (used for vocab acitvation and custom learning)
  if (isStaged) {
    if (groupId) {
      // specific vocab activation
      const vocabulary = await getUnactivatedVocabulary(languagePackageId, userId, groupId);
      res.send(vocabulary);
    } else {
      // return all unactivated vocabs
      const vocabulary = await getUnactivatedVocabulary(languagePackageId, userId, groupId);
      res.send(vocabulary);
    }
  } else if (groupId) {
    // custom learning
    const vocabulary = await getGroupsVocabulary(userId, groupId, false);
    res.send(vocabulary);
  } else {
    // if no groups are set, just return vocabs depending on the learning algorithm
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
