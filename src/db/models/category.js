'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Product,{
        foreignKey : 'categoryId',
        onDelete : 'CASCADE',
        onUpdate : 'CASCADE',
      });
    }
  }
  Category.init({
    type: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull: true,
        notEmpty : true,
        len : {
          args : [5,20],
          msg : 'type minimal 5 dan maksimal 20',
        }
      }
    },
    sold_product_amount : DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};