const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");

const port = 3000 || process.env.PORT;

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connection successful");
    // console.log(connect.connections)
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

app.listen(port, (req, res) => {
  console.log(`server started at ${port}`);
});
