// const jwt = require("jsonwebtoken");
const UsersModel = require("../models/user");
const jwt = require("../utils/jwt");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "").trim();
    const decoded_token = jwt.verifyTokens("access", token);
    const user = await UsersModel.findOne({
      id: decoded_token.id,
    });
    if (!user) {
      return res
        .status(403)
        .json({ status: false, message: "please login first" });
    }

    req.session_id = decoded_token.session_id;
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ status: false, message: "please login first" });
  }
};

module.exports = auth;
