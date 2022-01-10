const Cliente = (Sequelize, DataTypes) => {
  return Sequelize.define('clients', {
    user_id: DataTypes.INTEGER
  });
};

module.exports = Cliente;