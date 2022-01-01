const catchAsync = require('../utils/catchAsync');
const path = require('path');

const renderPage = catchAsync(async (req, res, pageValues) => {
  // check which language the user wants his page
  const language = req.query.lang;
  const options = { root: path.join(__dirname, '../../') };
  // check if key (language) is available
  if (Object.prototype.hasOwnProperty.call(pageValues.langs, language)) {
    if (pageValues.langs[language].file) {
      res.sendFile(pageValues.langs[language].file, options);
    }
    // if key is not "file" make a redirect
    else {
      res.redirect(pageValues.langs[language].redirect);
    }
  }
  // requested page language is not defined by host, use fallback page
  else if (pageValues.fallback.file) {
    res.sendFile(pageValues.fallback.file, options);
  }
  // if key is not "file" make a redirect
  else {
    res.redirect(pageValues.fallback.redirect);
  }
});

module.exports = {
  renderPage,
};
