const express = require("express");
const UserModel = require("../models/user");
const SessionModel = require("../models/session");
const jwt = require("../utils/jwt");
const argon = require("argon2");
const auth = require("../middleware/auth");

const routes = express.Router();

routes.post("/signup", async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await argon.hash(req.body.password);
    }
    const user = await UserModel.create(req.body);

    const payload = {
      id: user.id,
    };
    const refresh_token = jwt.generateRefreshTokens(payload);
    const session = await SessionModel.create({
      userId: user.id,
      refresh_token,
    });
    const access_token = jwt.generateAccessTokens({
      ...payload,
      session_id: session.id,
    });

    res.status(201).json({ status: true, access_token, refresh_token });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      message = error.errors[0].message;
      return res.status(409).json({ status: false, message });
    }
    res.status(500).json({ status: false, message: "server side error" });
  }
});

routes.post("/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Credentials" });
    }

    const isVerify = await argon.verify(user.password, req.body.password);
    if (!isVerify) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Credentials" });
    }

    const payload = {
      id: user.id,
    };
    const refresh_token = jwt.generateRefreshTokens(payload);
    const session = await SessionModel.create({
      userId: user.id,
      refresh_token,
    });
    const access_token = jwt.generateAccessTokens({
      ...payload,
      session_id: session.id,
    });

    res.status(200).json({ status: true, access_token, refresh_token });
  } catch (error) {
    res.status(500).json({ status: false, message: "server side error" });
  }
});

routes.post("/logout", auth, async (req, res) => {
  try {
    const token = req.body.token;

    if (!token) {
      return res
        .status(400)
        .json({ status: false, message: "send refresh token" });
    }

    const user = await SessionModel.destroy({
      where: {
        id: req.session_id,
        userId: req.user.id,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "failed to logout user" });
    }

    res.status(200).json({ status: true, message: "user logout successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: "server side error" });
  }
});

routes.post("/refresh-token", async (req, res) => {
  try {
    const token = req.body.token;
    const hasRefreshToken = await SessionModel.findOne({
      where: {
        refresh_token: token,
      },
    });

    if (!hasRefreshToken)
      return res.status(400).json({ status: false, message: "login first" });
    const isVerified = jwt.verifyTokens("refresh", token);
    if (!isVerified)
      return res.status(400).json({ status: false, message: "login first" });

    const payload = {
      id: hasRefreshToken.userId,
      session_id: hasRefreshToken.id,
    };

    const accessToken = jwt.generateAccessTokens(payload);

    res.json({ status: true, accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "server side error" });
  }
});

module.exports = routes;
