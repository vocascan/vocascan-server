const { query } = require('express');
const { Drawer } = require('../../database');

// create language package
async function createDrawer(languagePackageId, name, queryInterval, userId) {
  const drawer = await Drawer.create({
    userId: userId,
    languagePackageId: languagePackageId,
    name: name,
    queryInterval: queryInterval
  });

  return drawer;
}


module.exports = {
  createDrawer,
};