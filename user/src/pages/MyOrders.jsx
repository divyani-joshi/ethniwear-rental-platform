import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { myOrders, cancelOrder, genOrderId, verifyPayment, addFeedback, generatePenaltyOrder, verifyPenaltyPayment } from "../services/api"

const BACKEND = "http://localhost:8000"
const RAZORPAY_KEY = "rzp_test_VQhEfe2NCXbbwI"

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelModal, setCancelModal] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  const [feedbackModal, setFeedbackModal] = useState(null)
  const [fbForm, setFbForm] = useState({ rating: 5, feedback: "" })
  const [submitting, setSubmitting] = useState(false)
  const [paying, setPaying] = useState(null)

  const fetch = async () => {
    setLoading(true)
    try { const r = await myOrders(); setOrders(r.data.data || []) }
    catch { toast.error("Failed to load orders") }
    finally { setLoading(false) }
  }
  useEffect(() => { fetch() }, [])

  const handleCancel = async () => {
    setCancelling(true)
    try {
      const r = await cancelOrder({ order_id: cancelModal._id })
      if (r.data.success) { toast.success("Order cancelled!"); setCancelModal(null); fetch() }
    } catch (err) { toast.error(err.response?.data?.message || "Cancel failed!") }
    finally { setCancelling(false) }
  }

  const handlePay = async (order) => {
    setPaying(order._id)
    try {
      const oRes = await genOrderId({ order_id: order._id })
      if (!oRes.data.success) { toast.error(oRes.data.message); return }
      const { order_id: rzpId, amount, rental_order_id } = oRes.data.data
      const options = {
        key: RAZORPAY_KEY, amount, currency: "INR",
        name: "EthniWear", description: `${order.item?.name} – ${order.rental_days} day(s)`,
        order_id: rzpId,
        handler: async (response) => {
          try {
            const vRes = await verifyPayment({ order_id: rental_order_id, razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature })
            if (vRes.data.success) { toast.success("Payment successful! 👘"); fetch() }
          } catch { toast.error("Payment verification failed.") }
        },
        theme: { color: "#E3E231" }
      }
      if (!window.Razorpay) {
        const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js"
        document.body.appendChild(s); await new Promise(r => s.onload = r)
      }
      new window.Razorpay(options).open()
    } catch { toast.error("Payment failed") }
    finally { setPaying(null) }
  }
const handleReturnRequest = async (orderId) => {

  try {

    const token =
      localStorage.getItem("ew_user_token")

    const response = await axios.post(

      "http://localhost:8000/user/requestReturn",

      {
        order_id: orderId
      },

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    )

    toast.success(response.data.message)

    fetch()

  } catch (error) {

    console.log("RETURN ERROR =>", error)

    toast.error(
      error.response?.data?.message ||
      "Return request failed"
    )

  }

}

const handlePenaltyPayment = async (order) => {

  try {

    const response = await generatePenaltyOrder({
      order_id: order._id
    });

    const data = response.data.data;

    const options = {

      key: RAZORPAY_KEY,

      amount: data.amount,

      currency: "INR",

      name: "EthniWear",

      description: "Late Return Penalty",

      order_id: data.order_id,

      handler: async function (payment) {

        try {

          const verify = await verifyPenaltyPayment({

            order_id: order._id,

            razorpay_order_id:
              payment.razorpay_order_id,

            razorpay_payment_id:
              payment.razorpay_payment_id,

            razorpay_signature:
              payment.razorpay_signature

          });

          if (verify.data.success) {

            toast.success(
              "Penalty paid successfully"
            );

            fetch();
          }

        } catch (error) {

          toast.error(
            "Penalty verification failed"
          );

        }

      },

      theme: {
        color: "#E3E231"
      }

    };
if (!window.Razorpay) {

  const script = document.createElement("script");

  script.src =
    "https://checkout.razorpay.com/v1/checkout.js";

  document.body.appendChild(script);

  await new Promise(resolve => {
    script.onload = resolve;
  });

}
    const razor = new window.Razorpay(options);

    razor.open();

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Penalty payment failed"
    );

  }

};

  const handleFeedback = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      const r = await addFeedback({ order_id: feedbackModal._id, rating: fbForm.rating, feedback: fbForm.feedback })
      if (r.data.success) { toast.success("Review submitted! Thank you!"); setFeedbackModal(null); setFbForm({ rating: 5, feedback: "" }) }
    } catch (err) { toast.error(err.response?.data?.message || "Failed!") }
    finally { setSubmitting(false) }
  }

const statusColor = {
  Rented: "#22c55e",
  "Return Requested": "#f59e0b",
  Returned: "#3b82f6",
  Late: "#ef4444",
  Cancelled: "#ef4444"
}  
const payColor = { Success: "#22c55e", Pending: "#f59e0b", Failed: "#ef4444" }

  return (
    <div style={{ background: "#121212", minHeight: "80vh" }}>
      <div style={{ background: "#0d0d0d", borderBottom: "1px solid rgba(227,226,49,.1)", padding: "36px 0" }}>
        <div className="container">
          <h1 style={{ color: "#fff", fontFamily: "Outfit, sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem,3vw,2.4rem)", marginBottom: 6 }}>My Orders</h1>
          <p style={{ color: "#595959", fontSize: 13, margin: 0 }}>
            <Link to="/" style={{ color: "#595959", textDecoration: "none" }}>Home</Link> › <span style={{ color: "var(--primary-color)" }}>My Orders</span>
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: "48px 0" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ width: 40, height: 40, border: "3px solid rgba(227,226,49,.2)", borderTopColor: "#E3E231", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 12px" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>👜</div>
            <h4 style={{ color: "#fff", marginBottom: 8 }}>No orders yet</h4>
            <p style={{ color: "#595959", marginBottom: 24 }}>Start by exploring our ethnic clothing collection!</p>
            <Link to="/collections" className="primary-btn">Browse Collections</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {orders.map(o => (
              <div key={o._id} style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,.06)", borderRadius: 14, padding: 24, transition: "border-color .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(227,226,49,.2)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,.06)"}>
                <div className="row g-4 align-items-start">
                  {/* Item image */}
                  <div className="col-md-2 col-4">
                    <div style={{ borderRadius: 8, overflow: "hidden", height: 100 }}>
                      {o.item?.image ? (
                        <img src={`${BACKEND}${o.item.image}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                      ) : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, background: "#222" }}>👘</div>}
                    </div>
                  </div>
                  {/* Details */}
                  <div className="col-md-5">
                    <h5 style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{o.item?.name || "Outfit"}</h5>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ color: "#A0A0A0", fontSize: 13 }}><i className="bi bi-tag me-1" />{o.category?.name || "—"}</span>
                      <span style={{ color: "#A0A0A0", fontSize: 13 }}><i className="bi bi-rulers me-1" />Size: <strong style={{ color: "var(--primary-color)" }}>{o.size?.size || "—"}</strong></span>
                      <span style={{ color: "#A0A0A0", fontSize: 13 }}><i className="bi bi-calendar me-1" />{o.rent_date ? new Date(o.rent_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"} → {o.return_date ? new Date(o.return_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</span>
                      <span style={{ color: "#A0A0A0", fontSize: 13 }}><i className="bi bi-clock me-1" />{o.rental_days} day{o.rental_days > 1 ? "s" : ""} × ₹{o.item?.price}/day</span>
                    </div>
                  </div>
                  {/* Status + Actions */}
                  <div className="col-md-5">
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ background: `${statusColor[o.status] || "#595959"}18`, color: statusColor[o.status] || "#595959", border: `1px solid ${statusColor[o.status] || "#595959"}30`, borderRadius: 4, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
                          {o.status}
                        </span>
                        <span style={{ background: `${payColor[o.payment_status] || "#595959"}18`, color: payColor[o.payment_status] || "#595959", border: `1px solid ${payColor[o.payment_status] || "#595959"}30`, borderRadius: 4, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
                          ₹{o.total_amount} · {o.payment_status || "Pending"}
                        </span>
                      </div>
                      <div
  style={{
    marginTop: 14,
    padding: "14px 16px",
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 10
  }}
>

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 10
    }}
  >

    {/* ORDER CONFIRMED */}
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: "#22c55e"
      }} />
      <span style={{ color: "#d1d5db", fontSize: 13 }}>
        ✔ Order Confirmed
      </span>
    </div>

    {/* PAYMENT */}
    {o.payment_status === "Success" && (

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#22c55e"
        }} />
        <span style={{ color: "#d1d5db", fontSize: 13 }}>
          ✔ Payment Successful
        </span>
      </div>

    )}

    {/* OUTFIT PACKED */}
    {(o.status === "Rented" ||
      o.status === "Late" ||
      o.status === "Return Requested" ||
      o.status === "Returned") && (

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#3b82f6"
        }} />
        <span style={{ color: "#d1d5db", fontSize: 13 }}>
          ✔ Outfit Packed
        </span>
      </div>

    )}

    {/* DELIVERED */}
    {(o.status === "Rented" ||
      o.status === "Late" ||
      o.status === "Return Requested" ||
      o.status === "Returned") && (

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#3b82f6"
        }} />
        <span style={{ color: "#d1d5db", fontSize: 13 }}>
          ✔ Delivered
        </span>
      </div>

    )}

    {/* RENTAL ACTIVE */}
    {(o.status === "Rented" ||
      o.status === "Late") && (

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#f59e0b"
        }} />
        <span style={{ color: "#f59e0b", fontSize: 13 }}>
          ⏳ Rental Active
        </span>
      </div>

    )}

    {/* RETURN REQUESTED */}
    {o.status === "Return Requested" && (

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#f59e0b"
        }} />
        <span style={{ color: "#f59e0b", fontSize: 13 }}>
          ↩ Return Requested
        </span>
      </div>

    )}

    {/* LATE */}
    {o.status === "Late" && (

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#ef4444"
        }} />
        <span style={{ color: "#ef4444", fontSize: 13 }}>
          ⚠ Late Return
        </span>
      </div>

    )}

    {/* PENALTY */}
    {o.penalty_amount > 0 && (

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background:
            o.penalty_status === "Paid"
              ? "#22c55e"
              : "#ef4444"
        }} />

        <span
          style={{
            color:
              o.penalty_status === "Paid"
                ? "#22c55e"
                : "#ef4444",
            fontSize: 13
          }}
        >
          {o.penalty_status === "Paid"
            ? `✔ Penalty Paid ₹${o.penalty_amount}`
            : `💳 Penalty Pending ₹${o.penalty_amount}`}
        </span>

      </div>

    )}

    {/* RETURNED */}
    {o.status === "Returned" && (

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#22c55e"
        }} />
        <span style={{ color: "#22c55e", fontSize: 13 }}>
          ✔ Outfit Returned Successfully
        </span>
      </div>

    )}

  </div>

</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                        {o.status === "Rented" && o.payment_status !== "Success" && (
                          <button className="primary-btn" style={{ padding: "7px 14px", fontSize: 12, opacity: paying === o._id ? .7 : 1 }}
                            onClick={() => handlePay(o)} disabled={paying === o._id}>
                            {paying === o._id ? "..." : "💳 Pay Now"}
                          </button>
                        )}
                        {(o.status === "Rented" || o.status === "Pending") && (
                          <button onClick={() => setCancelModal(o)}
                            style={{ padding: "7px 14px", fontSize: 12, background: "rgba(239,68,68,.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,.3)", borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>
                            ✕ Cancel
                          </button>
                        )}
                      {o.status === "Rented" && (
  <button
    onClick={() => handleReturnRequest(o._id)}
    style={{
      padding: "7px 14px",
      fontSize: 12,
      background: "rgba(59,130,246,.1)",
      color: "#3b82f6",
      border: "1px solid rgba(59,130,246,.3)",
      borderRadius: 4,
      cursor: "pointer",
      fontWeight: 600
    }}
  >
    ↩ Request Return
  </button>
)}

{o.status === "Return Requested" && (
  <button
    disabled
    style={{
      padding: "7px 14px",
      fontSize: 12,
      background: "rgba(245,158,11,.1)",
      color: "#f59e0b",
      border: "1px solid rgba(245,158,11,.3)",
      borderRadius: 4,
      fontWeight: 600,
      cursor: "not-allowed"
    }}
  >
    ⏳ Return Requested
  </button>
)}

{o.status === "Returned" && (
  <button
    disabled
    style={{
      padding: "7px 14px",
      fontSize: 12,
      background: "rgba(34,197,94,.1)",
      color: "#22c55e",
      border: "1px solid rgba(34,197,94,.3)",
      borderRadius: 4,
      fontWeight: 600,
      cursor: "not-allowed"
    }}
  >
    ✔ Returned
  </button>
)}
{o.penalty_amount > 0 &&
 o.penalty_status !== "Paid" && (

  <button
    onClick={() => handlePenaltyPayment(o)}
    style={{
      padding: "7px 14px",
      fontSize: 12,
      background: "rgba(239,68,68,.1)",
      color: "#ef4444",
      border: "1px solid rgba(239,68,68,.3)",
      borderRadius: 4,
      cursor: "pointer",
      fontWeight: 600
    }}
  >
    💳 Pay Penalty ₹{o.penalty_amount}
  </button>

)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {cancelModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#1a1a1a", border: "1px solid rgba(239,68,68,.3)", borderRadius: 14, padding: 32, maxWidth: 400, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h4 style={{ color: "#fff", marginBottom: 8 }}>Cancel Order?</h4>
            <p style={{ color: "#A0A0A0", fontSize: 14, marginBottom: 24 }}>Your reserved size will be released. This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setCancelModal(null)} style={{ flex: 1, padding: 12, background: "rgba(255,255,255,.06)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Keep Order</button>
              <button onClick={handleCancel} disabled={cancelling} style={{ flex: 1, padding: 12, background: "rgba(239,68,68,.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,.3)", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#1a1a1a", border: "1px solid rgba(227,226,49,.2)", borderRadius: 14, padding: 32, maxWidth: 460, width: "100%" }}>
            <h4 style={{ color: "#fff", fontWeight: 700, marginBottom: 4 }}>Leave a Review</h4>
            <p style={{ color: "#A0A0A0", fontSize: 13, marginBottom: 24 }}>How was your experience with <strong style={{ color: "var(--primary-color)" }}>{feedbackModal.item?.name}</strong>?</p>
            <form onSubmit={handleFeedback}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: "#A0A0A0", fontSize: 13, marginBottom: 8, display: "block" }}>Rating *</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setFbForm(f => ({ ...f, rating: s }))}
                      style={{ width: 44, height: 44, borderRadius: 6, border: s <= fbForm.rating ? "2px solid var(--primary-color)" : "1px solid rgba(255,255,255,.12)", background: s <= fbForm.rating ? "rgba(227,226,49,.12)" : "transparent", color: s <= fbForm.rating ? "var(--primary-color)" : "#A0A0A0", fontSize: 20, cursor: "pointer" }}>★</button>
                  ))}
                  <span style={{ color: "var(--primary-color)", fontWeight: 700, fontSize: 16, alignSelf: "center", marginLeft: 8 }}>{fbForm.rating}/5</span>
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ color: "#A0A0A0", fontSize: 13, marginBottom: 8, display: "block" }}>Your Feedback *</label>
                <textarea rows={4} placeholder="Share your experience..." value={fbForm.feedback} onChange={e => setFbForm(f => ({ ...f, feedback: e.target.value }))} required
                  style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, color: "#fff", fontSize: 14, resize: "vertical", outline: "none" }} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" onClick={() => setFeedbackModal(null)} style={{ flex: 1, padding: 12, background: "rgba(255,255,255,.06)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                <button type="submit" className="primary-btn" style={{ flex: 2, padding: 12, fontSize: 14 }} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
