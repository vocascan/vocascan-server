const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
  const LearnedToday = sequelize.define(
    'LearnedToday',
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
      learnedTodayRight: {
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
      tableName: 'learnedToday',
    }
  );

  LearnedToday.associate = (db) => {
    LearnedToday.belongsTo(db.User, { foreignKey: 'userId' });
    LearnedToday.belongsTo(db.LanguagePackage, { foreignKey: 'languagePackageId' });
  };

  return LearnedToday;
};
