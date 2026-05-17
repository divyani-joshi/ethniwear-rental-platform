import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { removeToken } from "../auth/authService";
import { toast } from "react-toastify";

export default function Header({
  isAuthenticated,
  setIsAuthenticated,
  userData,
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/collections", label: "Collections" },
    { to: "/feedbacks", label: "Reviews" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const activeStyle = { color: "var(--primary-color)", fontWeight: 700 };
  const linkStyle = {
    color: "rgba(255,255,255,.82)",
    fontWeight: 500,
    fontSize: 14,
    textDecoration: "none",
    letterSpacing: 0.5,
    padding: "6px 12px",
    borderRadius: 4,
    transition: "all .2s",
    display: "block",
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 999,
          background: scrolled ? "rgba(18,18,18,.97)" : "#121212",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(227,226,49,.12)",
          transition: "all .3s",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 70,
            }}
          >
            {/* Logo */}
            <Link
              to="/"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  background: "var(--primary-color)",
                  WebkitBackgroundClip: "text",
                  color: "var(--primary-color)",
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 900,
                  letterSpacing: -1,
                }}
              >
                Ethni<span style={{ color: "#fff" }}>Wear</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="d-none d-lg-flex align-items-center gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  style={{
                    ...linkStyle,
                    ...(pathname === l.to ? activeStyle : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (pathname !== l.to)
                      e.target.style.color = "var(--primary-color)";
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== l.to)
                      e.target.style.color = "rgba(255,255,255,.82)";
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Auth Actions */}
            <div className="d-none d-lg-flex align-items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/my-orders"
                    style={{ ...linkStyle, color: "rgba(255,255,255,.75)" }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = "var(--primary-color)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = "rgba(255,255,255,.75)")
                    }
                  >
                    <i className="bi bi-bag me-1" />
                    My Orders
                  </Link>
                  <div className="dropdown" style={{ position: "relative" }}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      style={{
                        background: "var(--primary-color)",
                        color: "#121212",
                        border: "none",
                        borderRadius: 4,
                        padding: "8px 18px",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                        letterSpacing: 0.5,
                      }}
                    >
                      <i className="bi bi-person-circle me-2" />
                      {userData?.name?.split(" ")[0]} ▾
                    </button>

                    {profileOpen && (
                      <ul
                        style={{
                          position: "absolute",
                          top: "110%",
                          right: 0,
                          background: "#1a1a1a",
                          border: "1px solid rgba(227,226,49,.2)",
                          minWidth: 160,
                          listStyle: "none",
                          padding: "8px 0",
                          margin: 0,
                          borderRadius: 6,
                          zIndex: 1000,
                        }}
                      >
                        <li>
                          <Link
                            to="/profile"
                            style={{
                              color: "rgba(255,255,255,.8)",
                              fontSize: 14,
                              padding: "10px 16px",
                              display: "block",
                              textDecoration: "none",
                            }}
                          >
                            <i className="bi bi-person me-2" />
                            Profile
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/my-orders"
                            style={{
                              color: "rgba(255,255,255,.8)",
                              fontSize: 14,
                              padding: "10px 16px",
                              display: "block",
                              textDecoration: "none",
                            }}
                          >
                            <i className="bi bi-bag me-2" />
                            My Orders
                          </Link>
                        </li>

                        <li>
                          <button
                            onClick={handleLogout}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              background: "none",
                              border: "none",
                              color: "#ff6b6b",
                              fontSize: 14,
                              padding: "10px 16px",
                              cursor: "pointer",
                            }}
                          >
                            <i className="bi bi-box-arrow-right me-2" />
                            Logout
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    style={{ ...linkStyle, color: "rgba(255,255,255,.75)" }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = "var(--primary-color)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = "rgba(255,255,255,.75)")
                    }
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    style={{
                      background: "var(--primary-color)",
                      color: "#121212",
                      border: "none",
                      borderRadius: 4,
                      padding: "8px 20px",
                      fontWeight: 700,
                      fontSize: 13,
                      textDecoration: "none",
                      letterSpacing: 0.5,
                    }}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="d-lg-none"
              style={{
                background: "rgba(227,226,49,.12)",
                border: "1px solid rgba(227,226,49,.25)",
                borderRadius: 4,
                padding: "8px 12px",
                color: "var(--primary-color)",
                cursor: "pointer",
                fontSize: 18,
              }}
            >
              <i className={`bi bi-${mobileOpen ? "x" : "list"}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#121212",
            zIndex: 9998,
            padding: "80px 24px 24px",
            overflowY: "auto",
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  ...linkStyle,
                  fontSize: 18,
                  padding: "14px 16px",
                  borderLeft:
                    pathname === l.to
                      ? "3px solid var(--primary-color)"
                      : "3px solid transparent",
                  ...(pathname === l.to ? activeStyle : {}),
                }}
              >
                {l.label}
              </Link>
            ))}
            <hr
              style={{ borderColor: "rgba(227,226,49,.15)", margin: "12px 0" }}
            />
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-orders"
                  style={{ ...linkStyle, fontSize: 16, padding: "12px 16px" }}
                >
                  My Orders
                </Link>
                <Link
                  to="/profile"
                  style={{ ...linkStyle, fontSize: 16, padding: "12px 16px" }}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    color: "#ff6b6b",
                    fontSize: 16,
                    padding: "12px 16px",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{ ...linkStyle, fontSize: 16, padding: "12px 16px" }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "13px",
                    background: "var(--primary-color)",
                    color: "#121212",
                    borderRadius: 4,
                    fontWeight: 700,
                    fontSize: 16,
                    textDecoration: "none",
                    marginTop: 8,
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
