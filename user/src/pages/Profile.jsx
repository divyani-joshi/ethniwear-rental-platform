import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { getProfile, updateProfile, changePassword } from "../services/api"
const BACKEND = "http://localhost:8000"
export default function Profile({ userData, setUserData }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("info")
  const [saving, setSaving] = useState(false)
  const [changing, setChanging] = useState(false)
  const [imgFile, setImgFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({ name: "", phone: "" })
  const [passForm, setPassForm] = useState({ newPassword: "", confirm: "" })
  const inp = { width: "100%", padding: "12px 16px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none" }
  const fetch = async () => { try { const r = await getProfile(); const d = r.data.data; setProfile(d); setForm({ name: d.name||"", phone: d.phone||"" }) } catch { toast.error("Failed") } finally { setLoading(false) } }
  useEffect(() => { fetch() }, [])
  const handleSave = async (e) => { e?.preventDefault(); setSaving(true); try { const fd = new FormData(); fd.append("name", form.name); fd.append("phone", form.phone); if (imgFile) fd.append("profile_image", imgFile); const r = await updateProfile(fd); if(r.data.success){toast.success("Profile updated!");setImgFile(null);setPreview(null);fetch();setUserData(p=>({...p,name:form.name}))} } catch(err){toast.error(err.response?.data?.message||"Failed!")} finally{setSaving(false)} }
  const handlePass = async (e) => { e.preventDefault(); if(passForm.newPassword!==passForm.confirm){toast.error("Don't match!");return}; setChanging(true); try { const r = await changePassword({email:profile.email,newPassword:passForm.newPassword}); if(r.data.success){toast.success("Password changed!");setPassForm({newPassword:"",confirm:""})} } catch(err){toast.error(err.response?.data?.message||"Failed!")} finally{setChanging(false)} }
  const avatarSrc = preview ? preview : profile?.profile_image ? `${BACKEND}${profile.profile_image}` : null
  if (loading) return <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#121212" }}><div style={{ width: 40, height: 40, border: "3px solid rgba(227,226,49,.2)", borderTopColor: "#E3E231", borderRadius: "50%", animation: "spin .8s linear infinite" }}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>
  return (
    <div style={{ background: "#121212", minHeight: "80vh" }}>
      <div style={{ background: "#0d0d0d", borderBottom: "1px solid rgba(227,226,49,.1)", padding: "36px 0" }}>
        <div className="container"><h1 style={{ color: "#fff", fontFamily: "Outfit, sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem,3vw,2.4rem)", marginBottom: 6 }}>My Profile</h1><p style={{ color: "#595959", fontSize: 13, margin: 0 }}><Link to="/" style={{ color: "#595959", textDecoration: "none" }}>Home</Link> › <span style={{ color: "var(--primary-color)" }}>Profile</span></p></div>
      </div>
      <div className="container" style={{ padding: "48px 0" }}>
        <div className="row g-5">
          <div className="col-lg-4">
            <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,.06)", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,rgba(227,226,49,.15),rgba(227,226,49,.05))", padding: "40px 20px", textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
                  {avatarSrc ? <img src={avatarSrc} alt="" style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--primary-color)" }} onError={e=>e.target.style.display="none"}/> : <div style={{ width: 96, height: 96, borderRadius: "50%", background: "var(--primary-color)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: "#121212", fontWeight: 900, fontFamily: "Outfit, sans-serif" }}>{profile?.name?.charAt(0)?.toUpperCase()}</div>}
                  <label htmlFor="av" style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: "50%", background: "var(--primary-color)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13, color: "#121212" }}>📷<input id="av" type="file" accept="image/*" style={{ display: "none" }} onChange={e=>{const f=e.target.files[0];if(f){setImgFile(f);setPreview(URL.createObjectURL(f))}}}/></label>
                </div>
                <h4 style={{ color: "#fff", fontWeight: 700, marginBottom: 2 }}>{profile?.name}</h4>
                <p style={{ color: "var(--primary-color)", fontSize: 13, margin: 0 }}>EthniWear Member</p>
              </div>
              <div style={{ padding: 20 }}>
                {[{i:"bi-envelope",l:"Email",v:profile?.email},{i:"bi-telephone",l:"Phone",v:profile?.phone}].map(x=>(
                  <div key={x.l} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                    <i className={`bi ${x.i}`} style={{ color: "var(--primary-color)", marginTop: 2 }}/>
                    <div><p style={{ color: "#595959", fontSize: 11, margin: 0 }}>{x.l}</p><p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0 }}>{x.v||"—"}</p></div>
                  </div>
                ))}
                <Link to="/my-orders" className="primary-btn" style={{ display: "block", textAlign: "center", marginTop: 16 }}>My Orders</Link>
                {imgFile && <button onClick={handleSave} disabled={saving} style={{ width: "100%", marginTop: 8, padding: "9px", background: "rgba(227,226,49,.12)", color: "var(--primary-color)", border: "1px solid rgba(227,226,49,.3)", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>{saving?"Saving...":"Save New Photo"}</button>}
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,.06)", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                {[{k:"info",l:"Account Info"},{k:"password",l:"Change Password"}].map(t=>(
                  <button key={t.k} onClick={()=>setTab(t.k)} style={{ flex: 1, padding: "16px 20px", border: "none", background: "none", cursor: "pointer", fontWeight: tab===t.k?700:500, color: tab===t.k?"var(--primary-color)":"rgba(255,255,255,.4)", borderBottom: tab===t.k?"2px solid var(--primary-color)":"2px solid transparent", fontSize: 14, transition: "all .2s" }}>{t.l}</button>
                ))}
              </div>
              <div style={{ padding: 28 }}>
                {tab==="info" && (
                  <form onSubmit={handleSave}>
                    <div className="row g-3">
                      {[{f:"name",l:"Full Name",t:"text"},{f:"phone",l:"Phone",t:"tel"}].map(x=>(
                        <div key={x.f} className="col-md-6"><label style={{ color: "#A0A0A0", fontSize: 13, marginBottom: 6, display: "block" }}>{x.l}</label><input type={x.t} style={inp} value={form[x.f]} onChange={e=>setForm({...form,[x.f]:e.target.value})}/></div>
                      ))}
                      <div className="col-12"><label style={{ color: "#A0A0A0", fontSize: 13, marginBottom: 6, display: "block" }}>Email <span style={{ color: "#595959", fontSize: 11 }}>(cannot change)</span></label><div style={{ ...inp, color: "#595959", cursor: "not-allowed" }}>{profile?.email}</div></div>
                    </div>
                    <button type="submit" className="primary-btn" style={{ marginTop: 20, padding: "11px 28px", fontSize: 14 }} disabled={saving}>{saving?"Saving...":"Save Changes"}</button>
                  </form>
                )}
                {tab==="password" && (
                  <form onSubmit={handlePass}>
                    <div style={{ background: "rgba(227,226,49,.06)", border: "1px solid rgba(227,226,49,.15)", borderRadius: 8, padding: 14, marginBottom: 20, fontSize: 13, color: "#A0A0A0" }}>⚠️ New password must be at least 6 characters.</div>
                    <div style={{ marginBottom: 16 }}><label style={{ color: "#A0A0A0", fontSize: 13, marginBottom: 6, display: "block" }}>New Password *</label><input type="password" style={inp} value={passForm.newPassword} onChange={e=>setPassForm({...passForm,newPassword:e.target.value})} required minLength={6} /></div>
                    <div style={{ marginBottom: 24 }}><label style={{ color: "#A0A0A0", fontSize: 13, marginBottom: 6, display: "block" }}>Confirm Password *</label><input type="password" style={inp} value={passForm.confirm} onChange={e=>setPassForm({...passForm,confirm:e.target.value})} required />{passForm.confirm&&<small style={{ color: passForm.newPassword===passForm.confirm?"var(--primary-color)":"#ef4444", fontSize: 12, marginTop: 4, display: "block" }}>{passForm.newPassword===passForm.confirm?"✓ Passwords match":"✗ Don't match"}</small>}</div>
                    <button type="submit" className="primary-btn" style={{ padding: "11px 28px", fontSize: 14 }} disabled={changing}>{changing?"Updating...":"Update Password"}</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
