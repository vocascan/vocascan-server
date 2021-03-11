// MODEL
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Roles = sequelize.define(
    'roles',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            validate: { len: [2, 32] },
        },
        admin_rights: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
      sequelize,
    }
  );

  Roles.associate = (db) => {
    Roles.hasMany(db.File);
    Roles.hasOne(db.Setting);
  };

  return Roles;
};