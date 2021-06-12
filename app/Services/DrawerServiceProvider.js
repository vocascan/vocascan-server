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
