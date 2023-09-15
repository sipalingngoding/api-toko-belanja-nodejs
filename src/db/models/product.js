'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category,{
        foreignKey : 'categoryId',
        onDelete : 'CASCADE',
        onUpdate : 'CASCADE',
      });

      Product.hasMany(models.TransactionHistory,{
        foreignKey : 'productId'
      })
    }
  }
  Product.init({
    title: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : true,
        notEmpty :true,
        len: {
          args : [5,20],
          msg : 'title minimal 5 dan maksimal 20',
        }
      }
    },
    stock : {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notNull: true,
        notEmpty: true,
        isInt : {
          msg :'Stock harus integer',
        },
        // min : {
        //   args : [5],
        //   msg : 'Stock Minimal 5',
        // },
        // validateStockMin(value) {
        //   // Only validate the minimum stock requirement for new records (creates)
        //   if (this.isNewRecord && value < 5) {
        //     throw new Error('Minimum stock is 5 for new records'+ this.isNewRecord + " " +this.ok);
        //   }
        // },
      }
    },
    price : {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        isInt : {
          msg  :'Price harus integer'
        },
        min: {
          args : [0],
          msg : 'Price minimal 0 Rupiah',
        },
        max : {
          args : [50000000],
          msg : 'Price max 50 Jt',
        }
      }
    },
    categoryId : {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notNull : true,
        notEmpty : true,
        isInt : {
          msg : 'categoryId haruslah integer'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};