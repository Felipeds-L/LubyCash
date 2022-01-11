'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        return await queryInterface.createTable('client_account', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            client_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'clients',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            current_balance: {
                type: Sequelize.FLOAT
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
