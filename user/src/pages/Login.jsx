import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { login } from "../services/api"
import { setToken } from "../auth/authService"

export default function Login({ setIsAuthenticated, setUserData }) {
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()
  const inp = { width: "100%", padding: "12px 16px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none" }
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const r = await login(form)
      if (r.data.success) {
        if (r.data.userData?.session?.role !== "User") { toast.error("Admin accounts must use the admin panel."); return }
        setToken(r.data.token); setIsAuthenticated(true); setUserData(r.data.userData?.session)
        toast.success(`Welcome back, ${r.data.userData?.session?.name?.split(" ")[0]}! 👘`)
        navigate("/")
      }
    } catch (err) { toast.error(err.response?.data?.message || "Login failed!") }
    finally { setLoading(false) }
  }
  return (
    <div style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#121212", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 60, height: 60, borderRadius: 12, background: "var(--primary-color)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>👘</div>
          <h2 style={{ color: "#fff", fontFamily: "Outfit, sans-serif", fontWeight: 900, marginBottom: 4 }}>Welcome Back</h2>
          <p style={{ color: "#595959", fontSize: 14 }}>Sign in to your EthniWear account</p>
        </div>
        <div style={{ background: "#1a1a1a", border: "1px solid rgba(227,226,49,.15)", borderRadius: 14, padding: 32 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}><label style={{ color: "#A0A0A0", fontSize: 13, marginBottom: 6, display: "block" }}>Email *</label><input type="email" style={inp} placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
            <div style={{ marginBottom: 20, position: "relative" }}><label style={{ color: "#A0A0A0", fontSize: 13, marginBottom: 6, display: "block" }}>Password *</label><input type={showPass ? "text" : "password"} style={inp} placeholder="Your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /><button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: 32, background: "none", border: "none", color: "var(--primary-color)", cursor: "pointer", fontSize: 16 }}><i className={`bi bi-eye${showPass ? "-slash" : ""}`} /></button></div>
            <div style={{ textAlign: "right", marginBottom: 20 }}><Link to="/forgot-password" style={{ color: "var(--primary-color)", fontSize: 13 }}>Forgot password?</Link></div>
            <button type="submit" className="primary-btn" style={{ width: "100%", padding: "13px", fontSize: 15 }} disabled={loading}>{loading ? "Signing in..." : "Sign In →"}</button>
          </form>
        </div>
        <p style={{ color: "#595959", textAlign: "center", marginTop: 20, fontSize: 14 }}>New to EthniWear? <Link to="/register" style={{ color: "var(--primary-color)", fontWeight: 700 }}>Create Account</Link></p>
      </div>
    </div>
  )
}
