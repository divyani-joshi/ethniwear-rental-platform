import React, { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { getItemDetails, placeOrder, myOrders, genOrderId, verifyPayment } from "../services/api"

// const BACKEND = "http://localhost:8000"
const BACKEND = import.meta.env.VITE_API_URL;
const RAZORPAY_KEY = "rzp_test_VQhEfe2NCXbbwI"

export default function ItemDetail({ isAuthenticated }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  const [rentDate, setRentDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    getItemDetails(id)
      .then(r => { setItem(r.data.data); setInventory(r.data.data.inventory || []) })
      .catch(() => { toast.error("Item not found!"); navigate("/collections") })
      .finally(() => setLoading(false))
  }, [id])

  const rentalDays = rentDate && returnDate
    ? Math.max(1, Math.ceil((new Date(returnDate) - new Date(rentDate)) / (1000 * 60 * 60 * 24)))
    : 0

  const totalCost = item && rentalDays ? item.price * rentalDays : 0

  const handleBook = async () => {
    if (!isAuthenticated) { toast.error("Please login to rent this outfit"); navigate("/login"); return }
    if (!selectedSize) { toast.error("Please select a size"); return }
    if (!rentDate) { toast.error("Please select a rental start date"); return }
    if (!returnDate) { toast.error("Please select a return date"); return }
    if (new Date(returnDate) <= new Date(rentDate)) { toast.error("Return date must be after rental date"); return }

    const inv = inventory.find(i => i.size_id?.toString() === selectedSize._id?.toString() || i.size?._id?.toString() === selectedSize._id?.toString())
    if (!inv || inv.available <= 0) { toast.error("Selected size is not available"); return }

    setBooking(true)
    try {
      const r = await placeOrder({ item_id: id, size_id: selectedSize._id, rent_date: rentDate, return_date: returnDate })
      if (!r.data.success) { toast.error(r.data.message); return }

      toast.success("Order placed! Initiating payment...")
      const ordersRes = await myOrders()
      const latest = (ordersRes.data.data || []).find(o =>
        o.item_id?.toString() === id && o.payment_status === "Pending" && o.status === "Rented"
      )
      if (!latest) { toast.success("Order placed! Go to My Orders to pay."); navigate("/my-orders"); return }
      await initiatePayment(latest._id, totalCost)
    } catch (err) { toast.error(err.response?.data?.message || "Booking failed!") }
    finally { setBooking(false) }
  }

  const initiatePayment = async (order_id, amount) => {
    try {
      const oRes = await genOrderId({ order_id })
      if (!oRes.data.success) { toast.error(oRes.data.message); return }
      const { order_id: rzpOrderId, amount: rzpAmount, rental_order_id } = oRes.data.data

      const options = {
        key: RAZORPAY_KEY,
        amount: rzpAmount, currency: "INR",
        name: "EthniWear",
        description: `${item?.name} – ${rentalDays} day(s) rental`,
        order_id: rzpOrderId,
        handler: async (response) => {
          try {
            const vRes = await verifyPayment({
              order_id: rental_order_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
            if (vRes.data.success) { toast.success("Payment successful! Enjoy your outfit! 👘"); navigate("/my-orders") }
          } catch { toast.error("Payment verification failed. Contact support.") }
        },
        prefill: {},
        theme: { color: "#E3E231" },
        modal: { ondismiss: () => { toast.info("Payment cancelled. Go to My Orders to pay later."); navigate("/my-orders") } }
      }
      if (!window.Razorpay) {
        const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js"
        document.body.appendChild(s); await new Promise(r => s.onload = r)
      }
      new window.Razorpay(options).open()
    } catch { toast.error("Payment initiation failed. Your order is saved — pay from My Orders."); navigate("/my-orders") }
  }

  if (loading) return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#121212" }}>
      <div style={{ width: 48, height: 48, border: "3px solid rgba(227,226,49,.2)", borderTopColor: "#E3E231", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
  if (!item) return null

  const today = new Date().toISOString().split("T")[0]

  return (
    <div style={{ background: "#121212", minHeight: "80vh" }}>
      <div style={{ background: "#0d0d0d", borderBottom: "1px solid rgba(227,226,49,.1)", padding: "28px 0" }}>
        <div className="container">
          <p style={{ color: "#595959", fontSize: 13, margin: 0 }}>
            <Link to="/" style={{ color: "#595959", textDecoration: "none" }}>Home</Link>
            {" › "}<Link to="/collections" style={{ color: "#595959", textDecoration: "none" }}>Collections</Link>
            {" › "}<span style={{ color: "var(--primary-color)" }}>{item.name}</span>
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: "60px 0" }}>
        <div className="row g-5">
          {/* Left: Image */}
          <div className="col-lg-5">
            <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(227,226,49,.15)", position: "sticky", top: 90 }}>
              {item.image ? (
                <img src={`${BACKEND}${item.image}`} alt={item.name} style={{ width: "100%", maxHeight: 520, objectFit: "cover" }}
                  onError={e => e.target.style.display = "none"} />
              ) : (
                <div style={{ height: 420, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, background: "#1a1a1a" }}>👘</div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="col-lg-7">
            <div>
              <span style={{ background: "var(--primary-color)", color: "#121212", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 3, letterSpacing: 1, textTransform: "uppercase" }}>
                {item.category?.name || "Ethnic Wear"}
              </span>
              <h1 style={{ color: "#fff", fontFamily: "Outfit, sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem,3vw,2.4rem)", margin: "14px 0 10px" }}>{item.name}</h1>

              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
                <span style={{ color: "var(--primary-color)", fontWeight: 900, fontSize: 32, fontFamily: "Outfit, sans-serif" }}>₹{item.price}</span>
                <span style={{ color: "#595959", fontSize: 15 }}>per day</span>
                <span style={{ background: item.status === "Available" ? "rgba(34,197,94,.15)" : "rgba(239,68,68,.15)", color: item.status === "Available" ? "#22c55e" : "#ef4444", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 3, marginLeft: 8 }}>
                  {item.status}
                </span>
              </div>

              <p style={{ color: "#A0A0A0", fontSize: 15, lineHeight: 1.8, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                {item.description}
              </p>

              {/* Size Selection */}
              {inventory.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h6 style={{ color: "#fff", fontWeight: 700, marginBottom: 12, fontSize: 14, textTransform: "uppercase", letterSpacing: 1 }}>
                    Select Size
                    {selectedSize && <span style={{ color: "var(--primary-color)", marginLeft: 8, textTransform: "none", letterSpacing: 0 }}>— {selectedSize.size}</span>}
                  </h6>
                  <div className="size-list d-flex flex-wrap gap-2">
                    {inventory.map(inv => {
                      const avail = inv.available > 0
                      const isSelected = selectedSize?._id === inv.size?._id
                      return (
                        <button key={inv._id}
                          onClick={() => avail && setSelectedSize(inv.size)}
                          style={{
                            padding: "8px 18px", borderRadius: 6, fontWeight: 700, fontSize: 13,
                            border: isSelected ? "2px solid var(--primary-color)" : "1px solid rgba(255,255,255,.15)",
                            background: isSelected ? "rgba(227,226,49,.15)" : "transparent",
                            color: isSelected ? "var(--primary-color)" : avail ? "#fff" : "#444",
                            cursor: avail ? "pointer" : "not-allowed",
                            textDecoration: !avail ? "line-through" : "none",
                            position: "relative"
                          }}>
                          {inv.size?.size}
                          {avail && <span style={{ position: "absolute", top: -6, right: -6, background: "var(--primary-color)", color: "#121212", fontSize: 9, fontWeight: 800, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{inv.available}</span>}
                        </button>
                      )
                    })}
                  </div>
                  <p style={{ color: "#595959", fontSize: 12, marginTop: 8 }}>Numbers show available quantity</p>
                </div>
              )}

              {/* Date Selection */}
              <div style={{ marginBottom: 24 }}>
                <h6 style={{ color: "#fff", fontWeight: 700, marginBottom: 12, fontSize: 14, textTransform: "uppercase", letterSpacing: 1 }}>Rental Dates</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label style={{ color: "#A0A0A0", fontSize: 12, marginBottom: 6, display: "block" }}>Rental Start Date *</label>
                    <input type="date" value={rentDate} min={today}
                      onChange={e => { setRentDate(e.target.value); if (returnDate && e.target.value >= returnDate) setReturnDate("") }}
                      style={{ width: "100%", padding: "11px 14px", background: "#1a1a1a", border: "1px solid rgba(255,255,255,.12)", borderRadius: 6, color: "#fff", fontSize: 14, outline: "none", colorScheme: "dark" }} />
                  </div>
                  <div className="col-md-6">
                    <label style={{ color: "#A0A0A0", fontSize: 12, marginBottom: 6, display: "block" }}>Return Date *</label>
                    <input type="date" value={returnDate} min={rentDate || today}
                      onChange={e => setReturnDate(e.target.value)}
                      style={{ width: "100%", padding: "11px 14px", background: "#1a1a1a", border: "1px solid rgba(255,255,255,.12)", borderRadius: 6, color: "#fff", fontSize: 14, outline: "none", colorScheme: "dark" }} />
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              {rentalDays > 0 && (
                <div style={{ background: "rgba(227,226,49,.06)", border: "1px solid rgba(227,226,49,.2)", borderRadius: 10, padding: "18px 20px", marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: "#A0A0A0", fontSize: 14 }}>₹{item.price} × {rentalDays} day{rentalDays > 1 ? "s" : ""}</span>
                    <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>₹{totalCost}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: "#A0A0A0", fontSize: 14 }}>Security Deposit (50%)</span>
                    <span style={{ color: "#fff", fontSize: 14 }}>₹{Math.round(totalCost * 0.5)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: "#A0A0A0", fontSize: 14 }}>Rental Amount (50%)</span>
                    <span style={{ color: "#fff", fontSize: 14 }}>₹{totalCost - Math.round(totalCost * 0.5)}</span>
                  </div>
                  <hr style={{ borderColor: "rgba(227,226,49,.2)", margin: "10px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Total Amount</span>
                    <span style={{ color: "var(--primary-color)", fontWeight: 900, fontSize: 24, fontFamily: "Outfit, sans-serif" }}>₹{totalCost}</span>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <div className="d-flex gap-3 flex-wrap">
                {item.status === "Available" ? (
                  <button className="primary-btn" style={{ flex: 1, padding: "14px 24px", fontSize: 15, opacity: booking ? .7 : 1, cursor: booking ? "not-allowed" : "pointer" }}
                    onClick={handleBook} disabled={booking}>
                    {booking ? "Processing..." : isAuthenticated ? "👘 Rent Now & Pay" : "Login to Rent"}
                  </button>
                ) : (
                  <div style={{ flex: 1, padding: "14px 24px", background: "rgba(255,255,255,.05)", borderRadius: 6, textAlign: "center", color: "#595959", fontWeight: 600 }}>
                    Currently Unavailable
                  </div>
                )}
              </div>

              {!isAuthenticated && (
                <p style={{ color: "#595959", fontSize: 13, marginTop: 12 }}>
                  <Link to="/login" style={{ color: "var(--primary-color)" }}>Login</Link> or <Link to="/register" style={{ color: "var(--primary-color)" }}>Register</Link> to place rental orders
                </p>
              )}

              {/* Features */}
              <div style={{ display: "flex", gap: 20, marginTop: 24, flexWrap: "wrap" }}>
                {["🔒 Secure Payment", "📦 Easy Return", "✨ Dry Cleaned"].map(f => (
                  <span key={f} style={{ color: "#595959", fontSize: 13 }}>{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
