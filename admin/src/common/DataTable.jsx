import React, { useState } from "react";
export default function DataTable({
  title,
  columns,
  data,
  loading,
  searchKeys = [],
  renderRow,
  headerAction,
  emptyMessage = "No data found",
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 7;
  const filtered = data.filter((item) =>
    searchKeys.some((key) => {
      let v = item;
      for (const k of key.split(".")) v = v?.[k];
      return String(v || "")
        .toLowerCase()
        .includes(search.toLowerCase());
    }),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const rows = filtered.slice(start, start + perPage);
  return (
    <div className="card mb-4">
      <div className="card-header pb-0 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <h6 className="mb-0">{title}</h6>
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <div className="input-group" style={{ maxWidth: 260 }}>
            <span className="input-group-text">
              <i className="fa fa-search" style={{ fontSize: 12 }} />
            </span>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          {headerAction}
        </div>
      </div>
      <div className="card-body px-0 pt-0 pb-2">
        <div className="table-responsive p-0">
          <table className="table align-items-center mb-0">
            <thead>
              <tr>
                {["#", ...columns].map((c) => (
                  <th
                    key={c}
                    className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-5">
                    <div className="spinner-border spinner-border-sm text-primary me-2" />
                    <span className="text-secondary">Loading...</span>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-5">
                    <i
                      className="fa fa-search text-secondary mb-2 d-block"
                      style={{ fontSize: 24 }}
                    />
                    <span className="text-secondary text-sm">
                      {emptyMessage}
                    </span>
                  </td>
                </tr>
              ) : (
                rows.map((item, i) => renderRow(item, start + i + 1))
              )}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > 0 && (
          <div className="d-flex justify-content-between align-items-center px-4 pt-3 flex-wrap gap-2">
            <small className="text-secondary">
              Showing {start + 1}–{Math.min(start + perPage, filtered.length)}{" "}
              of {filtered.length}
            </small>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage(page - 1)}
                  >
                    ‹
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${page === i + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${page === totalPages ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPage(page + 1)}
                  >
                    ›
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
