const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const router = require("express").Router();
const {
  addReport,
  getAllReports,
  getAllReportsByUser,
} = require("../controllers/reportsController");

router.post("/add-report", authMiddleware, addReport);
router.post("/get-all-reports", adminMiddleware, getAllReports);
router.post("/get-all-reports-by-user", authMiddleware, getAllReportsByUser);

module.exports = router;
