import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../common/AdminLayout";
import DataTable from "../common/DataTable";
import {
  getAdminCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../services/api";

const BACKEND = "http://localhost:8000";

export default function ManageCategories({ setIsAuthenticated, adminName }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", status: "Active" });
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const r = await getAdminCategories();
      setCategories(r.data.data || []);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", status: "Active" });
    setImgFile(null);
    setPreview(null);
    setModal(true);
  };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, status: c.status || "Active" });
    setImgFile(null);
    setPreview(c.category ? `${BACKEND}${c.category}` : null);
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      if (editing) {
        fd.append("id", editing._id);
        fd.append("status", form.status);
      }
      if (imgFile) fd.append("category", imgFile); // field name is "category"
      const res = editing ? await updateCategory(fd) : await addCategory(fd);
      if (res.data.success) {
        toast.success(editing ? "Category updated!" : "Category added!");
        setModal(false);
        fetch();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this category? Items under this category may be affected.",
      )
    )
      return;
    try {
      const r = await deleteCategory(id);
      if (r.data.success) {
        toast.success("Deleted!");
        fetch();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed!");
    }
  };

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="mb-1">Manage Categories</h4>
          <p className="text-sm text-muted mb-0">
            Add and manage clothing categories for the rental platform.
          </p>
        </div>
      </div>

      <DataTable
        title="All Categories"
        columns={["Image", "Name", "Status", "Actions"]}
        data={categories}
        loading={loading}
        searchKeys={["name", "status"]}
        emptyMessage="No categories yet. Add your first category!"
        headerAction={
          <button className="btn bg-gradient-primary btn-sm" onClick={openAdd}>
            <i className="fa fa-plus me-1" />
            Add Category
          </button>
        }
        renderRow={(c, idx) => (
          <tr key={c._id}>
            <td className="ps-4">
              <p className="text-xs text-secondary mb-0">{idx}</p>
            </td>
            <td>
              {c.category ? (
                <img
                  src={`${BACKEND}${c.category}`}
                  alt={c.name}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    background: "linear-gradient(135deg,#E3E231,#b5b300)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  👘
                </div>
              )}
            </td>
            <td>
              <div className="d-flex flex-column">
                <h6 className="mb-0 text-sm">{c.name}</h6>
              </div>
            </td>
            <td>
              <span
                className={`badge badge-sm ${c.status === "Active" ? "badge-success" : "badge-danger"}`}
              >
                {c.status || "Active"}
              </span>
            </td>
            <td className="align-middle">
              <div className="d-flex gap-2">
                <button
                  className="btn btn-link text-secondary mb-0 p-1"
                  onClick={() => openEdit(c)}
                  title="Edit"
                >
                  <i className="fa fa-edit text-xs" />
                </button>
                <button
                  className="btn btn-link text-danger mb-0 p-1"
                  onClick={() => handleDelete(c._id)}
                  title="Delete"
                >
                  <i className="fa fa-trash text-xs" />
                </button>
              </div>
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
                  {editing ? "Edit Category" : "Add Category"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModal(false)}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Image Upload */}
                  <div className="text-center mb-4">
                    <div
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          style={{
                            width: 90,
                            height: 90,
                            borderRadius: 10,
                            objectFit: "cover",
                            border: "2px dashed #344767",
                          }}
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      ) : (
                        <div
                          style={{
                            width: 90,
                            height: 90,
                            borderRadius: 10,
                            background:
                              "linear-gradient(135deg,#E3E231,#b5b300)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 36,
                          }}
                        >
                          👘
                        </div>
                      )}
                      <label
                        htmlFor="cat-img"
                        style={{
                          position: "absolute",
                          bottom: -6,
                          right: -6,
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          background: "#344767",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          fontSize: 12,
                          border: "2px solid #fff",
                        }}
                      >
                        <i className="fa fa-camera" />
                        <input
                          id="cat-img"
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const f = e.target.files[0];
                            if (f) {
                              setImgFile(f);
                              setPreview(URL.createObjectURL(f));
                            }
                          }}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-secondary mt-2 mb-0">
                      Click icon to upload image
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="e.g. Bridal Lehenga, Festival Saree"
                      required
                    />
                  </div>
                  {editing && (
                    <div className="mb-3">
                      <label className="form-label text-xs font-weight-bold text-secondary text-uppercase">
                        Status
                      </label>
                      <select
                        className="form-select"
                        value={form.status}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value })
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn bg-gradient-primary btn-sm"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" />
                        {editing ? "Updating..." : "Adding..."}
                      </>
                    ) : editing ? (
                      "Update"
                    ) : (
                      "Add Category"
                    )}
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
