const mongoose = require("mongoose");
const Exam = require("../models/examModel");
const Question = require("../models/questionModel");
const User = require("../models/userModel");
const { sendError, sendFailure, sendSuccess } = require("../utils/apiResponse");

const addExam = async (req, res) => {
  try {
    const examExists = await Exam.findOne({ name: req.body.name });
    if (examExists) {
      return sendFailure(res, "Exam already exists", undefined, 200);
    }

    req.body.questions = [];
    const newExam = new Exam(req.body);
    await newExam.save();

    sendSuccess(res, "Exam added successfully");
  } catch (error) {
    sendError(res, error);
  }
};

const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find({});
    sendSuccess(res, "Exams fetched successfully", exams);
  } catch (error) {
    sendError(res, error);
  }
};

const getExamById = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId).select("isAdmin");
    if (!user) {
      return sendFailure(res, "User not found", undefined, 200);
    }

    const examQuery = Exam.findById(req.body.examId).select(
      "name duration category totalMarks passingMarks questions"
    );

    if (user.isAdmin) {
      examQuery.populate("questions");
    } else {
      examQuery.populate({
        path: "questions",
        select: "name options",
      });
    }

    const exam = await examQuery;
    if (!exam) {
      return sendFailure(res, "Exam not found", undefined, 200);
    }

    sendSuccess(res, "Exam fetched successfully", exam);
  } catch (error) {
    sendError(res, error);
  }
};

const editExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.body.examId);
    if (!exam) {
      return sendFailure(res, "Exam not found", undefined, 200);
    }

    const duplicateExam = await Exam.findOne({
      name: req.body.name,
      _id: { $ne: req.body.examId },
    });
    if (duplicateExam) {
      return sendFailure(res, "Exam already exists", undefined, 200);
    }

    const updatePayload = {
      name: req.body.name,
      duration: req.body.duration,
      category: req.body.category,
      totalMarks: req.body.totalMarks,
      passingMarks: req.body.passingMarks,
    };

    await Exam.findByIdAndUpdate(req.body.examId, updatePayload);
    sendSuccess(res, "Exam edited successfully");
  } catch (error) {
    sendError(res, error);
  }
};

const deleteExamById = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    let examFound = false;

    await session.withTransaction(async () => {
      const exam = await Exam.findById(req.body.examId).session(session);
      if (!exam) {
        return;
      }

      examFound = true;
      await Exam.findOneAndDelete({ _id: req.body.examId }).session(session);
    });

    if (!examFound) {
      return sendFailure(res, "Exam not found", undefined, 200);
    }

    sendSuccess(res, "Exam deleted successfully");
  } catch (error) {
    sendError(res, error);
  } finally {
    session.endSession();
  }
};

const addQuestionToExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.body.exam);
    if (!exam) {
      return sendFailure(res, "Exam not found", undefined, 200);
    }

    const newQuestion = new Question(req.body);
    const question = await newQuestion.save();

    exam.questions.push(question._id);
    await exam.save();

    sendSuccess(res, "Question added successfully");
  } catch (error) {
    sendError(res, error);
  }
};

const editQuestionInExam = async (req, res) => {
  try {
    const question = await Question.findById(req.body.questionId);
    if (!question) {
      return sendFailure(res, "Question not found", undefined, 200);
    }

    const exam = await Exam.findById(req.body.exam);
    if (!exam) {
      return sendFailure(res, "Exam not found", undefined, 200);
    }

    const updatePayload = {
      name: req.body.name,
      correctOption: req.body.correctOption,
      options: req.body.options,
    };

    await Question.findByIdAndUpdate(req.body.questionId, updatePayload);
    sendSuccess(res, "Question edited successfully");
  } catch (error) {
    sendError(res, error);
  }
};

const deleteQuestionInExam = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    let questionFound = false;

    await session.withTransaction(async () => {
      const question = await Question.findById(req.body.questionId).session(
        session
      );
      if (!question) {
        return;
      }

      questionFound = true;

      const examId = req.body.examId || question.exam;
      const exam = await Exam.findById(examId).session(session);
      if (!exam) {
        throw new Error("Exam not found");
      }

      if (question.exam && exam._id.toString() !== question.exam.toString()) {
        throw new Error("Question does not belong to the provided exam");
      }

      await Question.findOneAndDelete({ _id: req.body.questionId }).session(
        session
      );
    });

    if (!questionFound) {
      return sendFailure(res, "Question not found", undefined, 200);
    }

    sendSuccess(res, "Question deleted successfully");
  } catch (error) {
    if (error.message === "Exam not found") {
      return sendFailure(res, "Exam not found", undefined, 200);
    }

    if (error.message === "Question does not belong to the provided exam") {
      return sendFailure(
        res,
        "Question does not belong to the provided exam",
        undefined,
        200
      );
    }

    sendError(res, error);
  } finally {
    session.endSession();
  }
};

module.exports = {
  addExam,
  getAllExams,
  getExamById,
  editExamById,
  deleteExamById,
  addQuestionToExam,
  editQuestionInExam,
  deleteQuestionInExam,
};
