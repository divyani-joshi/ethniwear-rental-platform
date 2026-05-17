import React from "react"
import { Link, useLocation } from "react-router-dom"

const menuGroups = [
  { cap: "General", items: [{ to: "/", icon: "fa-chart-pie", label: "Dashboard" }] },
  { cap: "Inventory", items: [
    { to: "/manage-categories", icon: "fa-tags", label: "Categories" },
    { to: "/manage-items", icon: "fa-vest", label: "Clothing Items" },
    { to: "/manage-inventory", icon: "fa-boxes-stacked", label: "Inventory" },
  ]},
  { cap: "Rentals", items: [
    { to: "/manage-orders", icon: "fa-receipt", label: "Orders" },
    { to: "/manage-payments", icon: "fa-credit-card", label: "Payments" },
  ]},
  { cap: "Users", items: [
  { to: "/manage-users", icon: "fa-users", label: "Customers" },
  { to: "/manage-feedbacks", icon: "fa-star", label: "Feedbacks" },
  { to: "/manage-contacts", icon: "fa-envelope", label: "Contact Messages" },
]},
  { cap: "Account", items: [{ to: "/profile", icon: "fa-user-circle", label: "My Profile" }] },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  return (
    <aside className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3" id="sidenav-main"
      style={{ background: "linear-gradient(195deg,#42424a,#191919)" }}>
      <div className="sidenav-header">
        <i className="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none" id="iconSidenav" />
        <Link className="navbar-brand m-0 d-flex align-items-center gap-2 px-4 py-3" to="/">
          <span style={{ fontSize: 22 }}>👘</span>
          <span className="ms-1 font-weight-bold text-white">EthniWear</span>
        </Link>
      </div>
      <hr className="horizontal light mt-0" />
      <div className="collapse navbar-collapse w-auto max-height-vh-100 h-100" id="sidenav-collapse-main">
        <ul className="navbar-nav">
          {menuGroups.map(group => (
            <React.Fragment key={group.cap}>
              <li className="nav-item mt-3">
                <h6 className="ps-4 ms-2 text-uppercase text-xs text-white font-weight-bolder opacity-6">{group.cap}</h6>
              </li>
              {group.items.map(item => {
                const active = pathname === item.to
                return (
                  <li key={item.to} className="nav-item">
                    <Link to={item.to} className={`nav-link text-white${active ? " active bg-gradient-primary" : ""}`}>
                      <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                        <i className={`fa ${item.icon}`} style={{ color: active ? "#344767" : "#67748e", fontSize: 12 }} />
                      </div>
                      <span className="nav-link-text ms-1">{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </aside>
  )
}
