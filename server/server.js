const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ================= DONOR DATA =================

let donors = [
  {
    id: 1,
    name: "Ravi",
    email: "ravi@gmail.com",
    bloodGroup: "O+",
    city: "Chennai",
    phone: "9876543210",
    available: true,
  },
  {
    id: 2,
    name: "Aparnika",
    email: "aparnika@gmail.com",
    bloodGroup: "A+",
    city: "Salem",
    phone: "9876543211",
    available: true,
  },
];

// ================= HOME =================

app.get("/", (req, res) => {
  res.send("Blood Donation Management System Backend Running!");
});

// ================= GET ALL DONORS =================

app.get("/api/donors", (req, res) => {
  res.json(donors);
});

// ================= REGISTER DONOR =================

app.post("/api/donors", (req, res) => {
  const {
    name,
    email,
    bloodGroup,
    city,
    phone,
    available,
  } = req.body;

  if (
    !name ||
    !email ||
    !bloodGroup ||
    !city ||
    !phone
  ) {
    return res.status(400).json({
      message: "Please fill all fields",
    });
  }

  const newDonor = {
    id:
      donors.length > 0
        ? Math.max(...donors.map((d) => d.id)) + 1
        : 1,

    name,
    email,
    bloodGroup,
    city,
    phone,

    available:
      available !== undefined
        ? available
        : true,
  };

  donors.push(newDonor);

  res.status(201).json({
    message: "Donor registered successfully!",
    donor: newDonor,
  });
});

// ================= UPDATE DONOR =================

app.put("/api/donors/:id", (req, res) => {
  const id = Number(req.params.id);

  const donorIndex = donors.findIndex(
    (donor) => donor.id === id
  );

  if (donorIndex === -1) {
    return res.status(404).json({
      message: "Donor not found",
    });
  }

  donors[donorIndex] = {
    ...donors[donorIndex],
    ...req.body,
    id: id,
  };

  res.json({
    message: "Donor updated successfully!",
    donor: donors[donorIndex],
  });
});

// ================= DELETE DONOR =================

app.delete("/api/donors/:id", (req, res) => {
  const id = Number(req.params.id);

  const donorExists = donors.find(
    (donor) => donor.id === id
  );

  if (!donorExists) {
    return res.status(404).json({
      message: "Donor not found",
    });
  }

  donors = donors.filter(
    (donor) => donor.id !== id
  );

  res.json({
    message: "Donor deleted successfully!",
  });
});

// ================= CHANGE AVAILABILITY =================

app.patch(
  "/api/donors/:id/availability",
  (req, res) => {
    const id = Number(req.params.id);

    const donor = donors.find(
      (donor) => donor.id === id
    );

    if (!donor) {
      return res.status(404).json({
        message: "Donor not found",
      });
    }

    donor.available = req.body.available;

    res.json({
      message: "Donor availability updated!",
      donor: donor,
    });
  }
);

// ================= START SERVER =================

app.listen(5000, () => {
  console.log(
    "Server running on http://localhost:5000"
  );
});