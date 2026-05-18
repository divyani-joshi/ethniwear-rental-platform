import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
export default function AdminLayout({
  children,
  setIsAuthenticated,
  adminName,
}) {
  return (
    <>
      <Sidebar />
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        <Navbar setIsAuthenticated={setIsAuthenticated} adminName={adminName} />
        <div className="container-fluid py-4">
          {children}
          <Footer />
        </div>
      </main>
    </>
  );
}
