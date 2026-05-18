import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import checkSession from "./auth/authService"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import ManageCategories from "./pages/ManageCategories"
import ManageItems from "./pages/ManageItems"
import ManageInventory from "./pages/ManageInventory"
import ManageOrders from "./pages/ManageOrders"
import ManageUsers from "./pages/ManageUsers"
import ManagePayments from "./pages/ManagePayments"
import ManageFeedbacks from "./pages/ManageFeedbacks"
import AdminProfile from "./pages/AdminProfile"
import ManageContacts from "./pages/ManageContact"

const Spin = () => (
  <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
  </div>
)

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminName, setAdminName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession().then(({ isAuth, session }) => {
      setIsAuthenticated(isAuth)
      if (session?.name) setAdminName(session.name)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spin />

  const props = { setIsAuthenticated, adminName }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} setAdminName={setAdminName} /> : <Navigate to="/" />} />
        <Route path="/" element={isAuthenticated ? <Dashboard {...props} /> : <Navigate to="/login" />} />
        <Route path="/manage-categories" element={isAuthenticated ? <ManageCategories {...props} /> : <Navigate to="/login" />} />
        <Route path="/manage-items" element={isAuthenticated ? <ManageItems {...props} /> : <Navigate to="/login" />} />
        <Route path="/manage-inventory" element={isAuthenticated ? <ManageInventory {...props} /> : <Navigate to="/login" />} />
        <Route path="/manage-orders" element={isAuthenticated ? <ManageOrders {...props} /> : <Navigate to="/login" />} />
        <Route path="/manage-users" element={isAuthenticated ? <ManageUsers {...props} /> : <Navigate to="/login" />} />
        <Route path="/manage-payments" element={isAuthenticated ? <ManagePayments {...props} /> : <Navigate to="/login" />} />
        <Route path="/manage-feedbacks" element={isAuthenticated ? <ManageFeedbacks {...props} /> : <Navigate to="/login" />} />
        <Route path="/manage-contacts"element={isAuthenticated? <ManageContacts {...props} />: <Navigate to="/login" />}/>
        <Route path="/profile" element={isAuthenticated ? <AdminProfile {...props} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  )
}
