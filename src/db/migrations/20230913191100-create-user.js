'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullName : {
        allowNull : false,
        type : Sequelize.STRING,
      },
      email: {
        allowNull : false,
        type: Sequelize.STRING,
        unique : true,
      },
      password : {
        allowNull : false,
        type : Sequelize.STRING,
      },
      gender : {
        allowNull : false,
        type : Sequelize.ENUM,
        values : ['male','female'],
      },
      role : {
        allowNull : false,
        type :Sequelize.ENUM,
        values: ['admin','customer'],
      },
      balance : {
        allowNull :  false,
        type : Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};