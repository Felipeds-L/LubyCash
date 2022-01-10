const Cliente_Account = (Sequelize, DataTypes) => {
  return Sequelize.define('cliente_account', {
    user_id: DataTypes.INTEGER,
    current_balance: DataTypes.FLOAT
  });
};

module.exports = Cliente_Account;