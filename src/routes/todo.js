const express = require("express");
const auth = require("../middleware/auth");
const TodoModel = require("../models/todo");
const { Op } = require("sequelize");
const {
  dateBoundariesByLast30Days,
  dateBoundariesLastSevenDays,
} = require("../utils/time-filter");

const routes = express.Router();

routes.post("/", auth, async (req, res) => {
  try {
    const todo = await TodoModel.create({
      ...req.body,
      userId: req.user.id,
    });
    if (!todo) {
      return res
        .status(400)
        .json({ status: false, message: "failed to create new todo" });
    }
    res.status(201).json({ status: true, todo });
  } catch (error) {
    res.status(500).json({ status: true, message: "server side error" });
  }
});

routes.get("/all", auth, async (req, res) => {
  try {
    let todo;
    if (req.query.sort === 7) {
      const { startTime, endTime } = dateBoundariesLastSevenDays();
      todo = await TodoModel.findAll({
        where: {
          userId: req.user.id,
          createdAt: {
            [Op.gte]: sort && startTime,
            [Op.lt]: sort && endTime,
          },
        },
      });
    } else if (req.query.sort === 30) {
      const { startTime, endTime } = dateBoundariesByLast30Days();
      todo = await TodoModel.findAll({
        where: {
          userId: req.user.id,
          createdAt: {
            [Op.gte]: sort && startTime,
            [Op.lt]: sort && endTime,
          },
        },
      });
    } else {
      todo = await TodoModel.findAll({
        where: {
          userId: req.user.id,
        },
      });
    }

    res.status(200).json({ status: true, todo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: true, message: "server side error" });
  }
});

routes.patch("/:id", auth, async (req, res) => {
  const modifiedTodo = req.body;
  const filedToUpdate = Object.keys(modifiedTodo);
  const fieldsInModel = ["title", "description", "time", "isCompleted"];
  const isUpdateAllow = filedToUpdate.every((field) =>
    fieldsInModel.includes(field)
  );
  if (!isUpdateAllow) {
    return res.status(400).json({ status: false, message: "Invalid fields" });
  }
  try {
    const id = req.params.id;
    const todo = await TodoModel.findByPk(id);
    if (!todo) {
      return res.status(404).json({ status: false, message: "no todo found" });
    }

    Object.assign(todo, modifiedTodo);
    await todo.save();

    res.status(200).json({ status: true, todo });
  } catch (error) {
    res.status(500).json({ status: true, message: "server side error" });
  }
});

routes.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await TodoModel.destroy({
      where: {
        id,
      },
    });
    if (!todo) {
      return res.status(404).json({ status: false, message: "no todo found" });
    }

    res.status(200).json({ status: true, message: "todo has been deleted" });
  } catch (error) {
    res.status(500).json({ status: true, message: "server side error" });
  }
});

module.exports = routes;
