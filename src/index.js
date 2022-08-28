require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
const sequelize = require("./database/sequelize");

app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/user"));
app.use("/api/todo", require("./routes/todo"));

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });
