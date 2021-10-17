const { getAllGroupVocabulary, getAllLanguagePackageVocabulary } = require('../Services/ExportServiceProvider.js');
const catchAsync = require('../utils/catchAsync');
const { getVersion } = require('../Services/InfoServiceProvider');

const exportGroup = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;

  // get language package id from params
  const { groupId } = req.params;

  const group = await getAllGroupVocabulary(userId, groupId);
  const formatted = {
    version: getVersion(),
    type: 'vocascan/group',
    ...group.toJSON(),
  };
  res.send(formatted);
});

const exportLanguagePackage = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;

  // get language package id from params
  const { languagePackageId } = req.params;
  const queryStatus = (req.query.queryStatus || 'false') === 'true';

  const languagePackage = await getAllLanguagePackageVocabulary({ userId, languagePackageId, queryStatus });
  const formatted = {
    version: getVersion(),
    type: 'vocascan/package',
    ...languagePackage.toJSON(),
  };

  res.send(formatted);
});

module.exports = {
  exportGroup,
  exportLanguagePackage,
};
