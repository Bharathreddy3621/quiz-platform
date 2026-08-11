const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const {
  addExam,
  getAllExams,
  getExamById,
  editExamById,
  deleteExamById,
  addQuestionToExam,
  editQuestionInExam,
  deleteQuestionInExam,
} = require("../controllers/examsController");

router.post("/add", adminMiddleware, addExam);
router.post("/get-all-exams", authMiddleware, getAllExams);
router.post("/get-exam-by-id", authMiddleware, getExamById);
router.post("/edit-exam-by-id", adminMiddleware, editExamById);
router.post("/delete-exam-by-id", adminMiddleware, deleteExamById);
router.post("/add-question-to-exam", adminMiddleware, addQuestionToExam);
router.post("/edit-question-in-exam", adminMiddleware, editQuestionInExam);
router.post("/delete-question-in-exam", adminMiddleware, deleteQuestionInExam);


module.exports = router;
