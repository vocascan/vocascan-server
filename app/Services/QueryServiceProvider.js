const { Drawer, VocabularyCard, Translation } = require('../../database');

// return the number of unresolved vocabulary
async function getUnresolvedVocabulary(languagePackageId, userId) {
  // Get drawers belonging to languagePackage
  const drawers = await Drawer.findAll({
    attributes: ['id', 'name', 'queryInterval'],
    where: {
      userId: userId,
      languagePackageId: languagePackageId,
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
        where: {
          drawerId: drawers[key].id,
          lastQuery: { lt: queryDate },
        },
      });
      number += Number(result);
    })
  );

  return number;
}

// return the number of unresolved vocabulary
async function getQueryVocabulary(languagePackageId, userId, limit) {
  // Get drawers belonging to languagePackage
  const drawers = await Drawer.findAll({
    attributes: ['id', 'name', 'queryInterval'],
    where: {
      userId: userId,
      languagePackageId: languagePackageId,
    },
  });

  let vocabs = [];

  await Promise.all(
    Object.keys(drawers).map(async (key) => {
      let vocabularyLimit = limit;
      // subtract size of vocabs returned to update the limit
      vocabularyLimit -= vocabs.length;
      // create date and add days from query Interval
      let queryDate = new Date();
      // subtract query interval from actual date
      queryDate.setDate(queryDate.getDate() - drawers[key].queryInterval);

      // compare query date with with last query
      // if queryDate is less than lastQuery: still time
      // if queryDate more than lastQuery: waiting time is over

      const vocabularies = await VocabularyCard.findAll({
        limit: vocabularyLimit,
        attributes: ['id', 'name'],
        where: {
          drawerId: drawers[key].id,
          lastQuery: { lt: queryDate },
        },
      });

      // add translations to every vocabulary card
      await Promise.all(
        Object.keys(vocabularies).map(async (num) => {
          vocabularies[num].dataValues.translations = await Translation.findAll({
            attributes: ['name'],
            where: {
              vocabularyCardId: vocabularies[num].id,
            },
          });
          return vocabularies[num].toJSON();
        })
      );

      vocabs.push(...vocabularies);
    })
  );

  return vocabs;
}

module.exports = {
  getUnresolvedVocabulary,
  getQueryVocabulary,
};
