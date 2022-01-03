const express = require('express');

const config = require('../app/config/config');

const StaticPagesController = require('../app/Controllers/StaticPagesController.js');

const router = express.Router();

if (config.pages) {
  Object.values(config.pages).forEach((page) => {
    router.get(page.url, StaticPagesController.getRenderPageHandler(page));
  });
}

module.exports = router;
