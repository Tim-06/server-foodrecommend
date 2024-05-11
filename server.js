const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const authRoute = require("./routes/auth");
const foodRouter = require("./routes/foodSearch");
const port = process.env.PORT || 8080;

//連接DB
mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => {
    console.log("資料庫連接成功");
  })
  .catch((e) => {
    console.log(e + "資料庫連接失敗");
  });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); //處理跨源請求。
app.use("/api/user", authRoute);
app.use("/getFood", foodRouter);

app.listen(port, () => {
  console.log("後端伺服器聆聽在port " + port);
});
