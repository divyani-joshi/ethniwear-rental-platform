import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getCategories, getItems, getFeedbacks } from "../services/api"

const BACKEND = import.meta.env.VITE_API_URL;
// const BACKEND = "http://localhost:8000"

const Loader = () => (
  <div style={{ textAlign: "center", padding: "60px 0" }}>
    <div style={{ width: 36, height: 36, border: "3px solid rgba(227,226,49,.2)", borderTopColor: "#E3E231", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto" }} />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
)

export default function Home() {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeBanner, setActiveBanner] = useState(0)

  useEffect(() => {
    Promise.all([getCategories(), getItems(), getFeedbacks()])
      .then(([cR, iR, fR]) => {
        setCategories(cR.data.data || [])
        setItems((iR.data.data || []).slice(0, 8))
        setFeedbacks((fR.data.data || []).slice(0, 6))
      }).catch(console.error).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const t = setInterval(() => setActiveBanner(b => (b + 1) % 3), 4000)
    return () => clearInterval(t)
  }, [])

  const banners = [
    { title: "Rent Ethnic Wear", sub: "for Every Occasion", tag: "BRIDAL & WEDDING COLLECTION", bg: "linear-gradient(135deg,rgba(0,0,0,.65),rgba(0,0,0,.4)), url(/assets/image/home1/banner-backgraound.jpg)" },
    { title: "Traditional Outfits", sub: "at Affordable Prices", tag: "FESTIVAL SPECIAL", bg: "linear-gradient(135deg,rgba(0,0,0,.65),rgba(0,0,0,.4)), url(/assets/image/home1/banner-backgraound2.jpg)" },
    { title: "Premium Lehengas", sub: "for Your Big Day", tag: "NEW ARRIVALS", bg: "linear-gradient(135deg,rgba(0,0,0,.65),rgba(0,0,0,.4)), url(/assets/image/home1/banner-backgraound3.jpg)" },
  ]

  return (
    <div>
      {/* ── HERO BANNER ── */}
      <section className="home1-banner-section" style={{ position: "relative", overflow: "hidden" }}>
        <div className="banner-wrapper" style={{
          backgroundImage: banners[activeBanner].bg,
          backgroundSize: "cover", backgroundPosition: "center",
          minHeight: "92vh", display: "flex", alignItems: "center",
          transition: "background-image .8s ease"
        }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <div className="banner-content">
                  <p style={{ color: "var(--primary-color)", fontSize: 13, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
                    {banners[activeBanner].tag}
                  </p>
                  <h1 style={{ color: "#fff", fontFamily: "Outfit, sans-serif", fontWeight: 900, fontSize: "clamp(2.2rem,6vw,4.5rem)", lineHeight: 1.1, marginBottom: 8 }}>
                    {banners[activeBanner].title}
                  </h1>
                  <h2 style={{ color: "var(--primary-color)", fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "clamp(1.4rem,4vw,2.8rem)", marginBottom: 32 }}>
                    {banners[activeBanner].sub}
                  </h2>
                  <div className="banner-button d-flex gap-3 justify-content-center flex-wrap">
                    <Link to="/collections" className="primary-btn" style={{ padding: "14px 36px", fontSize: 14, letterSpacing: 1 }}>
                      Browse Collection
                    </Link>
                    <Link to="/register" className="primary-btn2" style={{ padding: "14px 36px", fontSize: 14, letterSpacing: 1, background: "transparent", border: "2px solid rgba(255,255,255,.4)", color: "#fff" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary-color)"; e.currentTarget.style.color = "var(--primary-color)" }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.4)"; e.currentTarget.style.color = "#fff" }}>
                      Get Started Free
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Dots */}
          <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
            {banners.map((_, i) => (
              <button key={i} onClick={() => setActiveBanner(i)}
                style={{ width: i === activeBanner ? 28 : 8, height: 8, borderRadius: 4, border: "none", background: i === activeBanner ? "var(--primary-color)" : "rgba(255,255,255,.4)", transition: "all .3s", cursor: "pointer" }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ background: "#121212", padding: "80px 0" }}>
        <div className="container">
          <div className="text-center mb-5">
            <p style={{ color: "var(--primary-color)", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Browse By</p>
            <h2 style={{ color: "#fff", fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem,3vw,2.4rem)" }}>
              Shop by <span style={{ color: "var(--primary-color)" }}>Category</span>
            </h2>
          </div>
          {loading ? <Loader /> : categories.length === 0 ? (
            <p style={{ textAlign: "center", color: "#595959" }}>No categories yet</p>
          ) : (
            <div className="row g-4">
              {categories.map((c, i) => (
                <div key={c._id} className="col-lg-3 col-md-4 col-6">
                  <Link to={`/collections?category_id=${c._id}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      position: "relative", borderRadius: 12, overflow: "hidden", aspectRatio: "3/4",
                      border: "1px solid rgba(227,226,49,.1)", transition: "all .3s",
                      background: "#1a1a1a"
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary-color)"; e.currentTarget.style.transform = "translateY(-6px)" }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(227,226,49,.1)"; e.currentTarget.style.transform = "none" }}>
                      {c.category ? (
                        <img src={`${BACKEND}${c.category}`} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={e => { e.target.style.display = "none" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, background: `hsl(${i * 40},25%,15%)` }}>👘</div>
                      )}
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.85) 0%, transparent 60%)" }} />
                      <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                        <h5 style={{ color: "#fff", fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{c.name}</h5>
                        <span style={{ color: "var(--primary-color)", fontSize: 12, fontWeight: 600 }}>Shop Now →</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: "#0d0d0d", padding: "80px 0" }}>
        <div className="container">
          <div className="text-center mb-5">
            <p style={{ color: "var(--primary-color)", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Simple & Easy</p>
            <h2 style={{ color: "#fff", fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem,3vw,2.4rem)" }}>
              How <span style={{ color: "var(--primary-color)" }}>It Works</span>
            </h2>
          </div>
          <div className="row g-4">
            {[
              { icon: "bi-search", step: "01", title: "Browse & Select", desc: "Explore hundreds of ethnic outfits by category, size, and price. Find your perfect look." },
              { icon: "bi-calendar-check", step: "02", title: "Choose Your Dates", desc: "Pick your rental start date and return date. See the total rental cost instantly." },
              { icon: "bi-credit-card", step: "03", title: "Pay Securely", desc: "Complete payment via Razorpay. 50% deposit + 50% rental — fully secure." },
              { icon: "bi-bag-heart", step: "04", title: "Wear & Return", desc: "Enjoy your outfit for the event and return it by the scheduled date." },
            ].map((s, i) => (
              <div key={i} className="col-lg-3 col-md-6">
                <div style={{ textAlign: "center", padding: "32px 20px", background: "#1a1a1a", borderRadius: 12, border: "1px solid rgba(255,255,255,.05)", height: "100%", transition: "border-color .3s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(227,226,49,.3)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,.05)"}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(227,226,49,.1)", border: "2px solid rgba(227,226,49,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <i className={`bi ${s.icon}`} style={{ color: "var(--primary-color)", fontSize: 26 }} />
                  </div>
                  <span style={{ color: "var(--primary-color)", fontSize: 11, letterSpacing: 2, fontWeight: 700 }}>STEP {s.step}</span>
                  <h5 style={{ color: "#fff", fontWeight: 700, margin: "10px 0 10px", fontFamily: "Outfit, sans-serif" }}>{s.title}</h5>
                  <p style={{ color: "#595959", fontSize: 14, margin: 0, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ITEMS ── */}
      {items.length > 0 && (
        <section style={{ background: "#121212", padding: "80px 0" }}>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
              <div>
                <p style={{ color: "var(--primary-color)", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>New Arrivals</p>
                <h2 style={{ color: "#fff", fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem,3vw,2.2rem)", margin: 0 }}>
                  Featured <span style={{ color: "var(--primary-color)" }}>Collections</span>
                </h2>
              </div>
              <Link to="/collections" className="primary-btn" style={{ padding: "10px 24px", fontSize: 13 }}>View All</Link>
            </div>
            <div className="row g-4">
              {items.map(item => (
                <div key={item._id} className="col-lg-3 col-md-4 col-sm-6">
                  <div className="product-card" style={{ background: "#1a1a1a", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,.05)", transition: "all .3s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(227,226,49,.25)"; e.currentTarget.style.transform = "translateY(-4px)" }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.05)"; e.currentTarget.style.transform = "none" }}>
                    <div className="product-card-img" style={{ position: "relative", overflow: "hidden", height: 280 }}>
                      {item.image ? (
                        <img src={`${BACKEND}${item.image}`} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s" }}
                          onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
                          onMouseLeave={e => e.target.style.transform = "scale(1)"}
                          onError={e => { e.target.style.display = "none" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, background: "#222" }}>👘</div>
                      )}
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.6) 0%,transparent 50%)", zIndex: 1 }} />
                      <span style={{ position: "absolute", top: 12, left: 12, zIndex: 2, background: "var(--primary-color)", color: "#121212", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 3, letterSpacing: 0.5 }}>
                        {item.category?.name || "Ethnic"}
                      </span>
                    </div>
                    <div className="product-card-content" style={{ padding: "16px 18px 20px" }}>
                      <h5 style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 6, fontFamily: "Outfit, sans-serif" }}>{item.name}</h5>
                      <p style={{ color: "#595959", fontSize: 13, marginBottom: 14, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {item.description}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "var(--primary-color)", fontWeight: 800, fontSize: 18, fontFamily: "Outfit, sans-serif" }}>
                          ₹{item.price}<span style={{ fontSize: 12, color: "#595959", fontWeight: 400 }}>/day</span>
                        </span>
                        <Link to={`/item/${item._id}`} className="primary-btn" style={{ padding: "7px 16px", fontSize: 12 }}>Rent Now</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section style={{ background: "#0d0d0d", padding: "80px 0" }}>
        <div className="container">
          <div style={{ background: "linear-gradient(135deg,rgba(227,226,49,.08),rgba(227,226,49,.03))", border: "1px solid rgba(227,226,49,.2)", borderRadius: 20, padding: "64px 40px", textAlign: "center" }}>
            <p style={{ color: "var(--primary-color)", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Special Offer</p>
            <h2 style={{ color: "#fff", fontFamily: "Outfit, sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem,3vw,2.8rem)", marginBottom: 12 }}>
              Save More, Look More <span style={{ color: "var(--primary-color)" }}>Beautiful</span>
            </h2>
            <p style={{ color: "#595959", fontSize: 15, marginBottom: 32, maxWidth: 520, margin: "0 auto 32px" }}>
              Rent premium ethnic wear at a fraction of the purchase price. Perfect for weddings, festivals, and special occasions.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/collections" className="primary-btn" style={{ padding: "14px 36px", fontSize: 14 }}>Browse Collection</Link>
              <Link to="/register" className="primary-btn2" style={{ padding: "14px 36px", fontSize: 14 }}>Register Free</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEEDBACKS ── */}
      {feedbacks.length > 0 && (
        <section style={{ background: "#121212", padding: "80px 0" }}>
          <div className="container">
            <div className="text-center mb-5">
              <p style={{ color: "var(--primary-color)", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Happy Customers</p>
              <h2 style={{ color: "#fff", fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem,3vw,2.4rem)" }}>
                What Our <span style={{ color: "var(--primary-color)" }}>Customers Say</span>
              </h2>
            </div>
            <div className="row g-4">
              {feedbacks.map((f, i) => (
                <div key={f._id || i} className="col-lg-4 col-md-6">
                  <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, padding: 24, height: "100%" }}>
                    <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                      {[1,2,3,4,5].map(s => <i key={s} className="bi bi-star-fill" style={{ color: s <= f.rating ? "var(--primary-color)" : "rgba(255,255,255,.15)", fontSize: 14 }} />)}
                    </div>
                    <p style={{ color: "#A0A0A0", fontSize: 14, fontStyle: "italic", lineHeight: 1.7, marginBottom: 16 }}>"{f.feedback}"</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--primary-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "#121212", fontWeight: 800, fontSize: 15, fontFamily: "Outfit, sans-serif" }}>
                        {f.user?.name?.charAt(0)?.toUpperCase() || "C"}
                      </div>
                      <div>
                        <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: 0 }}>{f.user?.name || "Customer"}</p>
                        <p style={{ color: "var(--primary-color)", fontSize: 12, margin: 0 }}>{f.rating}/5 Rating</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-5">
              <Link to="/feedbacks" className="primary-btn">View All Reviews</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
