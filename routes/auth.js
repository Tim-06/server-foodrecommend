const router = require("express").Router();
const User = require("../models").user;
const CustomFood = require("../models").customFood;
const Food = require("../models").food;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: __dirname + "/../.env" });

const secretKey = process.env.SECRET_KEY;
router.use((req, res, next) => {
  console.log("正在接收一個跟auth有關的請求");
  next();
});

router.post("/register", async (req, res) => {
  console.log("成功連結register");

  // 確認信箱是否被註冊過
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("此信箱已經被註冊過了。。。");
  }

  // 製作新用戶
  let { email, password } = req.body;
  try {
    password = await bcrypt.hash(password, 10); // 使用 await 等待密碼加密完成
    console.log("加密成功", password);
    // 新增用戶信箱密碼
    const newUser = await User.create({ email, password });
    console.log("newUser已成功新增", newUser);

    // 新增CustomFood
    const newCustomFood = await CustomFood.create({
      userEmail: email,
      foods: [], // 將 foods 初始化為一個空陣列
    });

    // 將食物名稱和類型添加到 foods 陣列中
    const defaultFood = await Food.find({});
    defaultFood.forEach((item) => {
      newCustomFood.foods.push({
        foodName: item.foodName,
        foodType: item.foodType,
      });
    });

    // 保存到資料庫
    try {
      await newCustomFood.save();
      console.log("newCustomFood已成功保存");
    } catch (error) {
      console.error("存newCustomFood時發生錯誤：", error);
    }

    return res.send({
      msg: "使用者成功儲存。",
      newUser,
    });
  } catch (e) {
    console.error("發生錯誤:", e);
    return res.status(500).send("發生錯誤:" + e);
  }
});

router.post("/login", async (req, res) => {
  // 確認信箱是否被註冊過
  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser) {
    return res.status(401).send("無法找到使用者。請確認信箱是否正確。");
  }

  // 確認密碼是否正確
  const hashedPasswordFromDatabase = foundUser.password; // 從資料庫中獲取的加密後的密碼

  bcrypt.compare(
    req.body.password,
    hashedPasswordFromDatabase,
    function (err, result) {
      if (err) {
        console.error("比較密碼時發生錯誤:", err);
        return res.status(401).send("登入失敗。");
      }

      if (result) {
        const tokenObject = { _id: foundUser._id, email: foundUser.email };
        const token = jwt.sign(tokenObject, secretKey, { expiresIn: "3h" });
        return res.send({
          message: "成功登入",
          token: token,
          user: foundUser,
        });
      } else {
        console.log(
          "原始密碼:" +
            req.body.password +
            "加密密碼:" +
            hashedPasswordFromDatabase
        );
        return res.status(401).send("密碼錯誤");
      }
    }
  );
});

module.exports = router;
