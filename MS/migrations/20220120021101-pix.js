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
      user_id_from:{
        type: Sequelize.STRING,
        references: {
          model: 'clients',
          key: 'cpf_number'
        },
        unique: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id_to:{
        type: Sequelize.STRING,
        references: {
          model: 'clients',
          key: 'cpf_number'
        },
        unique: true,
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
