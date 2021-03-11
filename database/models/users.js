// MODEL
const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
  const Users = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.UUIDV4,
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
      role_id: {
        type: DataTypes.INTEGER,
        defaultValue: false,
        references: {
          model: 'roles',
          key: 'id'
        }
      },
    },
    {
      sequelize,
    }
  );

  Users.associate = (db) => {
    Users.hasMany(db.File);
    Users.hasOne(db.Setting);
  };

  return Users;
};