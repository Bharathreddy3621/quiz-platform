import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { showError, showSuccess } from "../../../utils/toast";

function Login() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
      const response = await loginUser(formData);
      dispatch(HideLoading());

      if (response.success) {
        showSuccess(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        showError(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      showError(error.message);
    }
  };

  return (
    <div className="auth-shell d-flex align-items-center">
      <div className="container">
        <div className="row g-4 align-items-stretch justify-content-center">
          <div className="col-12 col-lg-5 d-flex">
            <div className="hero-panel p-4 p-md-5 w-100 d-flex flex-column justify-content-between">
              <div>
                <div className="hero-kicker mb-3">QUIZ APPLICATION</div>
                <h1 className="display-6 fw-bold mb-3">Smart exam practice with a cleaner Bootstrap experience.</h1>
                <p className="lead mb-4 opacity-75">
                  Track exams, review scores, and manage questions from a polished dashboard built around crisp cards and responsive layouts.
                </p>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge rounded-pill text-bg-light text-dark px-3 py-2">Student friendly</span>
                <span className="badge rounded-pill text-bg-light text-dark px-3 py-2">Admin ready</span>
                <span className="badge rounded-pill text-bg-light text-dark px-3 py-2">Bootstrap UI</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5 d-flex">
            <div className="surface-card p-4 p-md-5 w-100">
              <div className="mb-4">
                <div className="hero-kicker">Welcome back</div>
                <h2 className="fw-bold mb-2">Sign in to continue</h2>
                <p className="text-muted mb-0">Use your account to jump back into the quiz workspace.</p>
              </div>

              <form onSubmit={onFinish} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={onChange}
                    required
                  />
                </div>

                <div>
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={onChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg mt-2">
                  Login
                </button>

                <div className="text-center">
                  <span className="text-muted">Not a member? </span>
                  <Link to="/register" className="fw-semibold">
                    Register here
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
