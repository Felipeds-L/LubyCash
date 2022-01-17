'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        return await queryInterface.createTable('client_accounts', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            client_owner: {
                type: Sequelize.STRING,
                references: {
                    model: 'clients',
                    key: 'email'
                },
                unique: true,
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
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
