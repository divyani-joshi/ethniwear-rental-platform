import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
const B = "http://localhost:8000"
const inp = { width: "100%", padding: "12px 16px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none" }
export default function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState(""); const [otp, setOtp] = useState(""); const [newPass, setNewPass] = useState(""); const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const sendOtp = async (e) => { e.preventDefault(); setLoading(true); try { const r = await axios.post(`${B}/sendOtp`,{email}); if(r.data.success){toast.success("OTP sent!");setStep(2)}else toast.error(r.data.message) } catch(err){toast.error(err.response?.data?.message||"Failed!")} finally{setLoading(false)} }
  const verifyOtp = async (e) => { e.preventDefault(); setLoading(true); try { const r = await axios.post(`${B}/verifyOtp`,{email,otp}); if(r.data.success){toast.success("Verified!");setStep(3)}else toast.error(r.data.message) } catch(err){toast.error(err.response?.data?.message||"Invalid OTP!")} finally{setLoading(false)} }
  const resetPass = async (e) => { e.preventDefault(); if(newPass!==confirm){toast.error("Don't match!");return}; setLoading(true); try { const r = await axios.post(`${B}/changePassword`,{email,newPassword:newPass}); if(r.data.success){toast.success("Password reset!");navigate("/login")}else toast.error(r.data.message) } catch(err){toast.error(err.response?.data?.message||"Failed!")} finally{setLoading(false)} }
  return (
    <div style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#121212", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ color: "#fff", fontFamily: "Outfit, sans-serif", fontWeight: 900, marginBottom: 4 }}>Forgot Password</h2>
          <p style={{ color: "#595959", fontSize: 14 }}>Step {step} of 3 — {["Enter Email","Verify OTP","Set New Password"][step-1]}</p>
        </div>
        <div style={{ background: "#1a1a1a", border: "1px solid rgba(227,226,49,.15)", borderRadius: 14, padding: 32 }}>
          {step===1&&<form onSubmit={sendOtp}><label style={{ color: "#A0A0A0", fontSize: 13, marginBottom: 6, display: "block" }}>Email *</label><input type="email" style={inp} value={email} onChange={e=>setEmail(e.target.value)} required placeholder="your@email.com" /><button type="submit" className="primary-btn" style={{ width: "100%", marginTop: 20, padding: "13px" }} disabled={loading}>{loading?"Sending...":"Send OTP →"}</button></form>}
          {step===2&&<form onSubmit={verifyOtp}><label style={{ color: "#A0A0A0", fontSize: 13, marginBottom: 6, display: "block" }}>OTP *</label><input type="text" style={inp} value={otp} onChange={e=>setOtp(e.target.value)} required placeholder="6-digit OTP" maxLength={6} /><button type="submit" className="primary-btn" style={{ width: "100%", marginTop: 20, padding: "13px" }} disabled={loading}>{loading?"Verifying...":"Verify OTP →"}</button></form>}
          {step===3&&<form onSubmit={resetPass}><div style={{ marginBottom: 14 }}><label style={{ color: "#A0A0A0", fontSize: 13, marginBottom: 6, display: "block" }}>New Password *</label><input type="password" style={inp} value={newPass} onChange={e=>setNewPass(e.target.value)} required minLength={6} /></div><div style={{ marginBottom: 20 }}><label style={{ color: "#A0A0A0", fontSize: 13, marginBottom: 6, display: "block" }}>Confirm *</label><input type="password" style={inp} value={confirm} onChange={e=>setConfirm(e.target.value)} required /></div><button type="submit" className="primary-btn" style={{ width: "100%", padding: "13px" }} disabled={loading}>{loading?"Resetting...":"Reset Password →"}</button></form>}
        </div>
        <p style={{ color: "#595959", textAlign: "center", marginTop: 20, fontSize: 14 }}><Link to="/login" style={{ color: "var(--primary-color)", fontWeight: 700 }}>← Back to Login</Link></p>
      </div>
    </div>
  )
}
