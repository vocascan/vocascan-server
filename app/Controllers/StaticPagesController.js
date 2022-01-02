const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status');

const renderPageHandler = catchAsync(async (res, page) => {
  const options = { root: process.cwd() };

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

const getRenderPageHandler = (pageValues) =>
  catchAsync(async (req, res) => {
    // check which language the user wants his page
    const language = req.query.lang;

    // if no language is given, render fallback page
    if (!language || !pageValues.langs) {
      renderPageHandler(res, pageValues.fallback);

      return;
    }

    const languagePage = pageValues.langs[language];

    // check if key (language) is available
    if (languagePage) {
      renderPageHandler(res, languagePage);
    }
    // requested page language is not defined by host, redirect to fallback page
    else {
      res.redirect(pageValues.url);
    }
  });

module.exports = {
  getRenderPageHandler,
};
