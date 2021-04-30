const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const seeds = {
  roles: [
    {
      id: uuid(),
      name: 'user',
      adminRights: 'false',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuid(),
      name: 'admin',
      adminRights: 'true',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  users: [
    {
      id: uuid(),
      username: 'Test',
      password: await bcrypt.hash('test', +process.env.SALT_ROUNDS),
      email: await crypto.createHash('sha256').update('test@gmail.com').digest('base64'),
      
      password: 'password',
      roleId: () => {
        return this.roles[0].id;
      },
    },
  ],
  languagePackages: [
    {
      id: uuid(),
      userId: () => {
        return this.user[0].id;
      },
      name: 'Englisch - Deutsch',
      foreignWordLanguage: 'English',
      translatedWordLanguage: 'German',
      vocabsPerDay: 100,
      rightWords: 2,
    },
    {
      id: uuid(),
      userId: () => {
        return this.user[0].id;
      },
      name: 'Spanisch - Deutsch',
      foreignWordLanguage: 'English',
      translatedWordLanguage: 'German',
      vocabsPerDay: 100,
      rightWords: 2,
    },
    {
      id: uuid(),
      userId: () => {
        return this.user[0].id;
      },
      name: 'Französisch - Deutsch',
      foreignWordLanguage: 'English',
      translatedWordLanguage: 'German',
      vocabsPerDay: 100,
      rightWords: 2,
    },
  ],
  drawers: [
    {
      id: uuid(),
      userId: () => {
        return this.user[0].id;
      },
      languagePackageId: () => {
        return this.languagePackages[0].id;
      },
      stage: 0,
      queryInterval: 0,
    },
    {
      id: uuid(),
      userId: () => {
        return this.user[0].id;
      },
      languagePackageId: () => {
        return this.languagePackages[0].id;
      },
      stage: 1,
      queryInterval: 0,
    },
    {
      id: uuid(),
      userId: () => {
        return this.user[0].id;
      },
      languagePackageId: () => {
        return this.languagePackages[0].id;
      },
      stage: 2,
      queryInterval: 0,
    },
    {
      id: uuid(),
      userId: () => {
        return this.user[0].id;
      },
      languagePackageId: () => {
        return this.languagePackages[0].id;
      },
      stage: 3,
      queryInterval: 0,
    },
    {
      id: uuid(),
      userId: () => {
        return this.user[0].id;
      },
      languagePackageId: () => {
        return this.languagePackages[0].id;
      },
      stage: 4,
      queryInterval: 0,
    },
    {
      id: uuid(),
      userId: () => {
        return this.user[0].id;
      },
      languagePackageId: () => {
        return this.languagePackages[0].id;
      },
      stage: 5,
      queryInterval: 0,
    },
  ],
  groups: [],
};

const roles = [];

async function up({ context: queryInterface }) {
  await queryInterface.bulkInsert('roles', seeds.roles);
  await queryInterface.bulkInsert('users', seeds.users);
  await queryInterface.bulkInsert('languagePackages', seeds.languagePackages);
  await queryInterface.bulkInsert('drawers', seeds.drawers);
}

async function down({ context: queryInterface }) {
  await queryInterface.bulkDelete('roles', { name: seeds.roles.map((u) => u.name) });
  await queryInterface.bulkDelete('users', { name: seeds.users.map((u) => u.name) });
  await queryInterface.bulkDelete('languagePackages', { name: seeds.languagePackages.map((u) => u.name) });
  await queryInterface.bulkDelete('drawers', { name: seeds.drawers.map((u) => u.drawers) });

}

module.exports = { up, down };
