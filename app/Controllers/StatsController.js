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
  logs.languagePackages = (await getNumberOfLanguagePackages(userId))[1];
  // get number of active groups
  logs.activeGroups = (await getNumberOfActiveGroups(userId))[1];
  // get number of inactive groups
  logs.inactiveGroups = (await getNumberOfInactiveGroups(userId))[1];
  // get number of active vocabulary
  logs.activeVocabulary = (await getNumberOfActiveVocabulary(userId))[1];
  // get number of inactive vocabulary
  logs.inactiveVocabulary = (await getNumberOfInactiveVocabulary(userId))[1];

  res.send(logs);
}

module.exports = {
  sendAccountStats,
};
