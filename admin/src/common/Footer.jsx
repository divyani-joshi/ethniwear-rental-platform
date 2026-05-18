import React from "react";
export default function Footer() {
  return (
    <footer className="footer py-4">
      <div className="container-fluid">
        <div className="row align-items-center justify-content-lg-between">
          <div className="col-lg-6 mb-lg-0 mb-4">
            <div className="copyright text-center text-sm text-muted text-lg-start">
              © {new Date().getFullYear()} <strong>EthniWear</strong> Admin
              Panel
            </div>
          </div>
          <div className="col-lg-6">
            <ul className="nav nav-footer justify-content-center justify-content-lg-end">
              <li className="nav-item">
                <span className="nav-link text-muted" style={{ fontSize: 12 }}>
                  Ethnic Clothing Rental Platform 👘
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
