'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Client_Account', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      client_id:{
        type: Sequelize.INTEGER,
        references: {
          model: 'clients',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      current_balance:{
        type: Sequelize.FLOAT,
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
    }).t
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Client_Account')
  }
};
