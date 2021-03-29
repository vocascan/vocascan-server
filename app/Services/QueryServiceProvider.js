const { Drawer, VocabularyCard, Translation, Group } = require('../../database');
const { deleteKeysFromObject } = require('../utils/index.js');
const { Sequelize, Op } = require('sequelize');

// return the number of unresolved vocabulary
async function getNumberOfUnresolvedVocabulary(languagePackageId, userId) {
  // Get drawers belonging to languagePackage
  const drawers = await Drawer.findAll({
    attributes: ['id', 'stage', 'queryInterval'],
    where: {
      userId,
      languagePackageId,
      stage: {
        [Op.ne]: 0,
      },
    },
  });

  let number = 0;

  await Promise.all(
    Object.keys(drawers).map(async (key) => {
      // create date and add days from query Interval
      let queryDate = new Date();
      // subtract query interval from actual date
      queryDate.setDate(queryDate.getDate() - drawers[key].queryInterval);

      // compare query date with with last query
      // if queryDate is less than lastQuery: still time
      // if queryDate more than lastQuery: waiting time is over

      const result = await VocabularyCard.count({
        include: [
          {
            model: Group,
            attributes: ['active'],
          },
        ],
        where: {
          drawerId: drawers[key].id,
          lastQuery: { [Op.lt]: queryDate },
          '$Group.active$': true,
          active: true,
        },
      });
      number += Number(result);
    })
  );

  return number;
}

// return the number of unactivated vocabulary
async function getNumberOfUnactivatedVocabulary(languagePackageId, userId) {
  // Get number of vocabularies belonging to languagePackage
  const number = await await VocabularyCard.count({
    include: [
      {
        model: Drawer,
        attributes: ['stage'],
        required: true,
      },
    ],
    where: {
      languagePackageId,
      userId,
      '$Drawer.stage$': 0,
      active: true,
    },
  });

  return number;
}

// return the unresolved vocabulary
async function getQueryVocabulary(languagePackageId, userId, limit) {
  // Get drawers belonging to languagePackage
  const drawers = await Drawer.findAll({
    attributes: ['id', 'stage', 'queryInterval'],
    where: {
      userId,
      languagePackageId,
      stage: {
        [Op.ne]: 0,
      },
    },
  });

  const vocabs = [];

  /* eslint-disable no-await-in-loop */
  for (const drawer of drawers) {
    // subtract size of vocabs returned to update the limit
    const vocabularyLimit = limit - vocabs.length;

    // create date and add days from query Interval
    const queryDate = new Date();
    // subtract query interval from actual date
    queryDate.setDate(queryDate.getDate() - drawer.queryInterval);

    // compare query date with with last query
    // if queryDate is less than lastQuery: still time
    // if queryDate more than lastQuery: waiting time is over
    const vocabularies = await VocabularyCard.findAll({
      include: [
        {
          model: Translation,
          attributes: ['name'],
          required: true,
        },
        {
          model: Group,
          attributes: ['active'],
          required: true,
        },
      ],
      order: Sequelize.literal('random()'),
      limit: vocabularyLimit,
      attributes: ['id', 'name'],
      where: {
        drawerId: drawer.id,
        lastQuery: { [Op.lt]: queryDate },
        '$Group.active$': true,
        active: true,
      },
    });

    vocabs.push(...vocabularies);
  }
  /* eslint-enable no-await-in-loop */

  return vocabs.map((vocab) => deleteKeysFromObject(['Group'], vocab.toJSON()));
}

// return the unactivated vocabulary
async function getUnactivatedVocabulary(languagePackageId, userId) {
  // Get drawers id
  const drawer = await Drawer.findOne({
    attributes: ['id'],
    where: {
      userId,
      languagePackageId,
      stage: 0,
    },
  });

  // return every vocabulary in drawer 0
  const vocabularies = await VocabularyCard.findAll({
    include: [
      {
        model: Translation,
        attributes: ['name'],
      },
      {
        model: Group,
        attributes: ['active'],
        required: true,
      },
    ],
    order: Sequelize.literal('random()'),
    attributes: ['id', 'name'],
    where: {
      drawerId: drawer.id,
      '$Group.active$': true,
      active: true,
    },
  });
  return vocabularies.map((vocab) => deleteKeysFromObject(['Group'], vocab.toJSON()));
}

// function to handle correct query
async function handleCorrectQuery(userId, vocabularyId) {
  // fetch selected vocabulary card
  const vocabularyCard = await VocabularyCard.findOne({
    include: [
      {
        model: Drawer,
        attributes: ['stage'],
      },
    ],
    attributes: ['id', 'name', 'drawerId', 'languagePackageId'],
    where: {
      userId,
      id: vocabularyId,
    },
  });

  // push vocabulary card one drawer up
  // get drawer id from stage

  const drawer = await Drawer.findOne({
    attributes: ['id'],
    where: {
      userId,
      languagePackageId: vocabularyCard.languagePackageId,
      stage: vocabularyCard.Drawer.stage + 1,
    },
  });
  if (!drawer) {
    // if no output there is no next drawer => stop
    return;
  }

  // update drawerId for vocabulary card
  vocabularyCard.lastQuery = new Date();
  vocabularyCard.drawerId = drawer.id;

  await vocabularyCard.save();
}

// function to handle wrong query
async function handleWrongQuery(userId, vocabularyId) {
  // if query was solved wrong, push vocabulary card in drawer one
  const vocabularyCard = await VocabularyCard.findOne({
    include: [
      {
        model: Drawer,
        attributes: ['stage'],
      },
    ],
    attributes: ['id', 'name', 'drawerId', 'languagePackageId'],
    where: {
      userId,
      id: vocabularyId,
    },
  });

  const drawer = await Drawer.findOne({
    attributes: ['id'],
    where: {
      userId,
      languagePackageId: vocabularyCard.languagePackageId,
      stage: 1,
    },
  });

  // update drawerId for vocabulary card
  vocabularyCard.lastQuery = new Date();
  vocabularyCard.drawerId = drawer.id;

  await vocabularyCard.save();
}

module.exports = {
  getNumberOfUnresolvedVocabulary,
  getNumberOfUnactivatedVocabulary,
  getQueryVocabulary,
  getUnactivatedVocabulary,
  handleCorrectQuery,
  handleWrongQuery,
};
