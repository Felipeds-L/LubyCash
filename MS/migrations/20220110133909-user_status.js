'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   return queryInterface.createTable('User_Status', {
     id: {
       type: Sequelize.INTEGER,
       primaryKey: true,
       autoIncrement: true,
       allowNull: false
     },
     user_id:{
      type: Sequelize.INTEGER,
        allowNull: false
     },
     status:{
       type: Sequelize.BOOLEAN,
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
   })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('User_Status')
  }
};
