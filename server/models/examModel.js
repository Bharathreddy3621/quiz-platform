const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    passingMarks: {
      type: Number,
      required: true,
    },
    questions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "questions",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

examSchema.pre("findOneAndDelete", async function (next) {
  try {
    const session = this.getOptions().session;
    const examId = this.getFilter()?._id;
    if (examId) {
      const Question = mongoose.model("questions");
      const Report = mongoose.model("reports");

      const questionDelete = Question.deleteMany({ exam: examId });
      const reportDelete = Report.deleteMany({ exam: examId });

      if (session) {
        questionDelete.session(session);
        reportDelete.session(session);
      }

      await questionDelete;
      await reportDelete;
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Exam = mongoose.model("exams", examSchema);
module.exports = Exam;
