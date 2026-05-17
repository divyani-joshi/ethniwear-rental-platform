import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getItems, getCategories } from "../services/api";

const BACKEND = import.meta.env.VITE_API_URL;
// const BACKEND = "http://localhost:8000"

export default function Collections() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [activeCat, setActiveCat] = useState(
    searchParams.get("category_id") || "",
  );

  const fetchItems = async (
    catId = activeCat,
    min = priceRange.min,
    max = priceRange.max,
  ) => {
    setLoading(true);
    try {
      const params = {};
      if (catId) params.category_id = catId;
      if (min) params.min_price = min;
      if (max) params.max_price = max;
      const r = await getItems(params);
      setItems(r.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories()
      .then((r) => setCategories(r.data.data || []))
      .catch(console.error);
    fetchItems();
  }, []);

  const handleCatChange = (id) => {
    setActiveCat(id);
    if (id) setSearchParams({ category_id: id });
    else setSearchParams({});
    fetchItems(id);
  };

  const handlePriceFilter = () =>
    fetchItems(activeCat, priceRange.min, priceRange.max);

  const filtered = items.filter(
    (item) =>
      !search ||
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ background: "#121212", minHeight: "80vh" }}>
      {/* Page Banner */}
      <div
        style={{
          background: "linear-gradient(135deg,#1a1a1a,#0d0d0d)",
          borderBottom: "1px solid rgba(227,226,49,.1)",
          padding: "48px 0",
        }}
      >
        <div className="container">
          <div className="text-center">
            <h1
              style={{
                color: "#fff",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(1.8rem,4vw,3rem)",
                marginBottom: 8,
              }}
            >
              Ethnic{" "}
              <span style={{ color: "var(--primary-color)" }}>Collections</span>
            </h1>
            <p style={{ color: "#595959", fontSize: 14 }}>
              <Link to="/" style={{ color: "#595959", textDecoration: "none" }}>
                Home
              </Link>
              {" › "}
              <span style={{ color: "var(--primary-color)" }}>Collections</span>
            </p>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "48px 0" }}>
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div
              style={{
                background: "#1a1a1a",
                borderRadius: 12,
                padding: 24,
                border: "1px solid rgba(255,255,255,.06)",
                position: "sticky",
                top: 90,
              }}
            >
              {/* Search */}
              <div style={{ marginBottom: 28 }}>
                <h6
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    marginBottom: 12,
                  }}
                >
                  Search
                </h6>
                <div style={{ position: "relative" }}>
                  <i
                    className="bi bi-search"
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--primary-color)",
                      fontSize: 14,
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search outfits..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 36px",
                      background: "#121212",
                      border: "1px solid rgba(255,255,255,.1)",
                      borderRadius: 6,
                      color: "#fff",
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Categories */}
              <div style={{ marginBottom: 28 }}>
                <h6
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    marginBottom: 12,
                  }}
                >
                  Categories
                </h6>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  <button
                    onClick={() => handleCatChange("")}
                    style={{
                      textAlign: "left",
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "none",
                      background: !activeCat ? "rgba(227,226,49,.12)" : "none",
                      color: !activeCat ? "var(--primary-color)" : "#A0A0A0",
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: !activeCat ? 700 : 400,
                    }}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => handleCatChange(c._id)}
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: "none",
                        background:
                          activeCat === c._id ? "rgba(227,226,49,.12)" : "none",
                        color:
                          activeCat === c._id
                            ? "var(--primary-color)"
                            : "#A0A0A0",
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: activeCat === c._id ? 700 : 400,
                      }}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h6
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    marginBottom: 12,
                  }}
                >
                  Price Range / Day
                </h6>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 10,
                    width: "100%",
                  }}
                >
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange((p) => ({
                        ...p,
                        min: e.target.value,
                      }))
                    }
                    style={{
                      width: "50%",
                      minWidth: 0,
                      padding: "9px 10px",
                      background: "#121212",
                      border: "1px solid rgba(255,255,255,.1)",
                      borderRadius: 6,
                      color: "#fff",
                      fontSize: 13,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />

                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((p) => ({
                        ...p,
                        max: e.target.value,
                      }))
                    }
                    style={{
                      width: "50%",
                      minWidth: 0,
                      padding: "9px 10px",
                      background: "#121212",
                      border: "1px solid rgba(255,255,255,.1)",
                      borderRadius: 6,
                      color: "#fff",
                      fontSize: 13,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <button
                  onClick={handlePriceFilter}
                  className="primary-btn"
                  style={{ width: "100%", padding: "10px", fontSize: 13 }}
                >
                  Apply Filter
                </button>
                {(activeCat || priceRange.min || priceRange.max || search) && (
                  <button
                    onClick={() => {
                      setActiveCat("");
                      setPriceRange({ min: "", max: "" });
                      setSearch("");
                      setSearchParams({});
                      fetchItems("", "", "");
                    }}
                    style={{
                      width: "100%",
                      marginTop: 8,
                      padding: "8px",
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,.1)",
                      borderRadius: 4,
                      color: "#A0A0A0",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Items Grid */}
          <div className="col-lg-9">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <p style={{ color: "#595959", fontSize: 14, margin: 0 }}>
                Showing{" "}
                <strong style={{ color: "var(--primary-color)" }}>
                  {filtered.length}
                </strong>{" "}
                outfits
              </p>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    border: "3px solid rgba(227,226,49,.2)",
                    borderTopColor: "#E3E231",
                    borderRadius: "50%",
                    animation: "spin .8s linear infinite",
                    margin: "0 auto 12px",
                  }}
                />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                <p style={{ color: "#595959" }}>Loading outfits...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>👘</div>
                <h4 style={{ color: "#fff", marginBottom: 8 }}>
                  No outfits found
                </h4>
                <p style={{ color: "#595959" }}>Try adjusting your filters</p>
              </div>
            ) : (
              <div className="row g-4">
                {filtered.map((item) => (
                  <div key={item._id} className="col-md-4 col-sm-6">
                    <div
                      className="product-card"
                      style={{
                        background: "#1a1a1a",
                        borderRadius: 12,
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,.05)",
                        transition: "all .3s",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(227,226,49,.25)";
                        e.currentTarget.style.transform = "translateY(-4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,.05)";
                        e.currentTarget.style.transform = "none";
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          height: 260,
                          overflow: "hidden",
                        }}
                      >
                        {item.image ? (
                          <img
                            src={`${BACKEND}/${item.image}`}
                            loading="lazy"
                            alt={item.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform .4s",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.transform = "scale(1.06)")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.transform = "scale(1)")
                            }
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 52,
                              background: "#222",
                            }}
                          >
                            👘
                          </div>
                        )}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to top,rgba(0,0,0,.6),transparent 50%)",
                          }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            background: "var(--primary-color)",
                            color: "#121212",
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 3,
                          }}
                        >
                          {item.category?.name || "Ethnic"}
                        </span>
                        <span
                          style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            background:
                              item.status === "Available"
                                ? "rgba(34,197,94,.9)"
                                : "rgba(239,68,68,.9)",
                            color: "#fff",
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 3,
                          }}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div
                        style={{
                          padding: "16px 18px 20px",
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <h5
                          style={{
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 15,
                            marginBottom: 6,
                          }}
                        >
                          {item.name}
                        </h5>
                        <p
                          style={{
                            color: "#595959",
                            fontSize: 13,
                            flex: 1,
                            marginBottom: 14,
                            lineHeight: 1.6,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.description}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              color: "var(--primary-color)",
                              fontWeight: 800,
                              fontSize: 18,
                              fontFamily: "Outfit, sans-serif",
                            }}
                          >
                            ₹{item.price}
                            <span
                              style={{
                                fontSize: 11,
                                color: "#595959",
                                fontWeight: 400,
                              }}
                            >
                              /day
                            </span>
                          </span>
                          <Link
                            to={`/item/${item._id}`}
                            className="primary-btn"
                            style={{ padding: "7px 14px", fontSize: 12 }}
                          >
                            View & Rent
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
