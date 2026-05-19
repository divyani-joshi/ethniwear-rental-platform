import React, { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

export default function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const [loading, setLoading] = useState(false)

  const inp = {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(255,255,255,.04)",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 8,
    color: "#fff",
    fontSize: 14,
    outline: "none"
  }

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      if (
        !formData.name ||
        !formData.email ||
        !formData.subject ||
        !formData.message
      ) {
        return alert("Please fill all fields")
      }

      setLoading(true)

      const response = await axios.post(
        "http://localhost:8000/contact",
        formData
      )

      alert(response.data.message)

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      })

    } catch (error) {

      console.log(error)

      alert(
        error?.response?.data?.message ||
        "Something went wrong"
      )

    } finally {

      setLoading(false)

    }

  }

  return (

    <div style={{ background:"#121212",minHeight:"80vh" }}>

      <div style={{
        background:"#0d0d0d",
        borderBottom:"1px solid rgba(227,226,49,.1)",
        padding:"48px 0"
      }}>

        <div className="container text-center">

          <h1 style={{
            color:"#fff",
            fontFamily:"Outfit, sans-serif",
            fontWeight:900,
            fontSize:"clamp(1.8rem,4vw,3rem)",
            marginBottom:8
          }}>
            Contact
            <span style={{ color:"var(--primary-color)" }}>
              {" "}Us
            </span>
          </h1>

          <p style={{ color:"#595959",fontSize:13 }}>

            <Link
              to="/"
              style={{
                color:"#595959",
                textDecoration:"none"
              }}
            >
              Home
            </Link>

            {" "}›{" "}

            <span style={{ color:"var(--primary-color)" }}>
              Contact
            </span>

          </p>

        </div>

      </div>

      <div className="container" style={{ padding:"60px 0" }}>

        <div className="row g-5">

          <div className="col-lg-5">

            <p style={{
              color:"var(--primary-color)",
              fontSize:12,
              letterSpacing:3,
              textTransform:"uppercase",
              fontWeight:700,
              marginBottom:12
            }}>
              Get In Touch
            </p>

            <h2 style={{
              color:"#fff",
              fontFamily:"Outfit, sans-serif",
              fontWeight:800,
              fontSize:"clamp(1.4rem,3vw,2.2rem)",
              marginBottom:20
            }}>
              We'd Love to
              <span style={{ color:"var(--primary-color)" }}>
                {" "}Hear From You
              </span>
            </h2>

            <div style={{
              display:"flex",
              flexDirection:"column",
              gap:16
            }}>

              {[
                {
                  i:"bi-geo-alt",
                  t:"Address",
                  v:"Navrangpura, Ahmedabad, Gujarat - 380009"
                },
                {
                  i:"bi-telephone",
                  t:"Phone",
                  v:"+91 8320332732"
                },
                {
                  i:"bi-envelope",
                  t:"Email",
                  v:"divyanijoshi577@gmail.com"
                },
                {
                  i:"bi-clock",
                  t:"Hours",
                  v:"Mon–Sat: 10:00 AM – 8:00 PM"
                }
              ].map(c => (

                <div
                  key={c.t}
                  style={{
                    display:"flex",
                    gap:14,
                    alignItems:"flex-start",
                    background:"#1a1a1a",
                    border:"1px solid rgba(255,255,255,.06)",
                    borderRadius:10,
                    padding:18
                  }}
                >

                  <i
                    className={`bi ${c.i}`}
                    style={{
                      color:"var(--primary-color)",
                      fontSize:20,
                      marginTop:2,
                      flexShrink:0
                    }}
                  />

                  <div>

                    <p style={{
                      color:"#fff",
                      fontWeight:700,
                      fontSize:14,
                      marginBottom:2
                    }}>
                      {c.t}
                    </p>

                    <p style={{
                      color:"#595959",
                      fontSize:13,
                      margin:0
                    }}>
                      {c.v}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

          <div className="col-lg-7">

            <form
              onSubmit={handleSubmit}
              style={{
                background:"#1a1a1a",
                border:"1px solid rgba(227,226,49,.15)",
                borderRadius:14,
                padding:32
              }}
            >

              <h4 style={{
                color:"#fff",
                fontWeight:700,
                marginBottom:20
              }}>
                Send a Message
              </h4>

              <div className="row g-3">

                <div className="col-md-6">

                  <label style={{
                    color:"#A0A0A0",
                    fontSize:13,
                    marginBottom:6,
                    display:"block"
                  }}>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={inp}
                    placeholder="Jane Doe"
                  />

                </div>

                <div className="col-md-6">

                  <label style={{
                    color:"#A0A0A0",
                    fontSize:13,
                    marginBottom:6,
                    display:"block"
                  }}>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={inp}
                    placeholder="jane@email.com"
                  />

                </div>

                <div className="col-12">

                  <label style={{
                    color:"#A0A0A0",
                    fontSize:13,
                    marginBottom:6,
                    display:"block"
                  }}>
                    Subject
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    style={inp}
                    placeholder="How can we help?"
                  />

                </div>

                <div className="col-12">

                  <label style={{
                    color:"#A0A0A0",
                    fontSize:13,
                    marginBottom:6,
                    display:"block"
                  }}>
                    Message
                  </label>

                  <textarea
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    style={{
                      ...inp,
                      resize:"vertical"
                    }}
                    placeholder="Your message..."
                  />

                </div>

                <div className="col-12">

                  <button
                    type="submit"
                    className="primary-btn"
                    disabled={loading}
                    style={{
                      padding:"13px 32px",
                      fontSize:14
                    }}
                  >
                    {
                      loading
                        ? "Sending..."
                        : "Send Message →"
                    }
                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>

  )
}