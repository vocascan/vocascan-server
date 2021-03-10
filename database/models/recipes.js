'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class recipes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  recipes.init({
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
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    public: DataTypes.BOOLEAN,
    image: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    category_id: {
      type: DataTypes.INTEGER,
      references: {
          model: 'categories',
          key: 'id'
      }
    }}, {
    sequelize,
    modelName: 'recipes',
  });
  return recipes;
};