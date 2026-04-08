require('dotenv').config();
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
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN : 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve frontend static files

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bku_db';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.log("MongoDB Connection Error:", err));

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
    const newComplaint = new Complaint(req.body);
    await newComplaint.save();
    res.status(200).send({ message: "Saved" });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api/membership', async (req, res) => {
  try {
    const newMember = new Member(req.body);
    await newMember.save();
    res.status(200).send({ message: "Saved" });
  } catch (err) {
    res.status(500).send(err);
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

