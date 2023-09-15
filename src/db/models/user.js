'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.TransactionHistory,{
        foreignKey : 'userId',
      })
    }
  }
  User.init({
    fullName : {
      type :DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : true,
        notEmpty : true,
        len : {
          args : [8,20],
          msg : 'Full name minimal 8 karakter dan maksimal 20 karakter',
        }
      },
    },
    email: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        isEmail :{
          msg : 'format email invalid'
        },
        notNull : true,
        notEmpty : true,
      },
      unique : {
        args : true,
        msg : 'Email already exist'
      }
    },
    password : {
      type: DataTypes.STRING,
      allowNull : false,
      validate: {
        notNull: true,
        notEmpty: true,
        is : {
          args : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          msg : 'Password minimal 8 karakter, memuat huruf besar, number, dan karakter khusus',
        },
      },
    },
    gender : {
      type :DataTypes.ENUM,
      allowNull : false,
      values : ['male','female'],
      validate : {
        notNull : true,
        notEmpty : true,
        isIn : {
          args : [['male','female']],
          msg : 'gender haruslah male atau female!!',
        },
      }
    },
    role : {
      type :DataTypes.ENUM,
      allowNull : false,
      values: ['admin','customer'],
      validate : {
        notNull : true,
        notEmpty : true,
        isIn:  {
          args : [['admin','customer']],
          msg : 'role haruslah admin atau customer',
        }
      }
    },
    balance : {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : true,
        notEmpty : true,
        isInt : {
          msg : 'Balance harus integer'
        },
        len : {
          args : [0,100000000],
          msg : 'Min Balance 0, dan max balance 100Jt',
        }
      }
    }

  },{
    sequelize,
    modelName: 'User',
    hooks : {
      beforeCreate(attributes, options) {
        attributes.set('password',bcrypt.hashSync(attributes.password,10));
      },
    }
  });
  return User;
};