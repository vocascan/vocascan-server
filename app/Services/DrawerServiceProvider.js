const { Drawer } = require('../../database');

// create language package
async function createDrawer(languagePackageId, stage, queryInterval, userId, res) {
  try {
    const drawer = await Drawer.create({
      userId,
      languagePackageId,
      stage,
      queryInterval,
    });

    return drawer;
  } catch {
    res.status(400).end();
    return false;
  }
}

async function createDrawers(drawers, languagePackageId, userId, res) {
  await Promise.all(
    drawers.map(async (drawer) => {
      await createDrawer(languagePackageId, drawer.stage, drawer.queryInterval, userId, res);
    })
  );
}

module.exports = {
  createDrawer,
  createDrawers,
};
