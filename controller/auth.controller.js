const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.register = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const checkUser = "SELECT * FROM users WHERE email = ?";
  db.query(checkUser, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (result.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUser = "INSERT INTO users (email, password) VALUES (?, ?)";
    db.query(insertUser, [email, hashedPassword], (err) => {
      if (err) return res.status(500).json({ message: "Registration failed" });

      res.status(201).json({ message: "User registered successfully" });
    });
  });
};
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (result.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });
  });
};
exports.logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
