require('dotenv').config();
console.log("ENV CHECK:", process.env.MONGODB_URI);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Production security headers
app.use(helmet());

// Compression for production
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
}

// Logging
app.use(morgan('combined'));

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173", // local (Vite)
  "https://bkuat.com",
  "https://bku-project-9jbmzjc1e-kumarabhiis-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve frontend static files

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

console.log("Using URI:", MONGODB_URI);

// Connect to MongoDB with timeout options for Render/Atlas
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false,
  bufferMaxEntries: 0,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4  // Use IPv4, skip IPv6
})
.then(() => {
  console.log("✅ MongoDB Connected Successfully");
})
.catch((err) => {
  console.error("❌ MongoDB Connection Error:", err.message);
  process.exit(1);  // Exit on connection fail for Render detection
});
// Define Schemas
const ComplaintSchema = new mongoose.Schema({
  fullName: String,
  address: String,
  phone: String,
  email: String,
  complaintText: String,
  date: { type: Date, default: Date.now }
});

const MembershipSchema = new mongoose.Schema({
  fullName: String,
  guardianName: String,
  state: String,
  address: String,
  phone: String,
  email: String,
  suggestions: String,
  date: { type: Date, default: Date.now }
});

const Complaint = mongoose.model('Complaint', ComplaintSchema);
const Member = mongoose.model('Member', MembershipSchema);

// API Routes
app.post('/api/complaint', async (req, res) => {
  try {
    console.log("Incoming Data:", req.body); // 👈 ADD THIS

    const newComplaint = new Complaint(req.body);
    await newComplaint.save();

    res.status(200).send({ message: "Saved" });
  } catch (err) {
    console.error("ERROR:", err); // 👈 ADD THIS
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/membership', async (req, res) => {
  try {
    console.log("Incoming Data:", req.body);

    const newMember = new Member(req.body);
    await newMember.save();

    res.status(200).send({ message: "Saved" });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({ 
    status: 'ok', 
    dbState: states[dbState],
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

