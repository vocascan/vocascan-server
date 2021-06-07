const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
  const PackageProgress = sequelize.define(
    'PackageProgress',
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
      date: {
        type: DataTypes.DATEONLY,
        defaultValue: new Date(),
        allowNull: false,
      },
      learnedTodayCorrect: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      learnedTodayWrong: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'packageProgress',
    }
  );

  PackageProgress.associate = (db) => {
    PackageProgress.belongsTo(db.User, { foreignKey: 'userId' });
    PackageProgress.belongsTo(db.LanguagePackage, { foreignKey: 'languagePackageId' });
  };

  return PackageProgress;
};
