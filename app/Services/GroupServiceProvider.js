const { Group } = require('../../database');

// create language package
async function createGroup({ name, active }, userId, languagePackageId ) {
  const group = await Group.create({
    userId: userId,
    languagePackageId: languagePackageId,
    name: name,
    active: active
  });

  return group;
}

module.exports = {
  createGroup
};