const {createGroup} = require('../Services/GroupServiceProvider.js');
const { parseTokenUserId } = require('../utils/index.js');

async function addGroup(req, res) {
  // get userId from request
  const userId = await parseTokenUserId(req);

  //get language package id from params
  const languagePackageId = req.params.languagePackageId;

  // create language Package
  const group = await createGroup(req.body, userId, languagePackageId);

  res.send(group);
}

module.exports = {
  addGroup,
};

