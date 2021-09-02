const { DataTypes, UUIDV4 } = require('sequelize');
var RandExp = require('randexp');

module.exports = (sequelize) => {
  const InviteCode = sequelize.define(
    'InviteCode',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
        defaultValue: new RandExp(/^[a-zA-Z0-9]{8}$/).gen(),
        allowNull: false,
      },
      uses: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      maxUses: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'inviteCodes',
    }
  );

  return InviteCode;
};
