const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        validate: { len: [2, 32] },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      tableName: 'users',
    }
  );

  User.associate = (db) => {
    User.belongsTo(db.Role, { foreignKey: 'roleId' });

    User.hasMany(db.LanguagePackage);
    User.hasMany(db.Group);
    User.hasMany(db.Drawer);
    User.hasMany(db.VocabularyCard);
    User.hasMany(db.Translation);
  };

  return User;
};
