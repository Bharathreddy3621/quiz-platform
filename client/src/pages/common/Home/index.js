import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllExams } from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { showError } from "../../../utils/toast";

function Home() {
  const [exams, setExams] = React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      dispatch(HideLoading());
      if (response.success) {
        setExams(response.data);
      } else {
        showError(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      showError(error.message);
    }
  };

  useEffect(() => {
    getExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    user && (
      <div>
        <PageTitle
          title={`Hi ${user.name}, welcome back`}
          subtitle="Choose an exam card below to get started."
        />

        <div className="row g-4">
          {exams.length === 0 && (
            <div className="col-12">
              <div className="surface-card p-4 text-center text-muted">
                No exams are available yet.
              </div>
            </div>
          )}

          {exams.map((exam) => (
            <div className="col-12 col-md-6 col-xl-4" key={exam._id}>
              <div className="card exam-card h-100 border-0">
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <div>
                      <div className="hero-kicker mb-2">{exam.category}</div>
                      <h3 className="h5 fw-bold mb-0">{exam?.name}</h3>
                    </div>
                    <span className="quiz-pill">
                      <i className="ri-medal-line"></i>
                      {exam.totalMarks} Marks
                    </span>
                  </div>

                  <div className="d-flex flex-column gap-2 text-muted mb-4">
                    <div className="d-flex justify-content-between gap-3">
                      <span>Duration</span>
                      <span className="fw-semibold text-dark">{exam.duration} min</span>
                    </div>
                    <div className="d-flex justify-content-between gap-3">
                      <span>Passing Marks</span>
                      <span className="fw-semibold text-dark">{exam.passingMarks}</span>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary mt-auto"
                    onClick={() => navigate(`/user/write-exam/${exam._id}`)}
                  >
                    Start Exam
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
}

export default Home;
