const crypto = require('crypto');
const chalk = require('chalk');

const secret = crypto.randomBytes(64).toString('hex');

console.log(`
Copy-Paste your JWT secret into the .env file under JWT_SECRET
${chalk.red(secret)}
`);
