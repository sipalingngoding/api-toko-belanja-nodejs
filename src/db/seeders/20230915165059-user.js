'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users',[{
      fullName : 'Diory Pribadi Sinaga',
      email : 'diory@gmail.com',
      password : bcrypt.hashSync('Diory123?',10),
      gender : 'male',
      role :'customer',
      balance : 0,
      createdAt : new Date(),
      updatedAt : new Date(),
    }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users',null,{})
  }
};
