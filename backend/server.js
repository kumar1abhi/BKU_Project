const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. Connect to MongoDB (Change 'bku_db' to your preferred name)
mongoose.connect('mongodb://127.0.0.1:27017/bku_db')
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log("MongoDB Connection Error:", err));

// 2. Define Schemas
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

// 3. API Routes
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

app.listen(5000, () => console.log("Server running on port 5000"));