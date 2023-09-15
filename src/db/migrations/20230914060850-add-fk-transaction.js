'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addConstraint('TransactionHistories',{
       fields : ['productId'],
       type : 'foreign key',
       name : 'fk-transaction-productId',
       references : {
         table : 'Products',
         field : 'id',
       },
       onDelete : 'CASCADE',
       onUpdate : 'CASCADE',
      })
      await queryInterface.addConstraint('TransactionHistories',{
       fields : ['userId'],
       type : 'foreign key',
        name : 'fk-transaction-userId',
       references : {
         table : 'Users',
         field : 'id',
       },
       onDelete : 'CASCADE',
       onUpdate : 'CASCADE',
      })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('TransactionHistories','fk-transaction-productId');
    await queryInterface.removeConstraint('TransactionHistories','fk-transaction-userId');
  }
};
