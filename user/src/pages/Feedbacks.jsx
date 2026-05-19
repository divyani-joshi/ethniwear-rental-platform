import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getFeedbacks } from "../services/api";
import { getToken } from "../auth/authService";
const backendUrl = "https://divyani-ethniwear-api.onrender.com"
const BASE = import.meta.env.VITE_API_URL;
export default function Feedbacks() {
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState({
    booking_id: "",
    rating: 0,
    feedback: "",
  });

  useEffect(() => {
    fetchFeedbacks();
    fetchOrders();
  }, []);

  // Get feedbacks
  const fetchFeedbacks = () => {
    getFeedbacks()
      .then((r) => setFeedbacks(r.data.feedback || r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // Get user orders
  const fetchOrders = async () => {
    try {
      let token = getToken();

      console.log("TOKEN =>", token);

      console.log("TOKEN =>", token);

    const response = await axios.get(
  `${backendUrl}/user/getUserOrders`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

      console.log("FULL RESPONSE =>", response);

      console.log("RESPONSE DATA =>", response.data);

      console.log("ORDERS ARRAY =>", response.data.orders);

      setOrders(response.data.orders);
    } catch (error) {
      console.log("FETCH ORDER ERROR =>", error);
    }
  };

  // Submit feedback
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.booking_id) {
        return alert("Please select booking");
      }

      if (!formData.rating) {
        return alert("Please select rating");
      }

      if (!formData.feedback) {
        return alert("Please write feedback");
      }

      const token = getToken();

      const response = await axios.post(
        `${BASE}/user/addFeedback`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(response.data.message);

      setShowPopup(false);

      setFormData({
        booking_id: "",
        rating: 0,
        feedback: "",
      });

      fetchFeedbacks();

      navigate("/feedbacks");
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Something went wrong");
    }
  };

  const avg = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(
        1,
      )
    : 0;

  console.log("ORDERS =>", orders);
  return (
    <div style={{ background: "#121212", minHeight: "80vh" }}>
      {/* Header */}
      <div
        style={{
          background: "#0d0d0d",
          borderBottom: "1px solid rgba(227,226,49,.1)",
          padding: "48px 0",
        }}
      >
        <div className="container text-center">
          <h1
            style={{
              color: "#fff",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(1.8rem,4vw,3rem)",
              marginBottom: 8,
            }}
          >
            Customer{" "}
            <span style={{ color: "var(--primary-color)" }}>Reviews</span>
          </h1>

          <p style={{ color: "#595959", fontSize: 13 }}>
            <Link to="/" style={{ color: "#595959", textDecoration: "none" }}>
              Home
            </Link>{" "}
            › <span style={{ color: "var(--primary-color)" }}>Reviews</span>
          </p>

          {/* Add Button */}
          <div style={{ marginTop: 20 }}>
            <button
              onClick={() => setShowPopup(true)}
              style={{
                background: "var(--primary-color)",
                color: "#121212",
                padding: "12px 24px",
                borderRadius: 8,
                border: "none",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Add Feedback
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: "48px 0" }}>
        {!loading && feedbacks.length > 0 && (
          <div
            style={{
              background: "#1a1a1a",
              border: "1px solid rgba(227,226,49,.15)",
              borderRadius: 14,
              padding: 28,
              marginBottom: 40,
            }}
          >
            <div className="text-center">
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 900,
                  color: "var(--primary-color)",
                }}
              >
                {avg}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 3,
                  margin: "8px 0",
                }}
              >
                {[1, 2, 3, 4, 5].map((s) => (
                  <i
                    key={s}
                    className={`bi bi-star${s <= Math.round(avg) ? "-fill" : ""}`}
                    style={{ color: "var(--primary-color)", fontSize: 18 }}
                  />
                ))}
              </div>

              <p style={{ color: "#595959" }}>{feedbacks.length} reviews</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div
              style={{
                width: 40,
                height: 40,
                border: "3px solid rgba(227,226,49,.2)",
                borderTopColor: "#E3E231",
                borderRadius: "50%",
                animation: "spin .8s linear infinite",
                margin: "0 auto",
              }}
            />
          </div>
        ) : feedbacks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>⭐</div>
            <h4 style={{ color: "#fff" }}>No reviews yet</h4>
          </div>
        ) : (
          <div className="row g-4">
            {feedbacks.map((f, i) => (
              <div key={f._id || i} className="col-lg-4 col-md-6">
                <div
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,.06)",
                    borderRadius: 12,
                    padding: 24,
                    height: "100%",
                  }}
                >
                  <h5 style={{ color: "#fff", marginBottom: 10 }}>
                    {f.user?.name || "User"}
                  </h5>

                  <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <i
                        key={s}
                        className={`bi bi-star${s <= f.rating ? "-fill" : ""}`}
                        style={{ color: "var(--primary-color)", fontSize: 16 }}
                      />
                    ))}
                  </div>

                  <p
                    style={{
                      color: "#A0A0A0",
                      fontSize: 14,
                      fontStyle: "italic",
                      lineHeight: 1.7,
                    }}
                  >
                    "{f.feedback}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popup */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 500,
              background: "#1a1a1a",
              padding: 30,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            {/* Top */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3 style={{ color: "#fff", margin: 0 }}>Add Feedback</h3>

              <i
                className="bi bi-x-lg"
                onClick={() => setShowPopup(false)}
                style={{
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 20,
                }}
              />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Booking Dropdown */}
              {/* Booking Dropdown */}
              {/* Booking Dropdown */}
              <div className="mb-3">
                <select
                  className="form-control"
                  value={formData.booking_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      booking_id: e.target.value,
                    })
                  }
                  style={{
                    background: "#121212",
                    border: "1px solid rgba(255,255,255,.08)",
                    color: "#fff",
                    height: 50,
                  }}
                >
                  <option value="">Select Booking</option>

                  {orders && orders.length > 0 ? (
                    orders.map((order, index) => (
                      <option
                        key={order._id || index}
                        value={order._id.toString()}
                      >
                        {order.item?.name ||
                          `Order #${order._id.toString().slice(-5)}`}{" "}
                        | ₹{order.total_amount}
                      </option>
                    ))
                  ) : (
                    <option disabled>No Orders Found</option>
                  )}
                </select>
              </div>

              {/* Rating */}
              <div className="mb-3">
                <div style={{ display: "flex", gap: 10 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          rating: star,
                        })
                      }
                      className={`bi ${
                        star <= formData.rating ? "bi-star-fill" : "bi-star"
                      }`}
                      style={{
                        color: "var(--primary-color)",
                        fontSize: 30,
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div className="mb-4">
                <textarea
                  rows="4"
                  placeholder="Write feedback..."
                  className="form-control"
                  value={formData.feedback}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      feedback: e.target.value,
                    })
                  }
                  style={{
                    background: "#121212",
                    border: "1px solid rgba(255,255,255,.08)",
                    color: "#fff",
                    resize: "none",
                  }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  width: "100%",
                  background: "var(--primary-color)",
                  border: "none",
                  height: 50,
                  borderRadius: 10,
                  fontWeight: 700,
                }}
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
