const languages = [
  {
    code: 'de',
    name: 'German',
    nativeNames: ['Deutsch'],
    rtl: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    code: 'en',
    name: 'English',
    nativeNames: ['English'],
    rtl: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function up({ context: queryInterface }) {
  await queryInterface.bulkInsert(
    'languages',
    languages.map((lang) => ({
      ...lang,
      nativeNames: lang.nativeNames.join(','),
    }))
  );
}

async function down({ context: queryInterface }) {
  await queryInterface.bulkDelete('languages', { name: languages.map((l) => l.code) });
}

module.exports = { up, down };
