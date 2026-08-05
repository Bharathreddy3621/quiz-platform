const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/usersController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/get-user-info", authMiddleware, getUserInfo);

module.exports = router;
