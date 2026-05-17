import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import checkSession from "./auth/authService"
import Header from "./common/Header"
import Footer from "./common/Footer"
import Home from "./pages/Home"
import Collections from "./pages/Collections"
import ItemDetail from "./pages/ItemDetail"
import MyOrders from "./pages/MyOrders"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import Feedbacks from "./pages/Feedbacks"
import About from "./pages/About"
import Contact from "./pages/Contact"




const Spin = () => (
  <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#121212"}}>
    <div style={{textAlign:"center"}}>
      <div style={{width:48,height:48,border:"3px solid rgba(227,226,49,.2)",borderTopColor:"#E3E231",borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 16px"}}/>
      <p style={{color:"#E3E231",letterSpacing:2,fontSize:13}}>LOADING...</p>
    </div>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
)

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession().then(({ isAuth, session }) => {
      setIsAuthenticated(isAuth); setUserData(session)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spin />

  return (
    <BrowserRouter>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} userData={userData} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/item/:id" element={<ItemDetail isAuthenticated={isAuthenticated} />} />
        <Route path="/feedbacks" element={<Feedbacks />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} setUserData={setUserData} /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/my-orders" element={isAuthenticated ? <MyOrders /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile userData={userData} setUserData={setUserData} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
