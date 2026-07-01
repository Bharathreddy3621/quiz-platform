import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteExamById, getAllExams } from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { showError, showSuccess } from "../../../utils/toast";

function Exams() {
  const navigate = useNavigate();
  const [exams, setExams] = React.useState([]);
  const dispatch = useDispatch();

  const getExamsData = async () => {
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

  const deleteExam = async (examId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteExamById({ examId });
      dispatch(HideLoading());
      if (response.success) {
        showSuccess(response.message);
        getExamsData();
      } else {
        showError(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      showError(error.message);
    }
  };

  useEffect(() => {
    getExamsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="section-heading mb-4">
        <PageTitle
          title="Exams"
          subtitle="Create and maintain the exam catalog from one place."
        />
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/exams/add")}
        >
          <i className="ri-add-line me-2"></i>
          Add Exam
        </button>
      </div>

      <div className="table-responsive surface-card p-3">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Exam Name</th>
              <th>Duration</th>
              <th>Category</th>
              <th>Total Marks</th>
              <th>Passing Marks</th>
              <th style={{ width: "110px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {exams.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  No exams found.
                </td>
              </tr>
            ) : (
              exams.map((record) => (
                <tr key={record._id}>
                  <td className="fw-semibold">{record.name}</td>
                  <td>{record.duration}</td>
                  <td>{record.category}</td>
                  <td>{record.totalMarks}</td>
                  <td>{record.passingMarks}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => navigate(`/admin/exams/edit/${record._id}`)}
                        title="Edit"
                      >
                        <i className="ri-pencil-line"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteExam(record._id)}
                        title="Delete"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Exams;
