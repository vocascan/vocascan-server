const { Sequelize, DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
    await queryInterface.createTable('TranslatedWords', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        foreignWordId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'ForeignWords',
                key: 'id'
            }
        },
        languagePackageId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'LanguagePackages',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
  });
}

async function down({ context: queryInterface }) {
    await queryInterface.dropTable('TranslatedWords');
}

module.exports = { up, down };