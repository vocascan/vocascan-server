const express = require('express');

const config = require('../app/config/config');

const StaticPagesController = require('../app/Controllers/StaticPagesController.js');

const router = express.Router();

if (config.pages) {
  for (const [, value] of Object.entries(config.pages)) {
    router.get(value.url, (req, res) => {
      StaticPagesController.renderPage(req, res, value);
    });
  }
}

module.exports = router;
