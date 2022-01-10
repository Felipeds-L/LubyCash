const User_Status = (Sequelize, DataTypes) => {
  return Sequelize.define('user_status', {
    user_id: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  });
};

module.exports = User_Status;