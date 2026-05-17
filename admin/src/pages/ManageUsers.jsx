import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AdminLayout from "../common/AdminLayout"
import DataTable from "../common/DataTable"
import { getAdminUsers, updateUserStatus } from "../services/api"
const BACKEND = "http://localhost:8000"
export default function ManageUsers({ setIsAuthenticated, adminName }) {
  const [users, setUsers] = useState([]); const [loading, setLoading] = useState(true); const [toggling, setToggling] = useState(null)
  const fetch = async () => { setLoading(true); try { const r = await getAdminUsers(); setUsers(r.data.data || []) } catch { toast.error("Failed") } finally { setLoading(false) } }
  useEffect(() => { fetch() }, [])
  const handleToggle = async (user) => {
    const ns = user.status === "Active" ? "Inactive" : "Active"
    if (!window.confirm(`${ns === "Active" ? "Activate" : "Deactivate"} ${user.name}?`)) return
    setToggling(user._id)
    try { const r = await updateUserStatus({ user_id: user._id, status: ns }); if (r.data.success) { toast.success(`User ${ns === "Active" ? "activated" : "deactivated"}!`); fetch() } }
    catch (err) { toast.error(err.response?.data?.message || "Failed!") } finally { setToggling(null) }
  }
  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="row mb-4"><div className="col-12"><h4 className="mb-1">Manage Customers</h4><p className="text-sm text-muted mb-0">View and manage all registered customers.</p></div></div>
      {!loading && (<div className="row g-3 mb-4">
        {[{l:"Total Users",v:users.length},{l:"Active",v:users.filter(u=>u.status==="Active").length},{l:"Inactive",v:users.filter(u=>u.status==="Inactive").length}].map((s,i)=>(
          <div key={s.l} className="col-md-4"><div className="card"><div className="card-body p-3"><p className="text-sm mb-0 text-uppercase font-weight-bold">{s.l}</p><h5 className="font-weight-bolder mb-0">{s.v}</h5></div></div></div>
        ))}
      </div>)}
      <DataTable title="All Customers" columns={["Avatar","Name","Email","Phone","Status","Joined","Action"]}
        data={users} loading={loading} searchKeys={["name","email","phone","status"]} emptyMessage="No customers yet."
        renderRow={(u, idx) => (
          <tr key={u._id}>
            <td className="ps-4"><p className="text-xs text-secondary mb-0">{idx}</p></td>
            <td>{u.profile_image ? <img src={`${BACKEND}${u.profile_image}`} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} onError={e => e.target.style.display="none"}/> : <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#E3E231,#b5b300)", display: "flex", alignItems: "center", justifyContent: "center", color: "#121212", fontWeight: 800, fontSize: 14 }}>{u.name?.charAt(0)}</div>}</td>
            <td><h6 className="mb-0 text-sm">{u.name}</h6></td>
            <td><p className="text-xs text-secondary mb-0">{u.email}</p></td>
            <td><p className="text-xs mb-0">{u.phone || "—"}</p></td>
            <td><span className={`badge badge-sm ${u.status === "Active" ? "badge-success" : "badge-danger"}`}>{u.status}</span></td>
            <td><p className="text-xs text-secondary mb-0">{u.created_at ? new Date(u.created_at).toLocaleDateString("en-IN") : "—"}</p></td>
            <td><button className={`btn btn-sm ${u.status==="Active"?"btn-outline-danger":"btn-outline-success"}`} onClick={() => handleToggle(u)} disabled={toggling === u._id}>{toggling === u._id ? <span className="spinner-border spinner-border-sm"/> : u.status === "Active" ? "Deactivate" : "Activate"}</button></td>
          </tr>
        )}
      />
    </AdminLayout>
  )
}
