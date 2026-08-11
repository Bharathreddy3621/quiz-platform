const Exam = require("../models/examModel");
const Report = require("../models/reportModel");
const User = require("../models/userModel");
const { sendError, sendFailure, sendSuccess } = require("../utils/apiResponse");

const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const addReport = async (req, res) => {
  try {
    const exam = await Exam.findById(req.body.exam).populate("questions");
    if (!exam) {
      return sendFailure(res, "Exam not found", undefined, 200);
    }

    const user = await User.findById(req.body.userId);
    if (!user) {
      return sendFailure(res, "User not found", undefined, 200);
    }

    const selectedOptions = req.body.selectedOptions || {};
    const answers = (exam.questions || []).map((question, index) => {
      const selectedOption = selectedOptions[index];
      const correctOption = question.correctOption;
      const isCorrect = selectedOption === correctOption;

      return {
        question: question._id,
        questionText: question.name,
        selectedOption: selectedOption || null,
        selectedAnswer: selectedOption ? question.options?.[selectedOption] : null,
        correctOption,
        correctAnswer: question.options?.[correctOption] || null,
        isCorrect,
      };
    });

    const correctAnswers = answers.filter((answer) => answer.isCorrect);
    const wrongAnswers = answers.filter((answer) => !answer.isCorrect);
    const score = correctAnswers.length;
    const verdict = score >= exam.passingMarks ? "Pass" : "Fail";

    const result = {
      correctAnswers,
      wrongAnswers,
      answers,
      score,
      verdict,
    };

    const newReport = new Report({
      user: user._id,
      exam: exam._id,
      result,
    });
    const savedReport = await newReport.save();

    sendSuccess(res, "Attempt added successfully", savedReport);
  } catch (error) {
    sendError(res, error);
  }
};

const getAllReports = async (req, res) => {
  try {
    const { examName, userName } = req.body;
    const safeExamName = escapeRegex(examName);
    const safeUserName = escapeRegex(userName);

    const exams = await Exam.find({
      name: {
        $regex: new RegExp(safeExamName, "i"),
      },
    });

    const matchedExamIds = exams.map((exam) => exam._id);

    const users = await User.find({
      name: {
        $regex: new RegExp(safeUserName, "i"),
      },
    });

    const matchedUserIds = users.map((user) => user._id);

    const reports = await Report.find({
      exam: {
        $in: matchedExamIds,
      },
      user: {
        $in: matchedUserIds,
      },
    })
      .populate("exam")
      .populate("user")
      .sort({ createdAt: -1 });

    sendSuccess(res, "Attempts fetched successfully", reports);
  } catch (error) {
    sendError(res, error);
  }
};

const getAllReportsByUser = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.body.userId })
      .populate("exam")
      .populate("user")
      .sort({ createdAt: -1 });

    sendSuccess(res, "Attempts fetched successfully", reports);
  } catch (error) {
    sendError(res, error);
  }
};

module.exports = {
  addReport,
  getAllReports,
  getAllReportsByUser,
};
