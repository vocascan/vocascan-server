const { Sequelize, DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
    await queryInterface.createTable('Groups', {
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
        active: {
            type: DataTypes.BOOLEAN,
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
    await queryInterface.dropTable('Groups');
}

module.exports = { up, down };