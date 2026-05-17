import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { login } from "../services/api"
import { setToken } from "../auth/authService"

export default function Login({ setIsAuthenticated, setAdminName }) {
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await login(form)
      if (res.data.success) {
        if (res.data.userData?.session?.role !== "Admin") { toast.error("Admin accounts only!"); return }
        setToken(res.data.token)
        setIsAuthenticated(true)
        setAdminName(res.data.userData?.session?.name || "Admin")
        toast.success("Welcome, Admin! 👘")
        navigate("/")
      }
    } catch (err) { toast.error(err.response?.data?.message || "Login failed!") }
    finally { setLoading(false) }
  }

  return (
    <div className="container position-sticky z-index-sticky top-0" style={{ background: "#f8f9fa", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="row w-100 justify-content-center">
        <div className="col-xl-4 col-lg-5 col-md-7">
          <div className="card card-plain">
            <div className="card-header bg-transparent text-center pb-0">
              <div style={{ width: 60, height: 60, borderRadius: 12, background: "linear-gradient(195deg,#42424a,#191919)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>👘</div>
              <h4 className="font-weight-bolder">EthniWear Admin</h4>
              <p className="mb-0">Sign in to manage the platform</p>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control form-control-lg" placeholder="admin@ethniwear.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="mb-3" style={{ position: "relative" }}>
                  <label className="form-label">Password</label>
                  <input type={showPass ? "text" : "password"} className="form-control form-control-lg" placeholder="············"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: 12, top: 38, background: "none", border: "none", cursor: "pointer", color: "#67748e", fontSize: 16 }}>
                    <i className={`fa ${showPass ? "fa-eye-slash" : "fa-eye"}`} />
                  </button>
                </div>
                <div className="text-center mt-4">
                  <button type="submit" className="btn bg-gradient-dark w-100 my-4 mb-2" disabled={loading}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</> : "Sign In"}
                  </button>
                </div>
              </form>
              <div className="mt-3 p-3 rounded" style={{ background: "#fff3e0", border: "1px solid #ffcc80", fontSize: 13, color: "#e65100" }}>
                <i className="fa fa-info-circle me-1" /><strong>Admin only.</strong> Default: admin@ethniwear.com / Admin@123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
