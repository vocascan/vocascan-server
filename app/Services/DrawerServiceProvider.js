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
  const allDrawers = [];
  await Promise.all(
    drawers.map(async (drawer) => {
      allDrawers.push(await createDrawer(languagePackageId, drawer.stage, drawer.queryInterval, userId));
    })
  );

  return allDrawers;
}

module.exports = {
  createDrawer,
  createDrawers,
};
