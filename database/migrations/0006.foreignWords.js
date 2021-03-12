const { DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
    await queryInterface.createTable('foreignWords', {
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
        languagePackageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'languagePackages',
                key: 'id'
            }
        },
        groupId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'groups',
                key: 'id'
            }
        },
        drawerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'drawers',
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
    await queryInterface.dropTable('foreign_words');
}

module.exports = { up, down };