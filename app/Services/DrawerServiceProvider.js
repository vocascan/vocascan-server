const { Drawer } = require('../../database');

// create language package
async function createDrawer(languagePackageId, stage, queryInterval, userId) {
  const drawer = await Drawer.create({
    userId,
    languagePackageId,
    stage,
    queryInterval,
  });

  return drawer;
}

async function createDrawers(drawers, languagePackageId, userId, transaction) {
  const createdDrawers = await Drawer.bulkCreate(
    drawers.map((drawer) => ({
      userId,
      languagePackageId,
      stage: drawer.stage,
      queryInterval: drawer.queryInterval,
    })),
    { transaction }
  );

  return createdDrawers;
}

module.exports = {
  createDrawer,
  createDrawers,
};
