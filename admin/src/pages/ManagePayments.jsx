import React, { useEffect, useState } from "react"
import AdminLayout from "../common/AdminLayout"
import DataTable from "../common/DataTable"
import { getAdminPayments } from "../services/api"
import { toast } from "react-toastify"
export default function ManagePayments({ setIsAuthenticated, adminName }) {
  const [payments, setPayments] = useState([]); const [loading, setLoading] = useState(true)
  useEffect(() => { getAdminPayments().then(r => setPayments(r.data.data || [])).catch(() => toast.error("Failed")).finally(() => setLoading(false)) }, [])
  const revenue = payments.filter(p => p.status === "Success").reduce((s, p) => s + (p.total_amount || 0), 0)
  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="row mb-4"><div className="col-12"><h4 className="mb-1">Payment Transactions</h4><p className="text-sm text-muted mb-0">Monitor all rental payment records.</p></div></div>
      {!loading && (<div className="row g-3 mb-4">
        {[{l:"Total Revenue",v:`₹${revenue.toLocaleString("en-IN")}`,c:"bg-gradient-success"},{l:"Successful",v:payments.filter(p=>p.status==="Success").length,c:"bg-gradient-primary"},{l:"Pending/Failed",v:payments.filter(p=>p.status!=="Success").length,c:"bg-gradient-warning"}].map(s=>(
          <div key={s.l} className="col-md-4"><div className="card"><div className="card-body p-3"><div className="row align-items-center"><div className="col-8"><p className="text-sm mb-0 text-uppercase font-weight-bold">{s.l}</p><h5 className="font-weight-bolder mb-0">{s.v}</h5></div><div className="col-4 text-end"><div className={`icon icon-shape ${s.c} shadow text-center border-radius-md`}><i className="fa fa-rupee-sign text-lg opacity-10"/></div></div></div></div></div></div>
        ))}
      </div>)}
      <DataTable title="All Payments" columns={["Customer","Total","Deposit","Rent Amount","Payment ID","Date","Status"]}
        data={payments} loading={loading} searchKeys={["user.name","razorpay_payment_id","status"]} emptyMessage="No payments yet."
        renderRow={(p, idx) => (
          <tr key={p._id}>
            <td className="ps-4"><p className="text-xs text-secondary mb-0">{idx}</p></td>
            <td><h6 className="mb-0 text-sm">{p.user?.name || "—"}</h6><p className="text-xs text-secondary mb-0">{p.user?.email}</p></td>
            <td><p className="text-xs font-weight-bold mb-0 text-success">₹{p.total_amount}</p></td>
            <td><p className="text-xs mb-0 text-primary">₹{p.deposit_amount}</p></td>
            <td><p className="text-xs mb-0">₹{p.rent_amount}</p></td>
            <td><code style={{ fontSize: 11 }}>{p.razorpay_payment_id?.slice(0, 16) || "—"}</code></td>
            <td><p className="text-xs text-secondary mb-0">{p.date ? new Date(p.date).toLocaleDateString("en-IN") : "—"}</p></td>
            <td><span className={`badge badge-sm ${p.status==="Success"?"badge-success":"badge-danger"}`}>{p.status}</span></td>
          </tr>
        )}
      />
    </AdminLayout>
  )
}
