const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  correctOption: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    required: true,
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "exams",
  },
}, {
    timestamps: true,
});

questionSchema.pre("findOneAndDelete", async function (next) {
  try {
    const session = this.getOptions().session;
    const questionQuery = this.model.findOne(this.getFilter()).select("_id exam");

    if (session) {
      questionQuery.session(session);
    }

    const question = await questionQuery;
    if (question?.exam) {
      const Exam = mongoose.model("exams");
      const examUpdate = Exam.updateOne(
        { _id: question.exam },
        { $pull: { questions: question._id } }
      );

      if (session) {
        examUpdate.session(session);
      }

      await examUpdate;
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Question = mongoose.model("questions", questionSchema);
module.exports = Question;
