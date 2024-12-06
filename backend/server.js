const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const admin = require("firebase-admin");
const path = require("path");
const serviceAccount=require("./config/serviceAccountKey.json")

const app = express();

// Middleware setup
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Logging request headers for debugging
app.use((req, res, next) => {
  console.log("Headers:", req.headers);
  next();
});

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Connecting to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log(error);
    console.log("MongoDB connection failed");
  });

// Schema and Models

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//user model
const User = mongoose.model("User", userSchema);


// Student Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  age: { type: Number, required: true, min: 1, max: 100 },
  grade: { type: String, required: true, maxlength: 5 },
  contact: { type: String, required: true, minlength: 5, maxlength: 100 },
firebaseUID:{ type: String, required: true }, //firebase UID
});

const Student = mongoose.model("Student", studentSchema);

// Middleware for Firebase Authentication token verification
const authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from the Authorization header

  console.log("Token:", token); // Debugging token

  if (!token) {
    console.error("No token found");
    return res.status(403).send("Token is required");
  }

  try {
    // Verify Firebase ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Decoded Token:", decodedToken); // Debugging decoded token
    req.firebaseUID = decodedToken.uid;
    const userUid = decodedToken.uid; //extract UID
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(403).send("Invalid token");
  }
};

// Routes

// User Signup
app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Login (Optional, if you still want to use a custom JWT for login)
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    // Create a JWT token (Custom JWT for your own backend)
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h", algorithm: "HS256" } // Custom JWT for your backend if needed
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a student (Protected)
app.post("/api/students", authenticate, async (req, res) => {
  const { name, age, contact, grade } = req.body;
  const firebaseUID = req.firebaseUID; // Get user ID from token
  try {
    const newStudent = new Student({ name, age, contact, grade, firebaseUID });
    const savedStudent = await newStudent.save();
    res.status(201).json({ message: 'Student created successfully', savedStudent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all students (Protected)
app.get("/api/students",authenticate, async (req, res) => {
  const firebaseUID = req.firebaseUID; // Get user ID from token
  const { page = 1, limit = 5 } = req.query;
  try {
    const students = await Student.find({ firebaseUID})
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Student.countDocuments({ firebaseUID });
    res.status(200).json({
      students,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//filter students
app.get("/api/students/all",authenticate, async (req, res) => {
  const firebaseUID = req.firebaseUID;
  try {
    const students = await Student.find({ firebaseUID }); // Fetch all students
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Update a student (Protected)
app.put("/api/students/:id",  async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



app.delete("/api/students/:id", async (req, res) => {
  try {
    const studentId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    const deleteStudent = await Student.findByIdAndDelete(studentId);
    if (!deleteStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error); // Log full error for debugging
    res.status(500).json({ error: "Internal server error" });
  }
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});