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
    email_confirm: {
      enabled: config.service.email_confirm,
      level: config.service.email_confirm_level,
      time: config.service.email_confirm_time,
    },
    max_file_upload: config.server.max_file_upload,
  });
});

module.exports = {
  sendInfo,
};
