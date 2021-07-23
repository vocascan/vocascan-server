const { storeGroupVocabulary, storeLanguagePackageVocabulary } = require('../Services/ImportServiceProvider.js');
const catchAsync = require('../utils/catchAsync');

const importGroup = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;

  // get group with vocabs from request body
  const { group, languagePackageId, active, activate } = req.body;

  await storeGroupVocabulary(group, userId, languagePackageId, active, activate);

  res.send('stored');
});

const importLanguagePackage = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;

  // get group with vocabs from request body
  const { languagePackage, active, activate } = req.body;

  await storeLanguagePackageVocabulary(languagePackage, userId, active, activate);

  // await storeLanguagePackageVocabulary(group);

  res.send('stored');
});

module.exports = {
  importGroup,
  importLanguagePackage,
};
