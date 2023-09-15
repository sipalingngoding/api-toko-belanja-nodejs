'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Products',{
      fields : ['categoryId'],
      type : 'foreign key',
      name : 'fk-products-categoryId',
      references : {
          table : 'Categories',
          field :'id',
      },
      onDelete : 'CASCADE',
      onUpdate : 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Products",'fk-products-categoryId');
  }
};
