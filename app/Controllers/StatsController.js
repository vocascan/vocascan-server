const {
  getNumberOfLanguagePackages,
  getNumberOfGroups,
  getNumberOfVocabulary,
} = require('../Services/StatsServiceProvider.js');
const catchAsync = require('../utils/catchAsync');

const sendAccountStats = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const logs = {};
  // get number of language packages
  logs.languagePackages = await getNumberOfLanguagePackages(userId);
  // get number of active groups
  logs.activeGroups = await getNumberOfGroups(userId, true);
  // get number of inactive groups
  logs.inactiveGroups = await getNumberOfGroups(userId, false);
  // get number of active vocabulary
  logs.activeVocabulary = await getNumberOfVocabulary(userId, true);
  // get number of inactive vocabulary
  logs.inactiveVocabulary = await getNumberOfVocabulary(userId, false);

  res.send(logs);
});

module.exports = {
  sendAccountStats,
};
