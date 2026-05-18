import React, { useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import DataTable from "../common/DataTable";
import axios from "axios";
import { toast } from "react-toastify";

export default function ManageContacts({ setIsAuthenticated, adminName }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/contacts");

      setContacts(response.data.contacts || []);
    } catch (error) {
      console.log(error);

      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="mb-1">Contact Messages</h4>

          <p className="text-sm text-muted mb-0">
            View all customer contact inquiries.
          </p>
        </div>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="row g-3 mb-4">
          {[
            {
              l: "Total Messages",
              v: contacts.length,
            },

            {
              l: "Unique Emails",
              v: [...new Set(contacts.map((c) => c.email))].length,
            },

            {
              l: "Today's Messages",
              v: contacts.filter((c) => {
                const today = new Date().toLocaleDateString();

                const msgDate = new Date(c.createdAt).toLocaleDateString();

                return today === msgDate;
              }).length,
            },
          ].map((s) => (
            <div key={s.l} className="col-md-4">
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

      {/* Table */}
      <DataTable
        title="All Contact Messages"
        columns={["Customer", "Subject", "Message", "Date"]}
        data={contacts}
        loading={loading}
        searchKeys={["full_name", "email", "subject", "message"]}
        emptyMessage="No contact messages found."
        renderRow={(c, idx) => (
          <tr key={c._id}>
            <td className="ps-4">
              <p className="text-xs text-secondary mb-0">{idx}</p>
            </td>

            <td>
              <h6 className="mb-0 text-sm">{c.full_name || "—"}</h6>

              <p className="text-xs text-secondary mb-0">{c.email || "—"}</p>
            </td>

            <td>
              <p className="text-xs font-weight-bold mb-0">
                {c.subject || "—"}
              </p>
            </td>

            <td>
              <p
                className="text-xs text-secondary mb-0"
                style={{
                  maxWidth: 220,
                }}
              >
                {c.message?.slice(0, 80)}

                {c.message?.length > 80 ? "..." : ""}
              </p>
            </td>

            <td>
              <p className="text-xs text-secondary mb-0">
                {c.createdAt
                  ? new Date(c.createdAt).toLocaleDateString("en-IN")
                  : "—"}
              </p>
            </td>
          </tr>
        )}
      />
    </AdminLayout>
  );
}
