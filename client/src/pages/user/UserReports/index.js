import React, { useEffect } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { getAllReportsByUser } from "../../../apicalls/reports";
import PageTitle from "../../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { showError } from "../../../utils/toast";

function UserReports() {
  const [reportsData, setReportsData] = React.useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReportsByUser();
      if (response.success) {
        setReportsData(response.data);
      } else {
        showError(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      showError(error.message);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <PageTitle
        title="Reports"
        subtitle="Review your attempts, marks, and verdicts."
      />

      <div className="table-responsive surface-card p-3">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Exam Name</th>
              <th>Date</th>
              <th>Total Marks</th>
              <th>Passing Marks</th>
              <th>Obtained Marks</th>
              <th>Verdict</th>
            </tr>
          </thead>
          <tbody>
            {reportsData.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  No report history yet.
                </td>
              </tr>
            ) : (
              reportsData.map((record) => (
                <tr key={record._id}>
                  <td className="fw-semibold">{record.exam.name}</td>
                  <td>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</td>
                  <td>{record.exam.totalMarks}</td>
                  <td>{record.exam.passingMarks}</td>
                  <td>{record.result.correctAnswers.length}</td>
                  <td>
                    <span
                      className={`badge rounded-pill ${
                        record.result.verdict === "Pass"
                          ? "text-bg-success"
                          : "text-bg-danger"
                      }`}
                    >
                      {record.result.verdict}
                    </span>
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

export default UserReports;
