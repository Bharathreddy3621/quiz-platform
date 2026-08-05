const Exam = require("../models/examModel");
const Report = require("../models/reportModel");
const User = require("../models/userModel");
const { sendError, sendSuccess } = require("../utils/apiResponse");

const addReport = async (req, res) => {
  try {
    const exam = await Exam.findById(req.body.exam);
    if (!exam) {
      return sendFailure(res, "Exam not found", undefined, 200);
    }

    const userId = req.body.userId || req.body.user;
    const user = await User.findById(userId);
    if (!user) {
      return sendFailure(res, "User not found", undefined, 200);
    }

    const newReport = new Report({
      ...req.body,
      user: user._id,
    });
    await newReport.save();

    sendSuccess(res, "Attempt added successfully");
  } catch (error) {
    sendError(res, error);
  }
};

const getAllReports = async (req, res) => {
  try {
    const { examName, userName } = req.body;

    const exams = await Exam.find({
      name: {
        $regex: examName,
      },
    });

    const matchedExamIds = exams.map((exam) => exam._id);

    const users = await User.find({
      name: {
        $regex: userName,
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
