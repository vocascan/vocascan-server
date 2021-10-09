const { DataTypes, UUIDV4 } = require('sequelize');
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 8 }).collisionProbability(1000 * 60 * 60 * 24 * 365 * 100, 8);

module.exports = (sequelize) => {
  // 1.019365018855e-8
  const InviteCode = sequelize.define(
    'InviteCode',
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
      code: {
        type: DataTypes.STRING,
        defaultValue: () => uid(),
        allowNull: false,
        unique: true,
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
