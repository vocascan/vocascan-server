const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { version: packageVersion } = require('../../package.json');

const getVersion = () => {
  return packageVersion;
};

const getGitDescribe = async () => {
  try {
    const { stdout: version } = await exec('git describe --always --dirty');

    return version.trim();
  } catch {
    return null;
  }
};

module.exports = {
  getVersion,
  getGitDescribe,
};
