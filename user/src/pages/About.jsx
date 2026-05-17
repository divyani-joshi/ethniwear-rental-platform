import React from "react"
import { Link } from "react-router-dom"
export default function About() {
  return (
    <div style={{ background:"#121212",minHeight:"80vh" }}>
      <div style={{ background:"#0d0d0d",borderBottom:"1px solid rgba(227,226,49,.1)",padding:"48px 0" }}>
        <div className="container text-center"><h1 style={{ color:"#fff",fontFamily:"Outfit, sans-serif",fontWeight:900,fontSize:"clamp(1.8rem,4vw,3rem)",marginBottom:8 }}>About <span style={{ color:"var(--primary-color)" }}>EthniWear</span></h1><p style={{ color:"#595959",fontSize:13 }}><Link to="/" style={{ color:"#595959",textDecoration:"none" }}>Home</Link> › <span style={{ color:"var(--primary-color)" }}>About</span></p></div>
      </div>
      <div className="container" style={{ padding:"60px 0" }}>
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <div style={{ background:"linear-gradient(135deg,rgba(227,226,49,.08),rgba(227,226,49,.02))",border:"1px solid rgba(227,226,49,.15)",borderRadius:20,padding:48,textAlign:"center" }}>
              <div style={{ fontSize:80,marginBottom:16 }}>👘</div>
              <h3 style={{ color:"var(--primary-color)",fontWeight:900,fontFamily:"Outfit, sans-serif" }}>EthniWear</h3>
              <p style={{ color:"#595959",fontSize:14 }}>Making Tradition Accessible</p>
            </div>
          </div>
          <div className="col-lg-6">
            <p style={{ color:"var(--primary-color)",fontSize:12,letterSpacing:3,textTransform:"uppercase",fontWeight:700,marginBottom:12 }}>Our Story</p>
            <h2 style={{ color:"#fff",fontFamily:"Outfit, sans-serif",fontWeight:800,fontSize:"clamp(1.4rem,3vw,2.2rem)",marginBottom:16 }}>India's Premier Ethnic <span style={{ color:"var(--primary-color)" }}>Clothing Rental</span> Platform</h2>
            <p style={{ color:"#A0A0A0",lineHeight:1.8,marginBottom:16 }}>EthniWear makes traditional ethnic wear accessible to everyone. Browse hundreds of exquisite outfits — from bridal lehengas to festival sarees — and rent them for any occasion at a fraction of the purchase price.</p>
            <p style={{ color:"#A0A0A0",lineHeight:1.8,marginBottom:28 }}>Our digital platform eliminates the hassle of traditional store rentals, offering real-time availability tracking, size selection, flexible rental dates, and secure online payments.</p>
            <div className="row g-3 mb-4">
              {[{n:"500+",l:"Outfits"},{n:"1000+",l:"Happy Customers"},{n:"50+",l:"Categories"},{n:"4.8★",l:"Avg Rating"}].map(s=>(
                <div key={s.l} className="col-6"><div style={{ background:"rgba(227,226,49,.06)",border:"1px solid rgba(227,226,49,.15)",borderRadius:10,padding:"16px",textAlign:"center" }}><h3 style={{ color:"var(--primary-color)",fontWeight:900,fontFamily:"Outfit, sans-serif",marginBottom:2 }}>{s.n}</h3><p style={{ color:"#595959",fontSize:12,margin:0 }}>{s.l}</p></div></div>
              ))}
            </div>
            <Link to="/collections" className="primary-btn">Browse Collections →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
