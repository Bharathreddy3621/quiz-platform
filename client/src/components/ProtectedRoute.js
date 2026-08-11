import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserInfo } from "../apicalls/users";
import { SetUser } from "../redux/usersSlice.js";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";
import { showError } from "../utils/toast";

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user } = useSelector((state) => state.users);
  const [menu, setMenu] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userMenu = [
    {
      title: "Home",
      paths: ["/", "/user/write-exam"],
      icon: "ri-home-4-line",
      onClick: () => navigate("/"),
    },
    {
      title: "Reports",
      paths: ["/user/reports"],
      icon: "ri-bar-chart-2-line",
      onClick: () => navigate("/user/reports"),
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: "ri-logout-box-r-line",
      onClick: () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      },
    },
  ];

  const adminMenu = [
    {
      title: "Home",
      paths: ["/", "/user/write-exam"],
      icon: "ri-home-4-line",
      onClick: () => navigate("/"),
    },
    {
      title: "Exams",
      paths: ["/admin/exams", "/admin/exams/add"],
      icon: "ri-file-list-3-line",
      onClick: () => navigate("/admin/exams"),
    },
    {
      title: "Reports",
      paths: ["/admin/reports"],
      icon: "ri-bar-chart-2-line",
      onClick: () => navigate("/admin/reports"),
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: "ri-logout-box-r-line",
      onClick: () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      },
    },
  ];

  const getUserData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserInfo();
      if (response.success) {
        dispatch(SetUser(response.data));
        setMenu(response.data.isAdmin ? adminMenu : userMenu);
        if (requireAdmin && !response.data.isAdmin) {
          showError("You are not authorized to access this page");
          navigate("/", { replace: true });
          return;
        }

        setIsAuthorized(true);
      } else {
        showError(response.message);
        navigate("/login", { replace: true });
      }
    } catch (error) {
      navigate("/login", { replace: true });
      showError(error.message);
    } finally {
      dispatch(HideLoading());
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData();
    } else {
      setIsCheckingAuth(false);
      navigate("/login", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requireAdmin]);

  if (isCheckingAuth || !isAuthorized) {
    return null;
  }

  const activeRoute = location.pathname;

  const getIsActiveOrNot = (paths) => {
    if (paths.includes(activeRoute)) {
      return true;
    }

    if (
      activeRoute.includes("/admin/exams/edit") &&
      paths.includes("/admin/exams")
    ) {
      return true;
    }

    if (
      activeRoute.includes("/user/write-exam") &&
      paths.includes("/user/write-exam")
    ) {
      return true;
    }

    return false;
  };

  const renderMenu = () =>
    menu.map((item) => (
      <button
        key={item.title}
        type="button"
        className={`btn btn-link text-start text-decoration-none sidebar-link ${
          getIsActiveOrNot(item.paths) ? "active" : ""
        }`}
        onClick={item.onClick}
      >
        <i className={item.icon}></i>
        {!collapsed && <span>{item.title}</span>}
      </button>
    ));

  return (
    <div className="app-shell p-3 p-lg-4">
      <div className="container-fluid">
        <div className="row g-3">
          <div className="col-12 d-lg-none">
            <div className="surface-card p-3">
              <div className="d-flex align-items-center justify-content-between gap-3">
                <div>
                  <div className="hero-kicker">QUIZ Application</div>
                  <div className="fw-bold">Navigation</div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setCollapsed((prev) => !prev)}
                >
                  <i className={`ri-${collapsed ? "menu" : "close"}-line me-1`}></i>
                  {collapsed ? "Show" : "Hide"}
                </button>
              </div>
              {!collapsed && <div className="d-flex flex-wrap gap-2 mt-3">{renderMenu()}</div>}
            </div>
          </div>

          <div className={`col-lg-${collapsed ? 1 : 3} col-xl-${collapsed ? 1 : 2} d-none d-lg-block`}>
            <div className="sidebar-shell p-3 h-100">
              <div className="d-flex align-items-center justify-content-between mb-4">
                {!collapsed ? (
                  <div>
                    <div className="hero-kicker">QUIZ Application</div>
                    <div className="h5 mb-0 fw-bold">Dashboard</div>
                  </div>
                ) : (
                  <div className="fw-bold fs-4">Q</div>
                )}

                <button
                  type="button"
                  className="btn btn-sm btn-outline-light"
                  onClick={() => setCollapsed((prev) => !prev)}
                >
                  <i className={`ri-${collapsed ? "menu" : "close"}-line`}></i>
                </button>
              </div>

              <div className="d-flex flex-column gap-2">{renderMenu()}</div>
            </div>
          </div>

          <div className={`col-12 ${collapsed ? "col-lg-11 col-xl-11" : "col-lg-9 col-xl-10"}`}>
            <div className="surface-card p-3 p-lg-4 mb-3">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                  <div className="hero-kicker">Welcome back</div>
                  <h1 className="h4 fw-bold mb-0">{user?.isAdmin ? "Admin Workspace" : "Student Workspace"}</h1>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <span className="quiz-pill">
                    <i className="ri-shield-user-line"></i>
                    {user?.isAdmin ? "Admin" : "User"}
                  </span>
                  <div className="text-end">
                    <div className="fw-bold">{user?.name}</div>
                    <small className="text-muted">Signed in</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="surface-card p-3 p-lg-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProtectedRoute;
