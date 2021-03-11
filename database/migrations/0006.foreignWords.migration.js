const { DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
    await queryInterface.createTable('foreign_words', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        language_package_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'language_packages',
                key: 'id'
            }
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'groups',
                key: 'id'
            }
        },
        drawer_id: {
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