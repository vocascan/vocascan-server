const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define(
    'Role',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        validate: { len: [2, 32] },
      },
      adminRights: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'roles',
    }
  );

  Role.associate = (db) => {
    Role.hasMany(db.User, { foreignKey: 'roleId', onDelete: 'cascade', hooks: true });
  };

  return Role;
};
