// MODEL
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Drawer = sequelize.define(
    'Drawer',
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
        queryInterval: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
        {
        sequelize,
        }
    );


    return Drawer;
};