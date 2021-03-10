'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ingredients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ingredients.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING,
      references: {
          model: 'users',
          key: 'id'
      }
    },
    portion_id: {
      type: DataTypes.INTEGER,
      references: {
          model: 'portions',
          key: 'id'
      }
    },
    name: DataTypes.STRING,
    value: DataTypes.STRING,
    public: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'ingredients',
  });
  return ingredients;
};