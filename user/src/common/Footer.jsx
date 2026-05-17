import React from "react"
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer style={{ background: "#0d0d0d", borderTop: "1px solid rgba(227,226,49,.1)", padding: "60px 0 30px" }}>
      <div className="container">
        <div className="row g-4 mb-5">
          <div className="col-lg-4">
            <h5 style={{ color: "var(--primary-color)", fontFamily: "Outfit, sans-serif", fontWeight: 900, fontSize: 22, marginBottom: 12 }}>
              Ethni<span style={{ color: "#fff" }}>Wear</span>
            </h5>
            <p style={{ color: "#595959", fontSize: 14, lineHeight: 1.8 }}>
              India's premier ethnic clothing rental platform. Rent beautiful traditional outfits for every occasion — weddings, festivals, ceremonies and more.
            </p>
          </div>
          <div className="col-lg-2 col-md-4">
            <h6 style={{ color: "#fff", fontWeight: 700, marginBottom: 16, textTransform: "uppercase", fontSize: 12, letterSpacing: 1.5 }}>Quick Links</h6>
            {[{to:"/",l:"Home"},{to:"/collections",l:"Collections"},{to:"/feedbacks",l:"Reviews"},{to:"/about",l:"About Us"}].map(x=>(
              <div key={x.to} style={{ marginBottom: 8 }}>
                <Link to={x.to} style={{ color: "#595959", fontSize: 14, textDecoration: "none" }}
                  onMouseEnter={e=>e.target.style.color="var(--primary-color)"} onMouseLeave={e=>e.target.style.color="#595959"}>
                  {x.l}
                </Link>
              </div>
            ))}
          </div>
          <div className="col-lg-2 col-md-4">
            <h6 style={{ color: "#fff", fontWeight: 700, marginBottom: 16, textTransform: "uppercase", fontSize: 12, letterSpacing: 1.5 }}>Account</h6>
            {[{to:"/login",l:"Login"},{to:"/register",l:"Register"},{to:"/my-orders",l:"My Orders"},{to:"/profile",l:"Profile"}].map(x=>(
              <div key={x.to} style={{ marginBottom: 8 }}>
                <Link to={x.to} style={{ color: "#595959", fontSize: 14, textDecoration: "none" }}
                  onMouseEnter={e=>e.target.style.color="var(--primary-color)"} onMouseLeave={e=>e.target.style.color="#595959"}>
                  {x.l}
                </Link>
              </div>
            ))}
          </div>
          <div className="col-lg-4 col-md-4">
            <h6 style={{ color: "#fff", fontWeight: 700, marginBottom: 16, textTransform: "uppercase", fontSize: 12, letterSpacing: 1.5 }}>Contact</h6>
            {[{i:"bi-geo-alt",t:"Navrangpura, Ahmedabad, Gujarat"},{i:"bi-telephone",t:"+91 12345 67890"},{i:"bi-envelope",t:"info@ethniwear.in"},{i:"bi-clock",t:"Mon–Sat: 10:00 AM – 8:00 PM"}].map((c,i)=>(
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <i className={`bi ${c.i}`} style={{ color: "var(--primary-color)", marginTop: 2, flexShrink: 0 }} />
                <span style={{ color: "#595959", fontSize: 14 }}>{c.t}</span>
              </div>
            ))}
          </div>
        </div>
        <hr style={{ borderColor: "rgba(255,255,255,.08)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, paddingTop: 20 }}>
          <p style={{ color: "#595959", fontSize: 13, margin: 0 }}>© {new Date().getFullYear()} <strong style={{ color: "var(--primary-color)" }}>EthniWear</strong>. All rights reserved.</p>
          <p style={{ color: "#595959", fontSize: 13, margin: 0 }}>Powered by <strong style={{ color: "var(--primary-color)" }}>Razorpay</strong> Secure Payments</p>
        </div>
      </div>
    </footer>
  )
}
