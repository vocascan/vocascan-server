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

  const allVocabulary = [];

  /* eslint-disable no-await-in-loop */
  for (const drawer of drawers) {
    // subtract size of vocabs returned to update the limit
    const vocabularyLimit = limit - allVocabulary.length;

    // create date and add days from query Interval
    const queryDate = new Date();
    // subtract query interval from actual date
    queryDate.setDate(queryDate.getDate() - drawer.queryInterval);

    // compare query date with with last query
    // if queryDate is less than lastQuery: still time
    // if queryDate more than lastQuery: waiting time is over
    const vocabulary = await VocabularyCard.findAll({
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
        {
          model: Drawer,
          attributes: ['stage'],
          required: true,
        },
      ],
      order: Sequelize.literal('random()'),
      limit: vocabularyLimit,
      attributes: ['id', 'name', 'description'],
      where: {
        drawerId: drawer.id,
        lastQuery: { [Op.lt]: queryDate },
        '$Group.active$': true,
        active: true,
      },
    });

    allVocabulary.push(...vocabulary);
  }
  /* eslint-enable no-await-in-loop */

  const formatted = await Promise.all(
    allVocabulary.map(async (vocabulary) => ({
      stage: vocabulary.Drawer.stage,

      ...vocabulary.toJSON(),
    }))
  );

  return formatted.map((format) => deleteKeysFromObject(['Group', 'Drawer'], format));
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
  const vocabularyWords = await VocabularyCard.findAll({
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
      {
        model: Drawer,
        attributes: ['stage'],
        required: true,
      },
    ],
    order: Sequelize.literal('random()'),
    attributes: ['id', 'name', 'description'],
    where: {
      drawerId: drawer.id,
      '$Group.active$': true,
      active: true,
    },
  });

  const formatted = await Promise.all(
    vocabularyWords.map(async (vocabulary) => ({
      stage: vocabulary.Drawer.stage,

      ...vocabulary.toJSON(),
    }))
  );
  /* eslint-enable no-await-in-loop */

  return formatted.map((format) => deleteKeysFromObject(['Group', 'Drawer'], format));
}

// function to handle correct query
async function handleCorrectQuery(userId, vocabularyCardId) {
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
      id: vocabularyCardId,
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
  const lastQuery = new Date();
  const drawerId = drawer.id;

  await vocabularyCard.update(
    { lastQuery, drawerId },
    {
      fields: ['lastQuery', 'drawerId'],
    }
  );
}

// function to handle wrong query
async function handleWrongQuery(userId, vocabularyCardId) {
  // if query was solved wrong, push vocabulary card in drawer one
  const vocabularyCard = await VocabularyCard.findOne({
    attributes: ['languagePackageId'],
    where: {
      userId,
      id: vocabularyCardId,
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
  const lastQuery = new Date();
  const drawerId = drawer.id;

  await vocabularyCard.update(
    { lastQuery, drawerId },
    {
      fields: ['lastQuery', 'drawerId'],
    }
  );
}

module.exports = {
  getNumberOfUnresolvedVocabulary,
  getNumberOfUnactivatedVocabulary,
  getQueryVocabulary,
  getUnactivatedVocabulary,
  handleCorrectQuery,
  handleWrongQuery,
};
