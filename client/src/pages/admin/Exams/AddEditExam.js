import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addExam,
  deleteQuestionById,
  editExamById,
  getExamById,
} from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import AddEditQuestion from "./AddEditQuestion";
import { showError, showSuccess } from "../../../utils/toast";

const blankExam = {
  name: "",
  duration: "",
  category: "",
  totalMarks: "",
  passingMarks: "",
};

function AddEditExam() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);
  const [formData, setFormData] = useState(blankExam);
  const [activeTab, setActiveTab] = useState("details");
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] =
    useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const params = useParams();

  const onChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onFinish = async (event) => {
    event.preventDefault();

    try {
      dispatch(ShowLoading());
      const payload = {
        ...formData,
        duration: Number(formData.duration),
        totalMarks: Number(formData.totalMarks),
        passingMarks: Number(formData.passingMarks),
      };

      const response = params.id
        ? await editExamById({
            ...payload,
            examId: params.id,
          })
        : await addExam(payload);

      if (response.success) {
        showSuccess(response.message);
        navigate("/admin/exams");
      } else {
        showError(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      showError(error.message);
    }
  };

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setExamData(response.data);
      } else {
        showError(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      showError(error.message);
    }
  };

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (examData) {
      setFormData({
        name: examData.name || "",
        duration: examData.duration ?? "",
        category: examData.category || "",
        totalMarks: examData.totalMarks ?? "",
        passingMarks: examData.passingMarks ?? "",
      });
    } else if (!params.id) {
      setFormData(blankExam);
    }
  }, [examData, params.id]);

  const deleteQuestion = async (questionId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteQuestionById({
        questionId,
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        showSuccess(response.message);
        getExamData();
      } else {
        showError(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      showError(error.message);
    }
  };

  const questions = examData?.questions || [];

  return (
    <div>
      <PageTitle
        title={params.id ? "Edit Exam" : "Add Exam"}
        subtitle="Manage exam metadata and question sets from a single screen."
      />

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Exam Details
          </button>
        </li>
        {params.id && (
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === "questions" ? "active" : ""}`}
              onClick={() => setActiveTab("questions")}
            >
              Questions
            </button>
          </li>
        )}
      </ul>

      {activeTab === "details" && (
        <form onSubmit={onFinish} className="surface-card p-4">
          <div className="row g-3">
            <div className="col-md-6 col-xl-4">
              <label className="form-label fw-semibold">Exam Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-md-6 col-xl-4">
              <label className="form-label fw-semibold">Exam Duration</label>
              <input
                type="number"
                name="duration"
                className="form-control"
                value={formData.duration}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-md-6 col-xl-4">
              <label className="form-label fw-semibold">Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={onChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Javascript">Javascript</option>
                <option value="React">React</option>
                <option value="Node">Node</option>
                <option value="MongoDB">MongoDB</option>
                <option value="GK">GK</option>
                <option value="ML">Machine Learning</option>
                <option value="ebusiness">E-business</option>
              </select>
            </div>
            <div className="col-md-6 col-xl-4">
              <label className="form-label fw-semibold">Total Marks</label>
              <input
                type="number"
                name="totalMarks"
                className="form-control"
                value={formData.totalMarks}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-md-6 col-xl-4">
              <label className="form-label fw-semibold">Passing Marks</label>
              <input
                type="number"
                name="passingMarks"
                className="form-control"
                value={formData.passingMarks}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => navigate("/admin/exams")}
            >
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Save Exam
            </button>
          </div>
        </form>
      )}

      {params.id && activeTab === "questions" && (
        <div className="surface-card p-4">
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => setShowAddEditQuestionModal(true)}
            >
              <i className="ri-add-line me-2"></i>
              Add Question
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Options</th>
                  <th>Correct Option</th>
                  <th style={{ width: "110px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {questions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No questions added yet.
                    </td>
                  </tr>
                ) : (
                  questions.map((record) => (
                    <tr key={record._id}>
                      <td className="fw-semibold">{record.name}</td>
                      <td>
                        {Object.keys(record.options || {}).map((key) => (
                          <div key={key}>
                            <span className="fw-semibold">{key}:</span>{" "}
                            {record.options[key]}
                          </div>
                        ))}
                      </td>
                      <td>
                        {record.correctOption}: {record.options?.[record.correctOption]}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                              setSelectedQuestion(record);
                              setShowAddEditQuestionModal(true);
                            }}
                          >
                            <i className="ri-pencil-line"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => deleteQuestion(record._id)}
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
      )}

      {showAddEditQuestionModal && (
        <AddEditQuestion
          setShowAddEditQuestionModal={setShowAddEditQuestionModal}
          showAddEditQuestionModal={showAddEditQuestionModal}
          examId={params.id}
          refreshData={getExamData}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
      )}
    </div>
  );
}

export default AddEditExam;
