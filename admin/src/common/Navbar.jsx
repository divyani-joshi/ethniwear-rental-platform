import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { removeToken } from "../auth/authService";

export default function Navbar({ setIsAuthenticated, adminName }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const crumb =
    pathname === "/"
      ? "Dashboard"
      : pathname
          .replace("/manage-", "")
          .replace("/", "")
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
    toast.success("Logged out!");
    navigate("/login");
  };

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl">
      <div className="container-fluid py-1 px-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
            <li className="breadcrumb-item text-sm">
              <Link className="opacity-5 text-dark" to="/">
                Admin
              </Link>
            </li>
            <li className="breadcrumb-item text-sm text-dark active">
              {crumb}
            </li>
          </ol>
        </nav>

        <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4">
          <div className="ms-md-auto pe-md-3 d-flex align-items-center">
            <div className="input-group">
              <span className="input-group-text text-body">
                <i className="fas fa-search" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
              />
            </div>
          </div>

          <ul className="navbar-nav justify-content-end">
            <li
              className="nav-item dropdown pe-2 d-flex align-items-center"
              ref={dropdownRef}
            >
              <button
                className="nav-link text-body p-0 d-flex align-items-center border-0 bg-transparent"
                onClick={() => setOpen(!open)}
              >
                <i className="fa fa-user me-sm-1" />

                {/* one-line fix kept */}
                <span className="d-sm-inline d-none text-nowrap">
                  {adminName || "Admin"}
                </span>
              </button>

              {/* dropdown */}
              {open && (
                <ul className="dropdown-menu dropdown-menu-end show px-2 py-3 me-sm-n4">
                  <li>
                    <Link
                      className="dropdown-item border-radius-md"
                      to="/profile"
                    >
                      <i className="fa fa-user me-2" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item border-radius-md text-danger"
                      onClick={handleLogout}
                    >
                      <i className="fa fa-sign-out-alt me-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
