import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { showError, showSuccess } from "../../../utils/toast";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
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
      const response = await registerUser(formData);
      dispatch(HideLoading());

      if (response.success) {
        showSuccess(response.message);
        navigate("/login");
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
                <div className="hero-kicker mb-3">START HERE</div>
                <h1 className="display-6 fw-bold mb-3">Create an account for a cleaner test-taking experience.</h1>
                <p className="lead mb-4 opacity-75">
                  Get access to a Bootstrap-styled quiz app that feels modern on desktop and mobile alike.
                </p>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge rounded-pill text-bg-light text-dark px-3 py-2">Fast onboarding</span>
                <span className="badge rounded-pill text-bg-light text-dark px-3 py-2">Responsive layout</span>
                <span className="badge rounded-pill text-bg-light text-dark px-3 py-2">Quiz reports</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5 d-flex">
            <div className="surface-card p-4 p-md-5 w-100">
              <div className="mb-4">
                <div className="hero-kicker">Create account</div>
                <h2 className="fw-bold mb-2">Register now</h2>
                <p className="text-muted mb-0">Set up your profile and jump into exams in a few seconds.</p>
              </div>

              <form onSubmit={onFinish} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={onChange}
                    required
                  />
                </div>

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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={onChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg mt-2">
                  Register
                </button>

                <div className="text-center">
                  <span className="text-muted">Already registered? </span>
                  <Link to="/login" className="fw-semibold">
                    Login here
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

export default Register;
