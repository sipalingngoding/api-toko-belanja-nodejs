'use strict';
const {
  Model, Transaction
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionHistory extends Model {
    static associate(models) {
      TransactionHistory.belongsTo(models.Product,{
        foreignKey : 'productId',
        onDelete : 'CASCADE',
        onUpdate :'CASCADE',
      });

      TransactionHistory.belongsTo(models.User,{
        foreignKey : 'userId',
        onDelete : 'CASCADE',
        onUpdate :'CASCADE',
      })
    }
  }
  TransactionHistory.init({
    productId: {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notEmpty : false,
        notNull : false,
      }
    },
    userId: {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notEmpty : false,
        notNull : false,
      }
    },
    quantity : {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notEmpty : false,
        notNull : false,
      }
    },
    totalPrice : {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notEmpty : false,
        notNull : false,
      },
    }

  }, {
    sequelize,
    modelName: 'TransactionHistory',
  });
  return TransactionHistory;
};