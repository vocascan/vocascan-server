const { storeGroupVocabulary, storeLanguagePackageVocabulary } = require('../Services/ImportServiceProvider.js');
const catchAsync = require('../utils/catchAsync');

const importGroup = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;

  const active = (req.query.active || 'true') === 'true';
  const activate = (req.query.activate || 'false') === 'true';
  const { languagePackageId } = req.query;

  await storeGroupVocabulary(req.body, userId, languagePackageId, active, activate);

  res.status(204).end();
});

const importLanguagePackage = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;

  const active = (req.query.active || 'true') === 'true';
  const activate = (req.query.activate || 'false') === 'true';
  const queryStatus = (req.query.queryStatus || 'false') === 'true';

  await storeLanguagePackageVocabulary(req.body, userId, active, activate, queryStatus);

  res.status(204).end();
});

module.exports = {
  importGroup,
  importLanguagePackage,
};
