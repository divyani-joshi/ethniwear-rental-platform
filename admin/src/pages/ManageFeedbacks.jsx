import React, { useEffect, useState } from "react"
import AdminLayout from "../common/AdminLayout"
import DataTable from "../common/DataTable"
import { getAdminFeedbacks } from "../services/api"
import { toast } from "react-toastify"
const Stars = ({ rating }) => <div className="d-flex gap-1">{[1,2,3,4,5].map(s => <i key={s} className={`fa fa-star${s <= Math.round(rating) ? "" : "-o"}`} style={{ color: "#E3E231", fontSize: 12 }} />)}</div>
export default function ManageFeedbacks({ setIsAuthenticated, adminName }) {
  const [feedbacks, setFeedbacks] = useState([]); const [loading, setLoading] = useState(true)
  useEffect(() => { getAdminFeedbacks().then(r => setFeedbacks(r.data.data || [])).catch(() => toast.error("Failed")).finally(() => setLoading(false)) }, [])
  const avg = feedbacks.length ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : 0
  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="row mb-4"><div className="col-12"><h4 className="mb-1">Customer Feedbacks</h4><p className="text-sm text-muted mb-0">Monitor all reviews from rental customers.</p></div></div>
      {!loading && (<div className="row g-3 mb-4">
        {[{l:"Total Reviews",v:feedbacks.length},{l:"Avg Rating",v:`${avg} / 5`},{l:"5 Star Reviews",v:feedbacks.filter(f=>f.rating===5).length}].map((s,i)=>(
          <div key={s.l} className="col-md-4"><div className="card"><div className="card-body p-3"><p className="text-sm mb-0 text-uppercase font-weight-bold">{s.l}</p><h5 className="font-weight-bolder mb-0">{s.v}</h5></div></div></div>
        ))}
      </div>)}
      <DataTable title="All Feedbacks" columns={["Customer","Item","Rating","Review","Date"]}
        data={feedbacks} loading={loading} searchKeys={["user.name","item.name","feedback"]} emptyMessage="No feedbacks yet."
        renderRow={(f, idx) => (
          <tr key={f._id}>
            <td className="ps-4"><p className="text-xs text-secondary mb-0">{idx}</p></td>
            <td><h6 className="mb-0 text-sm">{f.user?.name || "—"}</h6><p className="text-xs text-secondary mb-0">{f.user?.email}</p></td>
            <td><p className="text-xs font-weight-bold mb-0">{f.item?.name || "—"}</p></td>
            <td><Stars rating={f.rating} /><small className="text-muted">{f.rating}/5</small></td>
            <td><p className="text-xs text-secondary mb-0" style={{ maxWidth: 220 }}>"{f.feedback?.slice(0, 80)}{f.feedback?.length > 80 ? "..." : ""}"</p></td>
            <td><p className="text-xs text-secondary mb-0">{f.datetime ? new Date(f.datetime).toLocaleDateString("en-IN") : "—"}</p></td>
          </tr>
        )}
      />
    </AdminLayout>
  )
}
