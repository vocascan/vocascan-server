const {
  getNumberOfLanguagePackages,
  getNumberOfActiveGroups,
  getNumberOfInactiveGroups,
  getNumberOfActiveVocabulary,
  getNumberOfInactiveVocabulary,
} = require('../Services/StatsServiceProvider.js');

async function sendAccountStats(req, res) {
  const userId = req.user.id;

  const logs = {};
  // get number of language packages
  logs.languagePackages = await getNumberOfLanguagePackages(userId);
  // get number of active groups
  logs.activeGroups = await getNumberOfActiveGroups(userId);
  // get number of inactive groups
  logs.inactiveGroups = await getNumberOfInactiveGroups(userId);
  // get number of active vocabulary
  logs.activeVocabulary = await getNumberOfActiveVocabulary(userId);
  // get number of inactive vocabulary
  logs.inactiveVocabulary = await getNumberOfInactiveVocabulary(userId);

  res.send(logs);
}

module.exports = {
  sendAccountStats,
};
