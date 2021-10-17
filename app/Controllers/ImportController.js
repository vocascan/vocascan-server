const { storeGroupVocabulary, storeLanguagePackageVocabulary } = require('../Services/ImportServiceProvider.js');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status');

const importVocabs = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;

  const active = (req.query.active || 'true') === 'true';
  const activate = (req.query.activate || 'false') === 'true';

  const { type } = req.body;
  // use different types of import to separate the functions
  if (!type) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'imported data has no Vocascan structure');
  } else if (type === 'vocascan/package') {
    const queryStatus = (req.query.queryStatus || 'false') === 'true';
    await storeLanguagePackageVocabulary(req.body, userId, active, activate, queryStatus);
  } else if (type === 'vocascan/group') {
    const { languagePackageId } = req.query;
    await storeGroupVocabulary(req.body, userId, languagePackageId, active, activate);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'imported data type not recognized');
  }

  res.status(204).end();
});

module.exports = {
  importVocabs,
};
