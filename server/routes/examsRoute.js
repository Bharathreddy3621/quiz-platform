const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
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

router.post("/add", authMiddleware, addExam);
router.post("/get-all-exams", authMiddleware, getAllExams);
router.post("/get-exam-by-id", authMiddleware, getExamById);
router.post("/edit-exam-by-id", authMiddleware, editExamById);
router.post("/delete-exam-by-id", authMiddleware, deleteExamById);
router.post("/add-question-to-exam", authMiddleware, addQuestionToExam);
router.post("/edit-question-in-exam", authMiddleware, editQuestionInExam);
router.post("/delete-question-in-exam", authMiddleware, deleteQuestionInExam);


module.exports = router;
