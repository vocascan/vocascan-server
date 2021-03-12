const { DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
    await queryInterface.createTable('translatedWords', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        foreignWordId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'foreignWords',
                key: 'id'
            }
        },
        languagePackageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'languagePackages',
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
    await queryInterface.dropTable('translated_words');
}

module.exports = { up, down };