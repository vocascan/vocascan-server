const express = require('express');

const APIRouter = require('./api');
const PageRouter = require('./pages');

const router = express.Router();

router.get('/', (_req, res) => {
  res.send('Hello World!');
});

router.use('/', PageRouter);

router.use('/api', APIRouter);

module.exports = router;
