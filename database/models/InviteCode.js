const { DataTypes, UUIDV4 } = require('sequelize');
var RandExp = require('randexp');

module.exports = (sequelize) => {
  const InviteCode = sequelize.define(
    'InviteCode',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        unique: true,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
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

  InviteCode.associate = (db) => {
    InviteCode.belongsTo(db.User, { foreignKey: 'userId' });
  };

  return InviteCode;
};
