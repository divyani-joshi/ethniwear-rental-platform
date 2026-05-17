import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AdminLayout from "../common/AdminLayout"
import DataTable from "../common/DataTable"
import { getInventory, getAdminItems, addInventory, updateInventory, deleteInventory } from "../services/api"
import axios from "axios"

const BACKEND = "http://localhost:8000"

export default function ManageInventory({ setIsAuthenticated, adminName }) {
  const [inventory, setInventory] = useState([])
  const [items, setItems] = useState([])
  const [sizes, setSizes] = useState([])
  const [loading, setLoading] = useState(true)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(null)
  const [addForm, setAddForm] = useState({ item_id: "", size_id: "", quantity: "", available: "" })
  const [editForm, setEditForm] = useState({ quantity: "", available: "" })
  const [saving, setSaving] = useState(false)

  const fetch = async () => {
    setLoading(true)
    try {
      const [invR, itemR] = await Promise.all([getInventory(), getAdminItems()])
      setInventory(invR.data.data || [])
      setItems(itemR.data.data || [])
    } catch { toast.error("Failed to load inventory") }
    finally { setLoading(false) }
  }

  useEffect(() => {
    fetch()
    // Fetch sizes from public endpoint
    axios.get(`${BACKEND}/sizes`).then(r => setSizes(r.data.data || [])).catch(console.error)
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const r = await addInventory(addForm)
      if (r.data.success) { toast.success("Inventory added!"); setAddModal(false); setAddForm({ item_id: "", size_id: "", quantity: "", available: "" }); fetch() }
    } catch (err) { toast.error(err.response?.data?.message || "Failed!") }
    finally { setSaving(false) }
  }

  const handleEdit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const r = await updateInventory({ id: editModal._id, quantity: editForm.quantity, available: editForm.available })
      if (r.data.success) { toast.success("Inventory updated!"); setEditModal(null); fetch() }
    } catch (err) { toast.error(err.response?.data?.message || "Failed!") }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this inventory entry?")) return
    try { const r = await deleteInventory(id); if (r.data.success) { toast.success("Deleted!"); fetch() } }
    catch (err) { toast.error(err.response?.data?.message || "Delete failed!") }
  }

  const totalStock = inventory.reduce((s, i) => s + (i.quantity || 0), 0)
  const totalAvail = inventory.reduce((s, i) => s + (i.available || 0), 0)

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="mb-1">Manage Inventory</h4>
          <p className="text-sm text-muted mb-0">Track size availability and quantities for each clothing item.</p>
        </div>
      </div>

      {/* Summary Cards */}
      {!loading && (
        <div className="row g-3 mb-4">
          {[
            { label: "Total Entries", value: inventory.length, icon: "fa-list", color: "bg-gradient-primary" },
            { label: "Total Stock", value: totalStock, icon: "fa-boxes-stacked", color: "bg-gradient-info" },
            { label: "Available Units", value: totalAvail, icon: "fa-check-circle", color: "bg-gradient-success" },
            { label: "Rented Units", value: totalStock - totalAvail, icon: "fa-clock", color: "bg-gradient-warning" },
          ].map(c => (
            <div key={c.label} className="col-md-3">
              <div className="card">
                <div className="card-body p-3">
                  <div className="row align-items-center">
                    <div className="col-8">
                      <p className="text-sm mb-0 text-uppercase font-weight-bold">{c.label}</p>
                      <h5 className="font-weight-bolder mb-0">{c.value}</h5>
                    </div>
                    <div className="col-4 text-end">
                      <div className={`icon icon-shape ${c.color} shadow text-center border-radius-md`}>
                        <i className={`fa ${c.icon} text-lg opacity-10`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DataTable
        title="Inventory Entries"
        columns={["Item", "Size", "Total Qty", "Available", "Rented", "Actions"]}
        data={inventory} loading={loading}
        searchKeys={["item.name", "size.size"]}
        emptyMessage="No inventory yet. Add size entries for your clothing items!"
        headerAction={
          <button className="btn bg-gradient-primary btn-sm" onClick={() => setAddModal(true)}>
            <i className="fa fa-plus me-1" />Add Inventory
          </button>
        }
        renderRow={(inv, idx) => {
          const rented = (inv.quantity || 0) - (inv.available || 0)
          const pct = inv.quantity ? Math.round((inv.available / inv.quantity) * 100) : 0
          return (
            <tr key={inv._id}>
              <td className="ps-4"><p className="text-xs text-secondary mb-0">{idx}</p></td>
              <td>
                <h6 className="mb-0 text-sm">{inv.item?.name || "—"}</h6>
                <p className="text-xs text-secondary mb-0">{inv.item?.category?.name || ""}</p>
              </td>
              <td>
                <span className="badge badge-sm bg-gradient-secondary" style={{ fontSize: 13 }}>{inv.size?.size || "—"}</span>
              </td>
              <td><p className="text-xs font-weight-bold mb-0">{inv.quantity}</p></td>
              <td>
                <div>
                  <p className="text-xs font-weight-bold mb-1 text-success">{inv.available}</p>
                  <div className="progress" style={{ height: 4, width: 60 }}>
                    <div className="progress-bar bg-gradient-success" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </td>
              <td><p className="text-xs font-weight-bold mb-0 text-warning">{rented}</p></td>
              <td>
                <div className="d-flex gap-2">
                  <button className="btn btn-link text-secondary mb-0 p-1" title="Edit"
                    onClick={() => { setEditModal(inv); setEditForm({ quantity: inv.quantity, available: inv.available }) }}>
                    <i className="fa fa-edit text-xs" />
                  </button>
                  <button className="btn btn-link text-danger mb-0 p-1" title="Delete" onClick={() => handleDelete(inv._id)}>
                    <i className="fa fa-trash text-xs" />
                  </button>
                </div>
              </td>
            </tr>
          )
        }}
      />

      {/* Add Modal */}
      {addModal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title font-weight-bolder">Add Inventory Entry</h5>
                <button type="button" className="btn-close" onClick={() => setAddModal(false)} />
              </div>
              <form onSubmit={handleAdd}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">Clothing Item *</label>
                    <select className="form-select" value={addForm.item_id} onChange={e => setAddForm(f => ({ ...f, item_id: e.target.value }))} required>
                      <option value="">Select item</option>
                      {items.map(i => <option key={i._id} value={i._id}>{i.name} — ₹{i.price}/day</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">Size *</label>
                    <select className="form-select" value={addForm.size_id} onChange={e => setAddForm(f => ({ ...f, size_id: e.target.value }))} required>
                      <option value="">Select size</option>
                      {sizes.map(s => <option key={s._id} value={s._id}>{s.size}</option>)}
                    </select>
                    {sizes.length === 0 && <small className="text-muted">No sizes found. Ensure backend has sizes seeded.</small>}
                  </div>
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">Total Quantity *</label>
                      <input type="number" className="form-control" value={addForm.quantity} onChange={e => setAddForm(f => ({ ...f, quantity: e.target.value }))} placeholder="10" min="1" required />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">Available *</label>
                      <input type="number" className="form-control" value={addForm.available} onChange={e => setAddForm(f => ({ ...f, available: e.target.value }))} placeholder="10" min="0" required />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn bg-gradient-primary btn-sm" disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-1" />Adding...</> : "Add Inventory"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title font-weight-bolder">Update Inventory</h5>
                <button type="button" className="btn-close" onClick={() => setEditModal(null)} />
              </div>
              <form onSubmit={handleEdit}>
                <div className="modal-body">
                  <div className="alert alert-light text-sm mb-3">
                    <strong>{editModal.item?.name}</strong> — Size: <strong>{editModal.size?.size}</strong>
                  </div>
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">Total Quantity *</label>
                      <input type="number" className="form-control" value={editForm.quantity} onChange={e => setEditForm(f => ({ ...f, quantity: e.target.value }))} min="1" required />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">Available *</label>
                      <input type="number" className="form-control" value={editForm.available} onChange={e => setEditForm(f => ({ ...f, available: e.target.value }))} min="0" required />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setEditModal(null)}>Cancel</button>
                  <button type="submit" className="btn bg-gradient-primary btn-sm" disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-1" />Updating...</> : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
