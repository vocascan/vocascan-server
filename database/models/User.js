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
        allowNull: false,
        unique: true,
        validate: { len: [2, 32] },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [1, 255] },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [8, 255] },
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'users',
    }
  );

  User.associate = (db) => {
    User.belongsTo(db.Role, { foreignKey: 'roleId' });

    User.hasMany(db.Drawer, { foreignKey: 'userId', onDelete: 'cascade', hooks: true });
    User.hasMany(db.InviteCode, { foreignKey: 'userId', onDelete: 'cascade', hooks: true });
    User.hasMany(db.Group, { foreignKey: 'userId', onDelete: 'cascade', hooks: true });
    User.hasMany(db.LanguagePackage, { foreignKey: 'userId', onDelete: 'cascade', hooks: true });
    User.hasMany(db.PackageProgress, { foreignKey: 'userId', onDelete: 'cascade', hooks: true });
    User.hasMany(db.Translation, { foreignKey: 'userId', onDelete: 'cascade', hooks: true });
    User.hasMany(db.VocabularyCard, { foreignKey: 'userId', onDelete: 'cascade', hooks: true });
  };

  return User;
};
