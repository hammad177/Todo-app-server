const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const SessionModel = sequelize.define("session", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  refresh_token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = SessionModel;
