const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");

app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1", authRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

module.exports = app;
