// MODEL
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Group = sequelize.define(
    'Group',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        languagePackageId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
        {
        sequelize,
        }
    );
    
    return Group;
};