const { Drawer } = require('../../database');
const { formatSequelizeError, getStatusCode } = require('../utils/error.js');

// create language package
async function createDrawer(languagePackageId, stage, queryInterval, userId) {
  try {
    const drawer = await Drawer.create({
      userId,
      languagePackageId,
      stage,
      queryInterval,
    });

    return [null, drawer];
  } catch (err) {
    const error = formatSequelizeError(err);

    if (error) {
      return { status: getStatusCode(error), ...error };
    }
    return [null];
  }
}

async function createDrawers(drawers, languagePackageId, userId) {
  await Promise.all(
    drawers.map(async (drawer) => {
      await createDrawer(languagePackageId, drawer.stage, drawer.queryInterval, userId);
    })
  );
}

module.exports = {
  createDrawer,
  createDrawers,
};
