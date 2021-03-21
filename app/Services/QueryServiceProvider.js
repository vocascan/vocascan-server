const { Drawer, VocabularyCard } = require('../../database');

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

module.exports = {
  getUnresolvedVocabulary,
};
