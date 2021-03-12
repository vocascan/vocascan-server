// MODEL
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define(
    'Role',
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
        adminRights: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
      sequelize,
    }
  );

  return Role;
};