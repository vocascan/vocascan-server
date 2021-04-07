const { Drawer } = require('../../database');
const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status');

// create language package
async function createDrawer(languagePackageId, stage, queryInterval, userId) {
  try {
    const drawer = await Drawer.create({
      userId,
      languagePackageId,
      stage,
      queryInterval,
    });

    return drawer;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'bad request');
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
