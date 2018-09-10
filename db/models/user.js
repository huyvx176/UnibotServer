'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    username: DataTypes.STRING,
    hash_password: DataTypes.STRING,
    status: DataTypes.INTEGER,
    token: DataTypes.TEXT
  }, {});
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};