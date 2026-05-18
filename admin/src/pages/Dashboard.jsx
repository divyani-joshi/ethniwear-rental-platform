import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../common/AdminLayout";
import { getDashboardStats } from "../services/api";

export default function Dashboard({ setIsAuthenticated, adminName }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((r) => setStats(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        {
          label: "Total Users",
          value: stats.totalUsers,
          icon: "fa-users",
          color: "bg-gradient-primary",
        },
        {
          label: "Categories",
          value: stats.totalCategories,
          icon: "fa-tags",
          color: "bg-gradient-info",
        },
        {
          label: "Total Items",
          value: stats.totalItems,
          icon: "fa-vest",
          color: "bg-gradient-success",
        },
        {
          label: "Available Items",
          value: stats.availableItems,
          icon: "fa-check-circle",
          color: "bg-gradient-success",
        },
        {
          label: "Rented Items",
          value: stats.rentedItems,
          icon: "fa-clock",
          color: "bg-gradient-warning",
        },
        {
          label: "Total Orders",
          value: stats.totalOrders,
          icon: "fa-receipt",
          color: "bg-gradient-primary",
        },
        {
          label: "Active Rentals",
          value: stats.activeRentals,
          icon: "fa-hourglass-half",
          color: "bg-gradient-warning",
        },
        {
          label: "Returned",
          value: stats.returnedOrders,
          icon: "fa-undo",
          color: "bg-gradient-info",
        },
        {
          label: "Late Returns",
          value: stats.lateOrders,
          icon: "fa-exclamation-triangle",
          color: "bg-gradient-danger",
        },
        {
          label: "Total Revenue",
          value: `₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`,
          icon: "fa-rupee-sign",
          color: "bg-gradient-success",
        },
        {
          label: "Avg Rating",
          value: `${stats.avgRating}/5`,
          icon: "fa-star",
          color: "bg-gradient-warning",
        },
      ]
    : [];

  const badge = (s) => {
    const m = {
      Rented: "badge-success",
      Returned: "badge-info",
      Late: "badge-danger",
      Cancelled: "badge-secondary",
      Success: "badge-success",
      Pending: "badge-warning",
      Failed: "badge-danger",
    };
    return (
      <span className={`badge badge-sm ${m[s] || "badge-secondary"}`}>{s}</span>
    );
  };

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1">Dashboard</h4>
              <p className="text-sm mb-0">
                Welcome back, <strong>{adminName}</strong> 👘
              </p>
            </div>
            <div className="d-flex gap-2">
              <Link
                to="/manage-items"
                className="btn bg-gradient-primary btn-sm"
              >
                <i className="fa fa-plus me-1" />
                Add Item
              </Link>
              <Link
                to="/manage-orders"
                className="btn btn-outline-primary btn-sm"
              >
                <i className="fa fa-receipt me-1" />
                Orders
              </Link>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="row g-3 mb-4">
            {cards.map((c, i) => (
              <div key={i} className="col-xl-3 col-md-6">
                <div className="card">
                  <div className="card-body p-3">
                    <div className="row">
                      <div className="col-8">
                        <div className="numbers">
                          <p className="text-sm mb-0 text-uppercase font-weight-bold">
                            {c.label}
                          </p>
                          <h5 className="font-weight-bolder mb-0">{c.value}</h5>
                        </div>
                      </div>
                      <div className="col-4 text-end">
                        <div
                          className={`icon icon-shape ${c.color} shadow text-center border-radius-md`}
                        >
                          <i
                            className={`fa ${c.icon} text-lg opacity-10`}
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="row">
            <div className="col-lg-7 mb-4">
              <div className="card">
                <div className="card-header pb-0 d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Recent Orders</h6>
                  <Link
                    to="/manage-orders"
                    className="btn btn-sm btn-outline-primary"
                  >
                    View All
                  </Link>
                </div>
                <div className="card-body px-0 pt-0 pb-2">
                  <div className="table-responsive p-0">
                    <table className="table align-items-center mb-0">
                      <thead>
                        <tr>
                          <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                            Customer
                          </th>
                          <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                            Item
                          </th>
                          <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                            Amount
                          </th>
                          <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {!stats?.recentOrders?.length ? (
                          <tr>
                            <td
                              colSpan="4"
                              className="text-center py-4 text-muted text-sm"
                            >
                              No orders yet
                            </td>
                          </tr>
                        ) : (
                          stats.recentOrders.map((o, i) => (
                            <tr key={o._id || i}>
                              <td>
                                <div className="d-flex px-2 py-1 align-items-center">
                                  <div className="d-flex flex-column justify-content-center">
                                    <h6 className="mb-0 text-sm">
                                      {o.user?.name || "—"}
                                    </h6>
                                    <p className="text-xs text-secondary mb-0">
                                      {o.user?.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <p className="text-xs font-weight-bold mb-0">
                                  {o.item?.name || "—"}
                                </p>
                              </td>
                              <td>
                                <p className="text-xs font-weight-bold mb-0 text-primary">
                                  ₹{o.total_amount}
                                </p>
                              </td>
                              <td>{badge(o.status)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Payments */}
            <div className="col-lg-5 mb-4">
              <div className="card">
                <div className="card-header pb-0 d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Recent Payments</h6>
                  <Link
                    to="/manage-payments"
                    className="btn btn-sm btn-outline-primary"
                  >
                    View All
                  </Link>
                </div>
                <div className="card-body px-0 pt-0 pb-2">
                  <div className="table-responsive p-0">
                    <table className="table align-items-center mb-0">
                      <thead>
                        <tr>
                          <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                            Customer
                          </th>
                          <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                            Amount
                          </th>
                          <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {!stats?.recentPayments?.length ? (
                          <tr>
                            <td
                              colSpan="3"
                              className="text-center py-4 text-muted text-sm"
                            >
                              No payments yet
                            </td>
                          </tr>
                        ) : (
                          stats.recentPayments.map((p, i) => (
                            <tr key={p._id || i}>
                              <td>
                                <div className="px-2 py-1">
                                  <h6 className="mb-0 text-sm">
                                    {p.user?.name || "—"}
                                  </h6>
                                  <p className="text-xs text-secondary mb-0">
                                    {new Date(p.date).toLocaleDateString(
                                      "en-IN",
                                    )}
                                  </p>
                                </div>
                              </td>
                              <td>
                                <p className="text-xs font-weight-bold mb-0 text-success">
                                  ₹{p.total_amount}
                                </p>
                              </td>
                              <td>{badge(p.status)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
