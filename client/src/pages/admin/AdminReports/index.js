import React, { useEffect } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { getAllReports } from "../../../apicalls/reports";
import PageTitle from "../../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { showError } from "../../../utils/toast";

function AdminReports() {
  const [reportsData, setReportsData] = React.useState([]);
  const dispatch = useDispatch();
  const [filters, setFilters] = React.useState({
    examName: "",
    userName: "",
  });

  const getData = async (tempFilters) => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReports(tempFilters);
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
    getData(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <PageTitle
        title="Reports"
        subtitle="Filter submissions by exam and user."
      />

      <div className="surface-card p-3 p-md-4 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-4">
            <label className="form-label fw-semibold">Exam</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by exam name"
              value={filters.examName}
              onChange={(e) => setFilters({ ...filters, examName: e.target.value })}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label fw-semibold">User</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by user name"
              value={filters.userName}
              onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
            />
          </div>
          <div className="col-12 col-md-4 d-flex gap-2 justify-content-md-end">
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                const cleared = { examName: "", userName: "" };
                setFilters(cleared);
                getData(cleared);
              }}
            >
              Clear
            </button>
            <button className="btn btn-primary" onClick={() => getData(filters)}>
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="table-responsive surface-card p-3">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Exam Name</th>
              <th>User Name</th>
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
                <td colSpan="7" className="text-center text-muted py-4">
                  No reports found.
                </td>
              </tr>
            ) : (
              reportsData.map((record) => (
                <tr key={record._id}>
                  <td className="fw-semibold">{record.exam.name}</td>
                  <td>{record.user.name}</td>
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

export default AdminReports;
