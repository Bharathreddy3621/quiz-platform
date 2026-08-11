import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById } from "../../../apicalls/exams";
import { addReport } from "../../../apicalls/reports";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Instructions from "./Instructions";
import { showError } from "../../../utils/toast";

function WriteExam() {
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [result, setResult] = useState({});
  const [view, setView] = useState("instructions");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const intervalRef = useRef(null);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setQuestions(response.data.questions || []);
        setExamData(response.data);
        setSecondsLeft(response.data.duration);
      } else {
        showError(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      showError(error.message);
    }
  };

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const submitExam = async () => {
    try {
      dispatch(ShowLoading());
      const response = await addReport({
        exam: params.id,
        selectedOptions,
      });
      dispatch(HideLoading());
      if (response.success) {
        setResult(response.data.result);
        setView("result");
      } else {
        showError(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      showError(error.message);
    }
  };

  const startTimer = () => {
    clearTimer();
    let totalSeconds = examData.duration;

    intervalRef.current = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds -= 1;
        setSecondsLeft(totalSeconds);
      } else {
        setTimeUp(true);
      }
    }, 1000);
  };

  useEffect(() => {
    if (timeUp && view === "questions") {
      clearTimer();
      submitExam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeUp]);

  useEffect(() => {
    if (params.id) {
      getExamData();
    }

    return () => {
      clearTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = questions.length
    ? ((selectedQuestionIndex + 1) / questions.length) * 100
    : 0;

  return (
    examData && (
      <div>
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
          <div>
            <div className="hero-kicker mb-2">Exam session</div>
            <h2 className="section-title mb-1">{examData.name}</h2>
            <p className="section-subtitle mb-0">
              {examData.category} | {questions.length} questions
            </p>
          </div>

          {view === "questions" && (
            <div className="quiz-timer">
              <span className="fs-5">{secondsLeft}</span>
            </div>
          )}
        </div>

        <div className="progress mb-4" style={{ height: "0.7rem" }}>
          <div
            className="progress-bar bg-primary"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>

        {view === "instructions" && (
          <Instructions
            examData={examData}
            setView={setView}
            startTimer={startTimer}
          />
        )}

        {view === "questions" && questions.length > 0 && (
          <div className="surface-card p-4 p-md-5">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
              <div>
                <div className="hero-kicker mb-2">Question {selectedQuestionIndex + 1}</div>
                <h3 className="h4 fw-bold mb-0">{questions[selectedQuestionIndex].name}</h3>
              </div>
              <span className="quiz-pill">
                <i className="ri-timer-line"></i>
                {selectedQuestionIndex + 1} / {questions.length}
              </span>
            </div>

            <div className="row g-3 mb-4">
              {Object.keys(questions[selectedQuestionIndex].options).map((option) => (
                <div key={option} className="col-12 col-md-6">
                  <div
                    className={`option-card ${
                      selectedOptions[selectedQuestionIndex] === option ? "selected" : ""
                    }`}
                    onClick={() =>
                      setSelectedOptions({
                        ...selectedOptions,
                        [selectedQuestionIndex]: option,
                      })
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        setSelectedOptions({
                          ...selectedOptions,
                          [selectedQuestionIndex]: option,
                        });
                      }
                    }}
                  >
                    <div className="d-flex align-items-start gap-3">
                      <span className="badge text-bg-primary rounded-pill">{option}</span>
                      <div className="fw-semibold">
                        {questions[selectedQuestionIndex].options[option]}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between flex-wrap gap-2">
              {selectedQuestionIndex > 0 ? (
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setSelectedQuestionIndex(selectedQuestionIndex - 1)}
                >
                  Previous
                </button>
              ) : (
                <span />
              )}

              {selectedQuestionIndex < questions.length - 1 && (
                <button
                  className="btn btn-primary"
                  onClick={() => setSelectedQuestionIndex(selectedQuestionIndex + 1)}
                >
                  Next
                </button>
              )}

              {selectedQuestionIndex === questions.length - 1 && (
                <button
                  className="btn btn-success"
                  onClick={() => {
                    clearTimer();
                    setTimeUp(true);
                  }}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}

        {view === "result" && (
          <div className="result-panel p-4 p-md-5">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <div className="hero-kicker mb-2">Final result</div>
                <h2 className="fw-bold mb-4">Your exam summary is ready.</h2>

                <div className="row g-3 mb-4">
                  <div className="col-sm-6">
                    <div className="surface-card p-3 h-100">
                      <div className="text-muted small">Total Marks</div>
                      <div className="h4 fw-bold mb-0">{examData.totalMarks}</div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="surface-card p-3 h-100">
                      <div className="text-muted small">Obtained Marks</div>
                      <div className="h4 fw-bold mb-0">{result.correctAnswers?.length || 0}</div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="surface-card p-3 h-100">
                      <div className="text-muted small">Wrong Answers</div>
                      <div className="h4 fw-bold mb-0">{result.wrongAnswers?.length || 0}</div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="surface-card p-3 h-100">
                      <div className="text-muted small">Passing Marks</div>
                      <div className="h4 fw-bold mb-0">{examData.passingMarks}</div>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2 align-items-center mb-4">
                  <span className={`badge rounded-pill ${result.verdict === "Pass" ? "text-bg-success" : "text-bg-danger"} px-3 py-2`}>
                    {result.verdict}
                  </span>
                  <span className="text-muted">
                    You can review your answers or retake the exam.
                  </span>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setView("instructions");
                      setSelectedQuestionIndex(0);
                      setSelectedOptions({});
                      setResult({});
                      setSecondsLeft(examData.duration);
                      setTimeUp(false);
                    }}
                  >
                    Retake Exam
                  </button>
                  <button className="btn btn-primary" onClick={() => setView("review")}>
                    Review Answers
                  </button>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="surface-card p-4 h-100 d-flex align-items-center justify-content-center">
                  <div className="w-100 text-center">
                    {result.verdict === "Pass" && (
                      <lottie-player
                        src="https://assets2.lottiefiles.com/packages/lf20_ya4ycrti.json"
                        background="transparent"
                        speed="1"
                        loop
                        autoplay
                      ></lottie-player>
                    )}

                    {result.verdict === "Fail" && (
                      <lottie-player
                        src="https://assets4.lottiefiles.com/packages/lf20_qp1spzqv.json"
                        background="transparent"
                        speed="1"
                        loop
                        autoplay
                      ></lottie-player>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "review" && (
          <div className="d-flex flex-column gap-3">
            {(result.answers || []).map((answer, index) => {
              return (
                <div
                  key={answer.question || index}
                  className={`surface-card p-4 border-start border-4 ${
                    answer.isCorrect ? "border-success" : "border-danger"
                  }`}
                >
                  <div className="d-flex flex-wrap justify-content-between gap-3 mb-2">
                    <h3 className="h5 fw-bold mb-0">
                      {index + 1}. {answer.questionText}
                    </h3>
                    <span className={`badge rounded-pill ${answer.isCorrect ? "text-bg-success" : "text-bg-danger"}`}>
                      {answer.isCorrect ? "Correct" : "Wrong"}
                    </span>
                  </div>
                  <div className="text-muted mb-1">
                    Submitted Answer: {answer.selectedOption || "Not answered"} -{" "}
                    {answer.selectedAnswer || "Not answered"}
                  </div>
                  <div className="text-muted">
                    Correct Answer: {answer.correctOption} - {answer.correctAnswer}
                  </div>
                </div>
              );
            })}

            <div className="d-flex justify-content-center flex-wrap gap-2">
              <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setView("instructions");
                  setSelectedQuestionIndex(0);
                  setSelectedOptions({});
                  setResult({});
                  setSecondsLeft(examData.duration);
                  setTimeUp(false);
                }}
              >
                Retake Exam
              </button>
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default WriteExam;
