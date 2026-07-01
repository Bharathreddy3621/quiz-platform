import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addQuestionToExam, editQuestionById } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { showError, showSuccess } from "../../../utils/toast";

const blankQuestion = {
  name: "",
  correctOption: "A",
  A: "",
  B: "",
  C: "",
  D: "",
};

function AddEditQuestion({
  showAddEditQuestionModal,
  setShowAddEditQuestionModal,
  refreshData,
  examId,
  selectedQuestion,
  setSelectedQuestion,
}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(blankQuestion);

  useEffect(() => {
    if (selectedQuestion) {
      setFormData({
        name: selectedQuestion?.name || "",
        correctOption: selectedQuestion?.correctOption || "A",
        A: selectedQuestion?.options?.A || "",
        B: selectedQuestion?.options?.B || "",
        C: selectedQuestion?.options?.C || "",
        D: selectedQuestion?.options?.D || "",
      });
    } else {
      setFormData(blankQuestion);
    }
  }, [selectedQuestion]);

  const onChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const closeModal = () => {
    setShowAddEditQuestionModal(false);
    setSelectedQuestion(null);
  };

  const onFinish = async (event) => {
    event.preventDefault();

    try {
      dispatch(ShowLoading());
      const requiredPayload = {
        name: formData.name,
        correctOption: formData.correctOption,
        options: {
          A: formData.A,
          B: formData.B,
          C: formData.C,
          D: formData.D,
        },
        exam: examId,
      };

      const response = selectedQuestion
        ? await editQuestionById({
            ...requiredPayload,
            questionId: selectedQuestion._id,
          })
        : await addQuestionToExam(requiredPayload);

      if (response.success) {
        showSuccess(response.message);
        refreshData();
        closeModal();
      } else {
        showError(response.message);
      }

      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      showError(error.message);
    }
  };

  if (!showAddEditQuestionModal) {
    return null;
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title mb-1">
                {selectedQuestion ? "Edit Question" : "Add Question"}
              </h5>
              <small className="text-muted">Fill in the prompt and answer choices.</small>
            </div>
            <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
          </div>

          <form onSubmit={onFinish}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Question</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Correct Option</label>
                <select
                  name="correctOption"
                  className="form-select"
                  value={formData.correctOption}
                  onChange={onChange}
                  required
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Option A</label>
                  <input
                    type="text"
                    name="A"
                    className="form-control"
                    value={formData.A}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Option B</label>
                  <input
                    type="text"
                    name="B"
                    className="form-control"
                    value={formData.B}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Option C</label>
                  <input
                    type="text"
                    name="C"
                    className="form-control"
                    value={formData.C}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Option D</label>
                  <input
                    type="text"
                    name="D"
                    className="form-control"
                    value={formData.D}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Question
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEditQuestion;
