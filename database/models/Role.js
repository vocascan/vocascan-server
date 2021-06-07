const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define(
    'Role',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
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
