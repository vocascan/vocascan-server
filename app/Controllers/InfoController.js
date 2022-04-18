const config = require('../config/config/index.js');
const { getVersion, getGitDescribe } = require('../Services/InfoServiceProvider.js');
const catchAsync = require('../utils/catchAsync.js');

let gitDescribe;

const sendInfo = catchAsync(async (_req, res) => {
  res.send({
    identifier: 'vocascan-server',
    version: getVersion(),
    locked: config.service.invite_code,
    commitRef: gitDescribe === undefined ? (gitDescribe = await getGitDescribe()) : gitDescribe,
  });
});

module.exports = {
  sendInfo,
};
