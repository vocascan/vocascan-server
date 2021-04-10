const {
  getNumberOfLanguagePackages,
  getNumberOfGroups,
  getNumberOfVocabulary,
} = require('../Services/StatsServiceProvider.js');
const catchAsync = require('../utils/catchAsync');
const { promiseAllValues } = require('../utils/index.js');

const sendAccountStats = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const stats = {
    // get number of language packages
    languagePackages: getNumberOfLanguagePackages(userId),

    // get number of active groups
    activeGroups: getNumberOfGroups(userId, true),

    // get number of inactive groups
    inactiveGroups: getNumberOfGroups(userId, false),

    // get number of active vocabulary
    activeVocabulary: getNumberOfVocabulary(userId, true),

    // get number of inactive vocabulary
    inactiveVocabulary: getNumberOfVocabulary(userId, false),
  };

  const resolvedStats = await promiseAllValues(stats);

  res.send(resolvedStats);
});

module.exports = {
  sendAccountStats,
};
