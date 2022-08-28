const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");
const SessionModel = require("./session");
const TodoModel = require("./todo");

const UserModel = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

UserModel.hasMany(TodoModel);
UserModel.hasMany(SessionModel);

module.exports = UserModel;
