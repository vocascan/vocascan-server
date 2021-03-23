const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
  const Drawer = sequelize.define(
    'Drawer',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
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
      tableName: 'drawers',
    }
  );

  Drawer.associate = (db) => {
    Drawer.belongsTo(db.User, { foreignKey: 'userId' });
    Drawer.belongsTo(db.LanguagePackage, { foreignKey: 'languagePackageId' });

    Drawer.hasMany(db.VocabularyCard, { foreignKey: 'drawerId' });
  };

  return Drawer;
};
