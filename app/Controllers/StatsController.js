const {
  getNumberOfLanguagePackages,
  getNumberOfGroups,
  getNumberOfVocabulary,
} = require('../Services/StatsServiceProvider.js');
const catchAsync = require('../utils/catchAsync');
const { promiseAllValues } = require('../utils/index.js');

const sendAccountStats = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const stats = await promiseAllValues({
    // get number of language packages
    languagePackages: getNumberOfLanguagePackages({ userId }),

    // get number of active groups
    activeGroups: getNumberOfGroups({ userId, active: true }),

    // get number of inactive groups
    inactiveGroups: getNumberOfGroups({ userId, active: false }),

    // get number of active vocabulary
    activeVocabulary: getNumberOfVocabulary({ userId, active: true }),

    // get number of inactive vocabulary
    inactiveVocabulary: getNumberOfVocabulary({ userId, active: false }),
  });

  res.send(stats);
});

module.exports = {
  sendAccountStats,
};
