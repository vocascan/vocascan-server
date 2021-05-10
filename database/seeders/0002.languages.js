/**
 * Source: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 * Parsed with: https://gist.github.com/luwol03/9e8c635353371b1464841a114b142d63
 */
const iso639 = require('./data/languages-iso-639-1.json');

const languages = Object.entries(iso639).map(([code, lang]) => ({
  code,
  name: lang.name,
  nativeNames: lang.nativeNames.join(','),
  rtl: lang.rtl,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

async function up({ context: queryInterface }) {
  await queryInterface.bulkInsert('languages', languages);
}

async function down({ context: queryInterface }) {
  await queryInterface.bulkDelete('languages', { code: languages.map((l) => l.code) });
}

module.exports = { up, down };
