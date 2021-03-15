const express = require('express');

const APIRouter = require('./api');

const router = express.Router();

router.get('/', (_req, res) => {
  res.send('Hello World!');
});

router.use('/api', APIRouter);

module.exports = router;
