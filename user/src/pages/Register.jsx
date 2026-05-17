import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { signup } from "../services/api"

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const inp = { width: "100%", padding: "12px 16px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none" }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error("Passwords don't match!"); return }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters!"); return }
    setLoading(true)
    try {
      const r = await signup({ name: form.name, email: form.email, phone: form.phone, password: form.password })
      if (r.data.success) { toast.success("Account created! Please login."); navigate("/login") }
    } catch (err) { toast.error(err.response?.data?.message || "Registration failed!") }
    finally { setLoading(false) }
  }
  return (
    <div style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#121212", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, borderRadius: 12, background: "var(--primary-color)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>👘</div>
          <h2 style={{ color: "#fff", fontFamily: "Outfit, sans-serif", fontWeight: 900, marginBottom: 4 }}>Create Account</h2>
          <p style={{ color: "#595959", fontSize: 14 }}>Join EthniWear and start renting today!</p>
        </div>
        <div style={{ background: "#1a1a1a", border: "1px solid rgba(227,226,49,.15)", borderRadius: 14, padding: 32 }}>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {[{f:"name",l:"Full Name",t:"text",ph:"Jane Doe"},{f:"email",l:"Email",t:"email",ph:"jane@email.com"},{f:"phone",l:"Phone",t:"tel",ph:"+91 98765 43210"}].map(x=>(
                <div key={x.f} className="col-12"><label style={{ color: "#A0A0A0", fontSize: 13, marginBottom: 6, display: "block" }}>{x.l} *</label><input type={x.t} style={inp} placeholder={x.ph} value={form[x.f]} onChange={e => setForm({ ...form, [x.f]: e.target.value })} required /></div>
              ))}
              <div className="col-md-6"><label style={{ color: "#A0A0A0", fontSize: 13, marginBottom: 6, display: "block" }}>Password *</label><input type="password" style={inp} placeholder="Min 6 chars" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} /></div>
              <div className="col-md-6"><label style={{ color: "#A0A0A0", fontSize: 13, marginBottom: 6, display: "block" }}>Confirm Password *</label><input type="password" style={inp} placeholder="Repeat" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />{form.confirm && <small style={{ color: form.password===form.confirm?"var(--primary-color)":"#ef4444", fontSize: 12 }}>{form.password===form.confirm?"✓ Match":"✗ Don't match"}</small>}</div>
            </div>
            <button type="submit" className="primary-btn" style={{ width: "100%", padding: "13px", fontSize: 15, marginTop: 20 }} disabled={loading}>{loading ? "Creating..." : "Create Account →"}</button>
          </form>
        </div>
        <p style={{ color: "#595959", textAlign: "center", marginTop: 20, fontSize: 14 }}>Already have an account? <Link to="/login" style={{ color: "var(--primary-color)", fontWeight: 700 }}>Sign In</Link></p>
      </div>
    </div>
  )
}
