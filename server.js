const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Helpers
const readJson = (filename) => {
  const filePath = path.join(__dirname, 'src', 'data', filename);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const writeJson = (filename, data) => {
  const filePath = path.join(__dirname, 'src', 'data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// ---------------------------
// INSTITUTIONS ROUTES
// ---------------------------
app.get('/institutions', (req, res) => {
  const data = readJson('institutions.json');
  res.json(data);
});

app.post('/institutions', (req, res) => {
  writeJson('institutions.json', req.body);
  res.status(200).json({ message: 'Updated' });
});

// ---------------------------
// CERTIFICATES ROUTES
// ---------------------------

// Get all certificates
app.get('/certificates', (req, res) => {
  const data = readJson('certificates.json');
  res.json(data);
});

// POST /certificates — store issued certificate
app.post('/certificates', (req, res) => {
  const filePath = path.join(__dirname, 'src', 'data', 'certificates.json'); // ✅ Do NOT name it `path`
  let certificates = [];

  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    certificates = JSON.parse(raw);
  }

  certificates.push(req.body);

  fs.writeFileSync(filePath, JSON.stringify(certificates, null, 2));
  res.status(201).json({ message: 'Certificate saved' });
});


// PUT /certificates/revoke — update status to 'revoked' by hash
app.put('/certificates/revoke', (req, res) => {
  const { hash } = req.body;
  const filePath = path.join(__dirname, 'src', 'data', 'certificates.json');

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Certificates file not found' });
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const certificates = JSON.parse(raw);

  const index = certificates.findIndex(cert => cert.hash === hash);
  if (index === -1) {
    return res.status(404).json({ message: 'Certificate not found' });
  }

  certificates[index].status = "revoked";

  fs.writeFileSync(filePath, JSON.stringify(certificates, null, 2));
  res.status(200).json({ message: 'Certificate marked as revoked' });
});





// ---------------------------
// START SERVER
// ---------------------------
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
