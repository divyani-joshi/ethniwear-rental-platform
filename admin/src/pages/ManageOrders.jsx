import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../common/AdminLayout";
import DataTable from "../common/DataTable";
import { getAdminOrders, updateOrderStatus } from "../services/api";

const BACKEND = "http://localhost:8000";

export default function ManageOrders({ setIsAuthenticated, adminName }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const r = await getAdminOrders();
      setOrders(r.data.data || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await updateOrderStatus({ id: modal._id, status });
      if (r.data.success) {
        toast.success("Order status updated!");
        setModal(null);
        fetch();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed!");
    } finally {
      setSaving(false);
    }
  };

  const badge = (s) => {
    const m = {
      Rented: "badge-success",
      "Return Requested": "badge-warning",
      Returned: "badge-info",
      Late: "badge-danger",
      Cancelled: "badge-secondary",
    };
    return (
      <span className={`badge badge-sm ${m[s] || "badge-secondary"}`}>{s}</span>
    );
  };
  const payBadge = (s) => {
    const m = {
      Success: "badge-success",
      Pending: "badge-warning",
      Failed: "badge-danger",
    };
    return (
      <span className={`badge badge-sm ${m[s] || "badge-secondary"}`}>
        {s || "Pending"}
      </span>
    );
  };

  const counts = {
    total: orders.length,
    rented: orders.filter((o) => o.status === "Rented").length,
    returned: orders.filter((o) => o.status === "Returned").length,
    late: orders.filter((o) => o.status === "Late").length,
  };

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="mb-1">Manage Rental Orders</h4>
          <p className="text-sm text-muted mb-0">
            View and update all rental order statuses.
          </p>
        </div>
      </div>
      {!loading && (
        <div className="row g-3 mb-4">
          {[
            { l: "Total Orders", v: counts.total, c: "bg-gradient-primary" },
            { l: "Active Rentals", v: counts.rented, c: "bg-gradient-success" },
            { l: "Returned", v: counts.returned, c: "bg-gradient-info" },
            { l: "Late Returns", v: counts.late, c: "bg-gradient-danger" },
          ].map((s) => (
            <div key={s.l} className="col-md-3">
              <div className="card">
                <div className="card-body p-3">
                  <p className="text-sm mb-0 text-uppercase font-weight-bold">
                    {s.l}
                  </p>
                  <h5 className="font-weight-bolder mb-0">{s.v}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <DataTable
        title="All Orders"
        columns={[
          "Customer",
          "Item",
          "Size",
          "Dates",
          "Days",
          "Amount",
          "Status",
          "Payment",
          "Action",
        ]}
        data={orders}
        loading={loading}
        searchKeys={["user.name", "item.name", "status"]}
        emptyMessage="No orders yet."
        renderRow={(o, idx) => (
          <tr key={o._id}>
            <td className="ps-4">
              <p className="text-xs text-secondary mb-0">{idx}</p>
            </td>
            <td>
              <h6 className="mb-0 text-sm">{o.user?.name || "—"}</h6>
              <p className="text-xs text-secondary mb-0">{o.user?.email}</p>
            </td>
            <td>
              <div className="d-flex align-items-center gap-2">
                {o.item?.image && (
                  <img
                    src={`${BACKEND}${o.item.image}`}
                    alt=""
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 6,
                      objectFit: "cover",
                    }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                <p className="text-xs font-weight-bold mb-0">
                  {o.item?.name || "—"}
                </p>
              </div>
            </td>
            <td>
              <span
                className="badge badge-sm bg-gradient-secondary"
                style={{ fontSize: 12 }}
              >
                {o.size?.size || "—"}
              </span>
            </td>
            <td>
              <p className="text-xs mb-0">
                {o.rent_date
                  ? new Date(o.rent_date).toLocaleDateString("en-IN")
                  : "—"}
              </p>
              <p className="text-xs text-secondary mb-0">
                →{" "}
                {o.return_date
                  ? new Date(o.return_date).toLocaleDateString("en-IN")
                  : "—"}
              </p>
            </td>
            <td>
              <p className="text-xs font-weight-bold mb-0">
                {o.rental_days} day{o.rental_days > 1 ? "s" : ""}
              </p>
            </td>
            <td>
              <p className="text-xs font-weight-bold mb-0 text-primary">
                ₹{o.total_amount}
              </p>
            </td>
            <td>
              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color:
                    o.status === "Rented"
                      ? "#22c55e"
                      : o.status === "Return Requested"
                        ? "#f59e0b"
                        : o.status === "Returned"
                          ? "#3b82f6"
                          : o.status === "Late"
                            ? "#ef4444"
                            : "#9ca3af",
                  background:
                    o.status === "Rented"
                      ? "rgba(34,197,94,.12)"
                      : o.status === "Return Requested"
                        ? "rgba(245,158,11,.12)"
                        : o.status === "Returned"
                          ? "rgba(59,130,246,.12)"
                          : o.status === "Late"
                            ? "rgba(239,68,68,.12)"
                            : "rgba(156,163,175,.12)",
                  border:
                    o.status === "Rented"
                      ? "1px solid rgba(34,197,94,.3)"
                      : o.status === "Return Requested"
                        ? "1px solid rgba(245,158,11,.3)"
                        : o.status === "Returned"
                          ? "1px solid rgba(59,130,246,.3)"
                          : o.status === "Late"
                            ? "1px solid rgba(239,68,68,.3)"
                            : "1px solid rgba(156,163,175,.3)",
                }}
              >
                {o.status}
              </span>
            </td>
            <td>
              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color:
                    o.payment_status === "Success"
                      ? "#22c55e"
                      : o.payment_status === "Pending"
                        ? "#f59e0b"
                        : "#ef4444",
                  background:
                    o.payment_status === "Success"
                      ? "rgba(34,197,94,.12)"
                      : o.payment_status === "Pending"
                        ? "rgba(245,158,11,.12)"
                        : "rgba(239,68,68,.12)",
                  border:
                    o.payment_status === "Success"
                      ? "1px solid rgba(34,197,94,.3)"
                      : o.payment_status === "Pending"
                        ? "1px solid rgba(245,158,11,.3)"
                        : "1px solid rgba(239,68,68,.3)",
                }}
              >
                {o.payment_status || "Pending"}
              </span>
            </td>
            <td>
              <button
                className="btn btn-link text-secondary mb-0 p-1"
                title="Update Status"
                onClick={() => {
                  setModal(o);
                  setStatus(o.status);
                }}
              >
                <i className="fa fa-edit text-xs" />
              </button>
            </td>
          </tr>
        )}
      />
      {modal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title font-weight-bolder">
                  Update Order Status
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModal(null)}
                />
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  <div className="alert alert-light text-sm mb-3">
                    <p className="mb-1">
                      <strong>Customer:</strong> {modal.user?.name}
                    </p>
                    <p className="mb-1">
                      <strong>Item:</strong> {modal.item?.name} (
                      {modal.size?.size})
                    </p>
                    <p className="mb-1">
                      <strong>Dates:</strong>{" "}
                      {modal.rent_date
                        ? new Date(modal.rent_date).toLocaleDateString("en-IN")
                        : "—"}{" "}
                      →{" "}
                      {modal.return_date
                        ? new Date(modal.return_date).toLocaleDateString(
                            "en-IN",
                          )
                        : "—"}
                    </p>
                    <p className="mb-0">
                      <strong>Amount:</strong> ₹{modal.total_amount}
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">
                      Order Status
                    </label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                    >
                      <option value="Rented">Rented</option>
                      <option value="Return Requested">Return Requested</option>
                      <option value="Returned">Returned</option>
                      <option value="Late">Late</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setModal(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn bg-gradient-primary btn-sm"
                    disabled={saving}
                  >
                    {saving ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
