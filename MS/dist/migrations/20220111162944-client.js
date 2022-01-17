'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        return await queryInterface.createTable('clients', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            full_name: Sequelize.STRING,
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: true,
                unique: true
            },
            cpf_number: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            address: {
                type: Sequelize.STRING,
            },
            city: {
                type: Sequelize.STRING,
            },
            state: {
                type: Sequelize.STRING,
            },
            zipcode: {
                type: Sequelize.STRING,
            },
            average_salary: {
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
        return await queryInterface.dropTable('clients');
    }
};
