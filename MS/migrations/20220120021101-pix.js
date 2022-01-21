'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    return await queryInterface.createTable('pix', { 
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      cpf_origin:{
        type: Sequelize.STRING,
        references: {
          model: 'clients',
          key: 'cpf_number'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      cpf_destination:{
        type: Sequelize.STRING,
        references: {
          model: 'clients',
          key: 'cpf_number'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      pix_value:{
        type: Sequelize.FLOAT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
     
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable('pix');
  }
};
