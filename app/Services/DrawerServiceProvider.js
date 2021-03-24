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

module.exports = {
  createDrawer,
};
