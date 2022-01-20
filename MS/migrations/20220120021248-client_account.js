'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('client_account', { 
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      client_cpf:{
        type: Sequelize.STRING,
        allowNull: false,
        references:{
          model: 'clients',
          key: "cpf_number"
        },
        unique: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      current_balance:{
        type: Sequelize.FLOAT,
        allowNull: true,
        default: 200
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
    return await queryInterface.dropTable('client_account');
    
  }
};
