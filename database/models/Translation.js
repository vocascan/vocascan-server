const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
  const Translation = sequelize.define(
    'Translation',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      foreignWordId: {
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
    },
    {
      sequelize,
      tableName: 'Translation',
    }
  );

  return Translation;
};
