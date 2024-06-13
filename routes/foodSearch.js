const router = require("express").Router();
const Food = require("../models").food;
const customFood = require("../models").customFood;
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + "/../.env" });

const secretKey = process.env.SECRET_KEY;

// JWT 驗證
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // 如果沒有 token，

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.sendStatus(403); // 如果 token 不合法
    next();
  });
}

router.get("/foodSearch", async (req, res) => {
  // 從資料庫中取出所有食物
  try {
    let foodList = await Food.find({}, { foodName: 1, _id: 0 });
    return res.send(foodList);
  } catch (e) {
    console.log("存取food資料庫失敗" + e.message);
    return res.status(500).send("存取food資料庫失敗");
  }
});

router.get("/foodSearch/:foodType", async (req, res) => {
  // 從資料庫中取出特定食物
  try {
    let foodType = req.params.foodType;
    let foodList = await Food.find(
      { foodType: foodType },
      { foodName: 1, _id: 0 }
    );
    return res.send(foodList);
  } catch (e) {
    console.log("存取food資料庫失敗" + e.message);
    return res.status(500).send("存取food資料庫失敗");
  }
});

router.get(
  "/foodSearch/user/:userEmail",
  authenticateToken,
  async (req, res) => {
    // 從個人資料庫取出食物
    try {
      let email = req.params.userEmail;
      let foodList = await customFood.find({ userEmail: email });

      return res.send(foodList);
    } catch (e) {
      console.log("存取資料庫失敗" + e.message);
      return res.status(500).send("存取food資料庫失敗");
    }
  }
);

//刪除食物
router.patch("/foodDelete", authenticateToken, async (req, res) => {
  const email = req.query.email;
  const foodName = req.query.foodName; // 從查詢參數中獲取要刪除的食物名稱

  try {
    console.log(foodName);
    let result = await customFood.updateOne(
      { userEmail: email },
      { $pull: { foods: { foodName: foodName } } } // 使用 $pull 運算符從數組中刪除特定食物
    );
    console.log("刪除成功", result);

    // 將刪完食物的 list 傳回去
    let foodList = await customFood.findOne({ userEmail: email });
    console.log(foodList);
    return res.send(foodList);
  } catch (e) {
    console.log("刪除失敗" + e.message);
    return res.status(500).send("刪除失敗");
  }
});
//新增食物
router.patch("/foodInsert", authenticateToken, async (req, res) => {
  const email = req.query.email;
  const foodName = req.query.foodName;
  const foodType = req.query.foodType;
  try {
    console.log(foodName, foodType);
    let result = await customFood.updateOne(
      { userEmail: email },
      { $push: { foods: { foodName: foodName, foodType: foodType } } }
    );
    console.log("新增成功", result);

    return res.send(foodName + "新增成功");
  } catch (e) {
    console.log("新增失敗" + e.message);
    return res.status(500).send("新增失敗");
  }
});
module.exports = router;
