import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AdminLayout from "../common/AdminLayout"
import DataTable from "../common/DataTable"
import { getAdminItems, getAdminCategories, addItem, updateItem, deleteItem } from "../services/api"

const BACKEND = "http://localhost:8000"
const empty = { category_id: "", name: "", description: "", price: "", status: "Available" }

export default function ManageItems({ setIsAuthenticated, adminName }) {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [imgFile, setImgFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetch = async () => {
    setLoading(true)
    try {
      const [iR, cR] = await Promise.all([getAdminItems(), getAdminCategories()])
      setItems(iR.data.data || [])
      setCategories(cR.data.data || [])
    } catch { toast.error("Failed to load items") }
    finally { setLoading(false) }
  }
  useEffect(() => { fetch() }, [])

  const openAdd = () => { setEditing(null); setForm(empty); setImgFile(null); setPreview(null); setModal(true) }
  const openEdit = (item) => {
    setEditing(item)
    setForm({ category_id: String(item.category_id || item.category?._id || ""), name: item.name, description: item.description, price: item.price, status: item.status || "Available" })
    setImgFile(null); setPreview(item.image ? `${BACKEND}${item.image}` : null)
    setModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      fd.append("category_id", form.category_id)
      fd.append("name", form.name)
      fd.append("description", form.description)
      fd.append("price", form.price)
      if (editing) { fd.append("id", editing._id); fd.append("status", form.status) }
      if (imgFile) fd.append("image", imgFile)
      const res = editing ? await updateItem(fd) : await addItem(fd)
      if (res.data.success) { toast.success(editing ? "Item updated!" : "Item added!"); setModal(false); fetch() }
    } catch (err) { toast.error(err.response?.data?.message || "Failed!") }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this clothing item?")) return
    try { const r = await deleteItem(id); if (r.data.success) { toast.success("Deleted!"); fetch() } }
    catch (err) { toast.error(err.response?.data?.message || "Delete failed!") }
  }

  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="mb-1">Manage Clothing Items</h4>
          <p className="text-sm text-muted mb-0">Add and manage ethnic clothing available for rental.</p>
        </div>
      </div>

      <DataTable
        title="All Clothing Items"
        columns={["Image", "Name", "Category", "Price/Day", "Status", "Actions"]}
        data={items} loading={loading}
        searchKeys={["name", "category.name", "status"]}
        emptyMessage="No clothing items yet. Add your first item!"
        headerAction={
          <button className="btn bg-gradient-primary btn-sm" onClick={openAdd}>
            <i className="fa fa-plus me-1" />Add Item
          </button>
        }
        renderRow={(item, idx) => (
          <tr key={item._id}>
            <td className="ps-4"><p className="text-xs text-secondary mb-0">{idx}</p></td>
            <td>
              {item.image ? (
                <img src={`${BACKEND}${item.image}`} alt={item.name}
                  style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover" }}
                  onError={e => e.target.style.display = "none"} />
              ) : (
                <div style={{ width: 52, height: 52, borderRadius: 8, background: "linear-gradient(135deg,#E3E231,#b5b300)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👘</div>
              )}
            </td>
            <td>
              <h6 className="mb-0 text-sm">{item.name}</h6>
              <p className="text-xs text-secondary mb-0" style={{ maxWidth: 180 }}>{item.description?.slice(0, 50)}{item.description?.length > 50 ? "..." : ""}</p>
            </td>
            <td><p className="text-xs font-weight-bold mb-0">{item.category?.name || "—"}</p></td>
            <td><p className="text-xs font-weight-bold mb-0 text-primary">₹{item.price}<span className="text-secondary font-weight-normal">/day</span></p></td>
            <td><span className={`badge badge-sm ${item.status === "Available" ? "badge-success" : "badge-warning"}`}>{item.status}</span></td>
            <td>
              <div className="d-flex gap-2">
                <button className="btn btn-link text-secondary mb-0 p-1" onClick={() => openEdit(item)} title="Edit"><i className="fa fa-edit text-xs" /></button>
                <button className="btn btn-link text-danger mb-0 p-1" onClick={() => handleDelete(item._id)} title="Delete"><i className="fa fa-trash text-xs" /></button>
              </div>
            </td>
          </tr>
        )}
      />

      {modal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title font-weight-bolder">{editing ? "Edit Clothing Item" : "Add Clothing Item"}</h5>
                <button type="button" className="btn-close" onClick={() => setModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Image upload */}
                  <div className="text-center mb-4">
                    <div style={{ position: "relative", display: "inline-block" }}>
                      {preview ? (
                        <img src={preview} alt="Preview" style={{ width: 100, height: 100, borderRadius: 10, objectFit: "cover", border: "2px dashed #344767" }} onError={e => e.target.style.display = "none"} />
                      ) : (
                        <div style={{ width: 100, height: 100, borderRadius: 10, background: "linear-gradient(135deg,#E3E231,#b5b300)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>👘</div>
                      )}
                      <label htmlFor="item-img" style={{ position: "absolute", bottom: -6, right: -6, width: 28, height: 28, borderRadius: "50%", background: "#344767", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13, border: "2px solid #fff" }}>
                        <i className="fa fa-camera" />
                        <input id="item-img" type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) { setImgFile(f); setPreview(URL.createObjectURL(f)) } }} />
                      </label>
                    </div>
                    <p className="text-xs text-secondary mt-2 mb-0">Click to upload item image</p>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">Category *</label>
                      <select className="form-select" value={form.category_id} onChange={e => sf("category_id", e.target.value)} required>
                        <option value="">Select category</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">Item Name *</label>
                      <input type="text" className="form-control" value={form.name} onChange={e => sf("name", e.target.value)} placeholder="e.g. Designer Lehenga" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">Description *</label>
                      <textarea className="form-control" rows={3} value={form.description} onChange={e => sf("description", e.target.value)} placeholder="Describe the outfit, fabric, embroidery, occasion..." required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">Rental Price (₹/day) *</label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input type="number" className="form-control" value={form.price} onChange={e => sf("price", e.target.value)} placeholder="500" min="1" required />
                        <span className="input-group-text">/day</span>
                      </div>
                    </div>
                    {editing && (
                      <div className="col-md-6">
                        <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">Status</label>
                        <select className="form-select" value={form.status} onChange={e => sf("status", e.target.value)}>
                          <option value="Available">Available</option>
                          <option value="Rented">Rented</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setModal(false)}>Cancel</button>
                  <button type="submit" className="btn bg-gradient-primary btn-sm" disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-1" />{editing ? "Updating..." : "Adding..."}</> : (editing ? "Update Item" : "Add Item")}
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
