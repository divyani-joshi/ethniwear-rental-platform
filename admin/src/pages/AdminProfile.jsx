import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AdminLayout from "../common/AdminLayout"
import { getProfile, updateProfile, changePassword } from "../services/api"

const BACKEND = "http://localhost:8000"

export default function AdminProfile({ setIsAuthenticated, adminName }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("info")
  const [saving, setSaving] = useState(false)
  const [changing, setChanging] = useState(false)
  const [imgFile, setImgFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({ name: "", phone: "" })
  const [passForm, setPassForm] = useState({ newPassword: "", confirm: "" })

  const fetch = async () => {
    try {
      const r = await getProfile()
      const d = r.data.data
      setProfile(d)
      setForm({ name: d.name || "", phone: d.phone || "" })
    } catch { toast.error("Failed to load profile") }
    finally { setLoading(false) }
  }
  useEffect(() => { fetch() }, [])

  const handleSave = async (e) => {
    e?.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      fd.append("name", form.name)
      fd.append("phone", form.phone)
      if (imgFile) fd.append("profile_image", imgFile)
      const r = await updateProfile(fd)
      if (r.data.success) { toast.success("Profile updated!"); setImgFile(null); setPreview(null); fetch() }
    } catch (err) { toast.error(err.response?.data?.message || "Update failed!") }
    finally { setSaving(false) }
  }

  const handlePass = async (e) => {
    e.preventDefault()
    if (passForm.newPassword !== passForm.confirm) { toast.error("Passwords don't match!"); return }
    if (passForm.newPassword.length < 6) { toast.error("Min 6 characters!"); return }
    setChanging(true)
    try {
      const r = await changePassword({ email: profile.email, newPassword: passForm.newPassword })
      if (r.data.success) { toast.success("Password changed!"); setPassForm({ newPassword: "", confirm: "" }) }
    } catch (err) { toast.error(err.response?.data?.message || "Failed!") }
    finally { setChanging(false) }
  }

  const avatarSrc = preview ? preview : profile?.profile_image ? `${BACKEND}${profile.profile_image}` : null

  if (loading) return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="text-center py-5"><div className="spinner-border text-primary" /><p className="mt-3 text-muted">Loading...</p></div>
    </AdminLayout>
  )

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="mb-1">Admin Profile</h4>
          <p className="text-sm text-muted mb-0">Manage your account information and security settings.</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-xl-4 col-lg-5">
          <div className="card h-100">
            <div className="card-body p-3">
              <div className="text-center mt-3 mb-4">
                <div style={{ position: "relative", display: "inline-block" }}>
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="Avatar"
                      className="border-radius-lg shadow-sm"
                      style={{ width: 96, height: 96, objectFit: "cover", border: "3px solid #E3E231" }}
                      onError={e => e.target.style.display = "none"} />
                  ) : (
                    <div style={{ width: 96, height: 96, borderRadius: "50%", background: "linear-gradient(135deg,#E3E231,#b5b300)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: "#121212", fontWeight: 900, margin: "0 auto" }}>
                      {profile?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <label htmlFor="admin-av"
                    style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: "50%", background: "#344767", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12, border: "2px solid #fff" }}>
                    <i className="fa fa-camera" />
                    <input id="admin-av" type="file" accept="image/*" style={{ display: "none" }}
                      onChange={e => { const f = e.target.files[0]; if (f) { setImgFile(f); setPreview(URL.createObjectURL(f)) } }} />
                  </label>
                </div>
                <h5 className="mb-1 mt-3 font-weight-bolder">{profile?.name}</h5>
                <p className="text-sm text-secondary mb-0">Administrator</p>
                <span className="badge badge-sm badge-success mt-1">Admin</span>
              </div>
              <hr className="horizontal dark my-3" />
              <ul className="list-group list-group-flush">
                {[
                  { icon: "fa-envelope", label: "Email", value: profile?.email },
                  { icon: "fa-phone", label: "Phone", value: profile?.phone || "—" },
                  { icon: "fa-calendar", label: "Joined", value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—" },
                ].map(item => (
                  <li key={item.label} className="list-group-item border-0 px-0 py-2">
                    <div className="d-flex align-items-center">
                      <i className={`fa ${item.icon} text-sm me-3`} style={{ color: "#344767", width: 16 }} />
                      <div>
                        <p className="text-xs text-muted mb-0">{item.label}</p>
                        <p className="text-sm mb-0 font-weight-bold">{item.value}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {imgFile && (
                <button className="btn bg-gradient-primary w-100 mt-3 btn-sm" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save New Photo"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="col-xl-8 col-lg-7">
          <div className="card h-100">
            <div className="card-header pb-0">
              <ul className="nav nav-tabs" role="tablist">
                {[{ k: "info", label: "Account Info" }, { k: "password", label: "Change Password" }].map(t => (
                  <li className="nav-item" key={t.k}>
                    <button className={`nav-link ${tab === t.k ? "active" : ""}`} onClick={() => setTab(t.k)}
                      style={{ border: "none", background: "none", cursor: "pointer" }}>
                      {t.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-body pt-3">
              {tab === "info" && (
                <form onSubmit={handleSave}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">Full Name *</label>
                      <input type="text" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">Email <small className="text-muted font-weight-normal">(cannot change)</small></label>
                      <input type="email" className="form-control" value={profile?.email || ""} disabled style={{ background: "#f8f9fa" }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">Phone</label>
                      <input type="tel" className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 12345 67890" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">Role</label>
                      <input type="text" className="form-control" value="Administrator" disabled style={{ background: "#f8f9fa" }} />
                    </div>
                  </div>
                  <div className="mt-4 d-flex gap-2">
                    <button type="submit" className="btn bg-gradient-primary btn-sm" disabled={saving}>
                      {saving ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</> : <><i className="fa fa-save me-1" />Save Changes</>}
                    </button>
                    <button type="button" className="btn btn-outline-secondary btn-sm"
                      onClick={() => setForm({ name: profile?.name || "", phone: profile?.phone || "" })}>
                      Reset
                    </button>
                  </div>
                </form>
              )}
              {tab === "password" && (
                <form onSubmit={handlePass}>
                  <div className="alert alert-warning text-sm mb-4" role="alert">
                    <i className="fa fa-info-circle me-1" />Password must be at least 6 characters long.
                  </div>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">New Password *</label>
                      <input type="password" className="form-control" value={passForm.newPassword}
                        onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })}
                        placeholder="Minimum 6 characters" required minLength={6} />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">Confirm Password *</label>
                      <input type="password" className="form-control" value={passForm.confirm}
                        onChange={e => setPassForm({ ...passForm, confirm: e.target.value })} required />
                      {passForm.confirm && (
                        <small className={`mt-1 d-block ${passForm.newPassword === passForm.confirm ? "text-success" : "text-danger"}`}>
                          <i className={`fa ${passForm.newPassword === passForm.confirm ? "fa-check" : "fa-times"} me-1`} />
                          {passForm.newPassword === passForm.confirm ? "Passwords match" : "Passwords don't match"}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <button type="submit" className="btn bg-gradient-primary btn-sm"
                      disabled={changing || passForm.newPassword !== passForm.confirm || passForm.newPassword.length < 6}>
                      {changing ? <><span className="spinner-border spinner-border-sm me-1" />Updating...</> : <><i className="fa fa-lock me-1" />Update Password</>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
