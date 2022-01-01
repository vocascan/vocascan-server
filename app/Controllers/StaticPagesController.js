const catchAsync = require('../utils/catchAsync');
const path = require('path');
const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status');

const renderHandler = catchAsync(async (res, page) => {
  const options = { root: path.join(__dirname, '../../') };

  // check if page should be rendered from a static file or should be redirected to another one
  if (page.type === 'file') {
    res.sendFile(page.location, options, (err) => {
      if (err) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Page was not found');
      }
    });
  } else {
    res.redirect(page.location);
  }
});

const renderPage = catchAsync(async (req, res, pageValues) => {
  // check which language the user wants his page
  const language = req.query.lang;

  // if no language is given, render fallback page
  if (!language) {
    const fallbackPage = pageValues.fallback;

    renderHandler(res, fallbackPage);

    return;
  }

  const languagePage = pageValues.langs[language];
  // check if key (language) is available
  if (languagePage) {
    renderHandler(res, languagePage);
  }
  // requested page language is not defined by host, redirect to fallback page
  else {
    res.redirect(pageValues.url);
  }
});

module.exports = {
  renderPage,
};
