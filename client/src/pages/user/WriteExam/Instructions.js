import React from "react";
import { useNavigate } from "react-router-dom";

function Instructions({ examData, setView, startTimer }) {
  const navigate = useNavigate();

  return (
    <div className="surface-card p-4 p-md-5">
      <div className="row g-4 align-items-center">
        <div className="col-lg-7">
          <div className="hero-kicker mb-2">Before you start</div>
          <h2 className="fw-bold mb-3">Exam Instructions</h2>
          <div className="list-group list-group-flush mb-4">
            <div className="list-group-item px-0 border-0 bg-transparent">
              Exam must be completed in {examData.duration} seconds.
            </div>
            <div className="list-group-item px-0 border-0 bg-transparent">
              The exam will be submitted automatically after {examData.duration} seconds.
            </div>
            <div className="list-group-item px-0 border-0 bg-transparent">
              Once submitted, you cannot change your answers.
            </div>
            <div className="list-group-item px-0 border-0 bg-transparent">
              Do not refresh the page during the test.
            </div>
            <div className="list-group-item px-0 border-0 bg-transparent">
              Use the Previous and Next buttons to navigate between questions.
            </div>
            <div className="list-group-item px-0 border-0 bg-transparent">
              Total marks: <span className="fw-bold">{examData.totalMarks}</span>
            </div>
            <div className="list-group-item px-0 border-0 bg-transparent">
              Passing marks: <span className="fw-bold">{examData.passingMarks}</span>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
              Close
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                startTimer();
                setView("questions");
              }}
            >
              Start Exam
            </button>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="hero-panel p-4 p-md-5 h-100">
            <div className="hero-kicker mb-2">Quiz mode</div>
            <h3 className="fw-bold mb-3">Stay focused, answer steadily, and review your score after submission.</h3>
            <p className="opacity-75 mb-0">
              This exam flow is tuned for a clean Bootstrap experience with a simple timer, clear progress, and instant results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Instructions;
