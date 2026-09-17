import { useEffect, useState } from "react";
import "./App.css";

const API = "https://blood-donation-jlr7.onrender.com/api/donors";

function App() {
  const [donors, setDonors] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    bloodGroup: "",
    city: "",
    phone: "",
    available: true,
  });

  // Get donors
  const fetchDonors = async () => {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Failed to fetch donors");
      }

      const data = await response.json();
      setDonors(data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend.");
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  // Form input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  // Register donor
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage("Donor registered successfully! ❤️");

      setForm({
        name: "",
        email: "",
        bloodGroup: "",
        city: "",
        phone: "",
        available: true,
      });

      setShowRegister(false);

      fetchDonors();
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          🩸 BloodCare
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#donors">Find Blood</a>

          <button
            className="nav-button"
            onClick={() => setShowRegister(true)}
          >
            Register Donor
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-content">
          <p className="small-title">
            ❤️ SAVE LIVES • DONATE BLOOD
          </p>

          <h1>
            Your Blood Can Give
            <span> Someone Another Chance.</span>
          </h1>

          <p>
            Connect blood donors with people who need them.
            Register as a donor and help save lives.
          </p>

          <button
            className="hero-button"
            onClick={() => setShowRegister(true)}
          >
            Become a Donor ❤️
          </button>
        </div>

        <div className="hero-card">
          <div className="blood-drop">🩸</div>
          <h2>Every Drop Counts</h2>
          <p>
            One blood donation can help save multiple lives.
          </p>
        </div>
      </section>

      {/* MESSAGE */}
      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {/* DONORS */}
      <section className="donor-section" id="donors">
        <div className="section-heading">
          <p>AVAILABLE DONORS</p>
          <h2>Find a Blood Donor</h2>
          <span>
            Search from our registered blood donors.
          </span>
        </div>

        {donors.length === 0 ? (
          <div className="empty">
            No donors available.
          </div>
        ) : (
          <div className="donor-grid">
            {donors.map((donor) => (
              <div className="donor-card" key={donor.id}>

                <div className="donor-top">
                  <div className="avatar">
                    {donor.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3>{donor.name}</h3>
                    <p>📍 {donor.city}</p>
                  </div>

                  <div className="blood-group">
                    {donor.bloodGroup}
                  </div>
                </div>

                <div className="donor-info">
                  <p>
                    📞 <strong>{donor.phone}</strong>
                  </p>

                  <p>
                    ✉️ {donor.email}
                  </p>

                  <p>
                    🩸 Status:{" "}
                    <span
                      className={
                        donor.available
                          ? "available"
                          : "not-available"
                      }
                    >
                      {donor.available
                        ? "Available"
                        : "Not Available"}
                    </span>
                  </p>
                </div>

                <div className="card-buttons">
                  <a
                    href={`tel:${donor.phone}`}
                    className="call-button"
                  >
                    📞 Call
                  </a>

                  <a
                    href={`mailto:${donor.email}`}
                    className="email-button"
                  >
                    ✉️ Email
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* REGISTER MODAL */}
      {showRegister && (
        <div className="modal-overlay">

          <div className="modal">

            <button
              className="close-button"
              onClick={() => setShowRegister(false)}
            >
              ✕
            </button>

            <h2>Register as a Donor ❤️</h2>

            <p>
              Fill in your details to become a blood donor.
            </p>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />

              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Blood Group
                </option>

                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>

              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading
                  ? "Registering..."
                  : "Register Donor ❤️"}
              </button>

            </form>
          </div>

        </div>
      )}

      {/* FOOTER */}
      <footer>
        <h3>🩸 BloodCare</h3>
        <p>
          Connecting donors. Saving lives.
        </p>
        <small>
          © 2026 BloodCare. All rights reserved.
        </small>
      </footer>

    </div>
  );
}

export default App;
