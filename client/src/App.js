import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/common/Login";
import Register from "./pages/common/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/common/Home";
import Exams from "./pages/admin/Exams";
import AddEditExam from "./pages/admin/Exams/AddEditExam";
import Loader from "./components/Loader";
import { useSelector } from "react-redux";
import WriteExam from "./pages/user/WriteExam";
import UserReports from "./pages/user/UserReports";
import AdminReports from "./pages/admin/AdminReports";

function App() {
  const { loading } = useSelector((state) => state.loader);

  return (
    <>
      {loading && <Loader />}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/write-exam/:id"
            element={
              <ProtectedRoute>
                <WriteExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/reports"
            element={
              <ProtectedRoute>
                <UserReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exams"
            element={
              <ProtectedRoute requireAdmin>
                <Exams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exams/add"
            element={
              <ProtectedRoute requireAdmin>
                <AddEditExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exams/edit/:id"
            element={
              <ProtectedRoute requireAdmin>
                <AddEditExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute requireAdmin>
                <AdminReports />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
