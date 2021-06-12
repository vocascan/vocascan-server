const { getAllLanguages } = require('../Services/LanguageServiceProvider');
const catchAsync = require('../utils/catchAsync');

const sendLanguages = catchAsync(async (req, res) => {
  const code = (req.query.code || 'true') === 'true';
  const name = (req.query.name || 'true') === 'true';
  const nativeNames = (req.query.nativeNames || 'false') === 'true';
  const rtl = (req.query.rtl || 'false') === 'true';

  const allLanguages = await getAllLanguages([
    ...(code ? ['code'] : []),
    ...(name ? ['name'] : []),
    ...(nativeNames ? ['nativeNames'] : []),
    ...(rtl ? ['rtl'] : []),
  ]);

  res.send(allLanguages);
});

module.exports = {
  sendLanguages,
};
