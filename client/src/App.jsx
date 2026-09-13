import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api/donors";

const emptyForm = {
  name: "",
  email: "",
  bloodGroup: "",
  city: "",
  phone: "",
  available: true,
  lastDonationDate: "",
  donationCount: 0,
};

function App() {
  const [donors, setDonors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const [searchBlood, setSearchBlood] = useState("");
  const [searchCity, setSearchCity] = useState("");

  // ================= LOAD DONORS =================

  const loadDonors = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setDonors(data);
    } catch (error) {
      console.log(error);
      setMessage("Backend connection failed");
    }
  };

  useEffect(() => {
    loadDonors();
  }, []);

  // ================= MESSAGE =================

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // ================= FORM =================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ================= ADD / UPDATE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.bloodGroup ||
      !form.city ||
      !form.phone
    ) {
      showMessage("Please fill all required fields");
      return;
    }

    try {
      if (editingId) {
        const response = await fetch(`${API}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        const data = await response.json();

        showMessage(data.message);
      } else {
        const response = await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        const data = await response.json();

        showMessage(data.message);
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowModal(false);

      loadDonors();
    } catch (error) {
      console.log(error);
      showMessage("Something went wrong");
    }
  };

  // ================= EDIT =================

  const editDonor = (donor) => {
    setForm({
      name: donor.name,
      email: donor.email,
      bloodGroup: donor.bloodGroup,
      city: donor.city,
      phone: donor.phone,
      available: donor.available,
      lastDonationDate: donor.lastDonationDate || "",
      donationCount: donor.donationCount || 0,
    });

    setEditingId(donor.id);
    setShowModal(true);
  };

  // ================= DELETE =================

  const deleteDonor = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this donor?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      showMessage(data.message);

      loadDonors();
    } catch (error) {
      console.log(error);
      showMessage("Delete failed");
    }
  };

  // ================= AVAILABILITY =================

  const toggleAvailability = async (donor) => {
    try {
      const response = await fetch(
        `${API}/${donor.id}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            available: !donor.available,
          }),
        }
      );

      const data = await response.json();

      showMessage(data.message);

      loadDonors();
    } catch (error) {
      console.log(error);
      showMessage("Update failed");
    }
  };

  // ================= SEARCH =================

  const filteredDonors = donors.filter((donor) => {
    const bloodMatch =
      !searchBlood || donor.bloodGroup === searchBlood;

    const cityMatch =
      !searchCity ||
      donor.city
        .toLowerCase()
        .includes(searchCity.toLowerCase());

    return bloodMatch && cityMatch;
  });

  // ================= DASHBOARD =================

  const totalDonors = donors.length;

  const availableDonors = donors.filter(
    (donor) => donor.available
  ).length;

  const unavailableDonors =
    totalDonors - availableDonors;

  const bloodGroups = [
    "A+",
    "A-",
    "B+",
    "B-",
    "O+",
    "O-",
    "AB+",
    "AB-",
  ];

  // ================= UI =================

  return (
    <div className="app">

      {/* ================= MESSAGE ================= */}

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="logo">
          🩸 LifeSaver
        </div>

        <div className="nav-links">

          <a href="#home">Home</a>

          <a href="#dashboard">Dashboard</a>

          <a href="#donors">Donors</a>

          <a href="#emergency">
            🚨 Emergency
          </a>

          <a href="#about">About</a>

          <a href="#contact">Contact</a>

          <button
            className="nav-button"
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
              setShowModal(true);
            }}
          >
            Become a Donor
          </button>

        </div>

      </nav>

      {/* ================= HERO ================= */}

      <section className="hero" id="home">

        <div className="hero-content">

          <span className="hero-tag">
            ❤️ Donate Blood • Save Lives
          </span>

          <h1>
            Every Drop
            <br />
            <span>Can Save A Life</span>
          </h1>

          <p>
            Connect blood donors with people in need.
            Find available donors quickly and make
            a difference today.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => {
                setForm(emptyForm);
                setEditingId(null);
                setShowModal(true);
              }}
            >
              🩸 Become a Donor
            </button>

            <a
              href="#donors"
              className="secondary-btn"
            >
              Find a Donor
            </a>

          </div>

          <div className="hero-stat">
            <strong>{availableDonors}</strong>
            <span>Available Donors</span>
          </div>

        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className="how-section">

        <div className="section-title">

          <span>HOW IT WORKS</span>

          <h2>
            Saving lives is simple
          </h2>

          <p>
            Three simple steps can help someone
            in need.
          </p>

        </div>

        <div className="how-grid">

          <div className="how-card">
            <div className="how-icon">📝</div>
            <h3>1. Register</h3>
            <p>
              Register yourself as a blood donor
              with your details.
            </p>
          </div>

          <div className="how-card">
            <div className="how-icon">🔎</div>
            <h3>2. Find Donor</h3>
            <p>
              Search for available donors by
              blood group and city.
            </p>
          </div>

          <div className="how-card">
            <div className="how-icon">❤️</div>
            <h3>3. Save a Life</h3>
            <p>
              Contact the donor and help someone
              in an emergency.
            </p>
          </div>

        </div>

      </section>

      {/* ================= DASHBOARD ================= */}

      <section
        className="dashboard"
        id="dashboard"
      >

        <div className="section-title">

          <span>DASHBOARD</span>

          <h2>
            Blood Donation Statistics
          </h2>

          <p>
            Quick overview of our donor community.
          </p>

        </div>

        <div className="dashboard-grid">

          <div className="dashboard-card">

            <div className="dashboard-icon">
              👥
            </div>

            <h3>{totalDonors}</h3>

            <p>Total Donors</p>

          </div>

          <div className="dashboard-card">

            <div className="dashboard-icon">
              🟢
            </div>

            <h3>{availableDonors}</h3>

            <p>Available Donors</p>

          </div>

          <div className="dashboard-card">

            <div className="dashboard-icon">
              🔴
            </div>

            <h3>{unavailableDonors}</h3>

            <p>Unavailable</p>

          </div>

          <div className="dashboard-card">

            <div className="dashboard-icon">
              🩸
            </div>

            <h3>{donors.length}</h3>

            <p>Blood Records</p>

          </div>

        </div>

        <div className="blood-counts">

          <h3>
            Blood Group Availability
          </h3>

          <div className="blood-count-grid">

            {bloodGroups.map((group) => {

              const count = donors.filter(
                (donor) =>
                  donor.bloodGroup === group &&
                  donor.available
              ).length;

              return (
                <div
                  className="blood-count"
                  key={group}
                >
                  <strong>{count}</strong>
                  <span>{group}</span>
                </div>
              );

            })}

          </div>

        </div>

      </section>

      {/* ================= EMERGENCY ================= */}

      <section
        className="emergency"
        id="emergency"
      >

        <div className="emergency-content">

          <h2>
            🚨 Emergency Blood Request
          </h2>

          <p>
            Need blood urgently? Search for
            available donors and contact them
            immediately.
          </p>

          <div className="emergency-form">

            <select
              value={searchBlood}
              onChange={(e) =>
                setSearchBlood(e.target.value)
              }
            >

              <option value="">
                Select Blood Group
              </option>

              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>

            </select>

            <input
              type="text"
              placeholder="Enter city"
              value={searchCity}
              onChange={(e) =>
                setSearchCity(e.target.value)
              }
            />

            <button
              onClick={() => {
                document
                  .getElementById("donors")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              🔎 Find Blood
            </button>

          </div>

        </div>

      </section>

      {/* ================= DONORS ================= */}

      <section
        className="donors-section"
        id="donors"
      >

        <div className="section-title">

          <span>DONOR DIRECTORY</span>

          <h2>
            Find Blood Donors
          </h2>

          <p>
            Search available donors by blood group
            and location.
          </p>

        </div>

        {/* SEARCH */}

        <div className="search-box">

          <select
            value={searchBlood}
            onChange={(e) =>
              setSearchBlood(e.target.value)
            }
          >

            <option value="">
              All Blood Groups
            </option>

            {bloodGroups.map((group) => (
              <option
                value={group}
                key={group}
              >
                {group}
              </option>
            ))}

          </select>

          <input
            type="text"
            placeholder="Search by city..."
            value={searchCity}
            onChange={(e) =>
              setSearchCity(e.target.value)
            }
          />

          <button
            onClick={() => {
              setSearchBlood("");
              setSearchCity("");
            }}
          >
            Clear
          </button>

        </div>

        {/* DONOR CARDS */}

        <div className="donor-grid">

          {filteredDonors.length === 0 ? (

            <div className="no-donors">
              <h3>
                No donors found
              </h3>

              <p>
                Try another blood group or city.
              </p>
            </div>

          ) : (

            filteredDonors.map((donor) => (

              <div
                className="donor-card"
                key={donor.id}
              >

                <div className="donor-top">

                  <div className="avatar">
                    {donor.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>

                    <h3>
                      {donor.name}
                    </h3>

                    <span className="blood-badge">
                      {donor.bloodGroup}
                    </span>

                  </div>

                </div>

                <div
                  className={
                    donor.available
                      ? "available"
                      : "unavailable"
                  }
                >
                  {donor.available
                    ? "● Available"
                    : "● Unavailable"}
                </div>

                <div className="donor-info">

                  <p>
                    📍 {donor.city}
                  </p>

                  <p>
                    📞 {donor.phone}
                  </p>

                  <p>
                    ✉️ {donor.email}
                  </p>

                </div>

                {/* DONATION HISTORY */}

                <div className="donation-history">

                  <h4>
                    🩸 Donation History
                  </h4>

                  <p>
                    Last Donation:{" "}
                    {donor.lastDonationDate
                      ? donor.lastDonationDate
                      : "Not available"}
                  </p>

                  <p>
                    Total Donations:{" "}
                    {donor.donationCount || 0}
                  </p>

                </div>

                {/* ACTIONS */}

                <div className="donor-actions">

                  <a
                    href={`tel:${donor.phone}`}
                    className="call-btn"
                  >
                    📞 Call
                  </a>

                  <a
                    href={`mailto:${donor.email}`}
                    className="email-btn"
                  >
                    ✉️ Email
                  </a>

                </div>

                <div className="admin-actions">

                  <button
                    onClick={() =>
                      editDonor(donor)
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() =>
                      toggleAvailability(donor)
                    }
                  >
                    {donor.available
                      ? "🔴 Mark Unavailable"
                      : "🟢 Mark Available"}
                  </button>

                  <button
                    onClick={() =>
                      deleteDonor(donor.id)
                    }
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </section>

      {/* ================= ABOUT ================= */}

      <section
        className="about"
        id="about"
      >

        <div className="about-content">

          <div>

            <span>ABOUT US</span>

            <h2>
              Together, we can save lives.
            </h2>

            <p>
              LifeSaver is a blood donation management
              system designed to connect donors with
              people who urgently need blood.
            </p>

            <p>
              Our goal is to make finding blood donors
              faster, easier and more reliable.
            </p>

          </div>

          <div className="about-box">

            <div>
              🩸
            </div>

            <h3>
              One donation
            </h3>

            <p>
              can make a real difference.
            </p>

          </div>

        </div>

      </section>

      {/* ================= CONTACT ================= */}

      <section
        className="contact"
        id="contact"
      >

        <div className="section-title">

          <span>CONTACT</span>

          <h2>
            Need Help?
          </h2>

          <p>
            Contact us for blood donation related
            assistance.
          </p>

        </div>

        <div className="contact-grid">

          <div className="contact-card">

            <div>
              📧
            </div>

            <h3>Email</h3>

            <p>
              lifesaver@example.com
            </p>

          </div>

          <div className="contact-card">

            <div>
              📞
            </div>

            <h3>Phone</h3>

            <p>
              +91 98765 43210
            </p>

          </div>

          <div className="contact-card">

            <div>
              📍
            </div>

            <h3>Location</h3>

            <p>
              Tamil Nadu, India
            </p>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer>

        <div className="footer-logo">
          🩸 LifeSaver
        </div>

        <p>
          Blood Donation Management System
        </p>

        <p>
          © 2026 LifeSaver. Every drop matters.
        </p>

      </footer>

      {/* ================= MODAL ================= */}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>
                {editingId
                  ? "Edit Donor"
                  : "Become a Donor"}
              </h2>

              <button
                onClick={() => {
                  setShowModal(false);
                  setForm(emptyForm);
                  setEditingId(null);
                }}
              >
                ✕
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />

              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
              >

                <option value="">
                  Select Blood Group
                </option>

                {bloodGroups.map((group) => (
                  <option
                    value={group}
                    key={group}
                  >
                    {group}
                  </option>
                ))}

              </select>

              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
              />

              <label>
                Last Donation Date
              </label>

              <input
                type="date"
                name="lastDonationDate"
                value={form.lastDonationDate}
                onChange={handleChange}
              />

              <label>
                Number of Donations
              </label>

              <input
                type="number"
                name="donationCount"
                min="0"
                value={form.donationCount}
                onChange={handleChange}
              />

              <label className="checkbox">

                <input
                  type="checkbox"
                  name="available"
                  checked={form.available}
                  onChange={handleChange}
                />

                Available for donation

              </label>

              <button
                type="submit"
                className="submit-btn"
              >
                {editingId
                  ? "Update Donor"
                  : "Register Donor"}
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;