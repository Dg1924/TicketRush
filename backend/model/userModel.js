const db = require("../config/db");
const validator = require("validator");
const bcrypt = require("bcryptjs");

exports.createUser = async ({ name, email, password, passwordConfirm, gender, dob }) => {
  if (!name || !email || !password || !passwordConfirm || !gender || !dob) {
    throw new Error("Please provide all required fields");
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanName) {
    throw new Error("Name is required");
  }

  if (!validator.isEmail(cleanEmail)) {
    throw new Error("Invalid email");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  if (password !== passwordConfirm) {
    throw new Error("Passwords do not match");
  }

  const [existing] = await db.promise().query(
    "SELECT id FROM users WHERE email = ?",
    [cleanEmail]
  );

  if (existing.length > 0) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  let age = null;
  if (dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  }

  const [result] = await db.promise().query(
    "INSERT INTO users (name, email, password, gender, dob, age) VALUES (?, ?, ?, ?, ?, ?)",
    [cleanName, cleanEmail, hashedPassword, gender, dob, age]
  );

  return result.insertId;
};

exports.findByEmail = async (email) => {
  const [rows] = await db.promise().query(
    "SELECT * FROM users WHERE email = ?",
    [email.trim().toLowerCase()]
  );
  return rows[0];
};

exports.correctPassword = async (candidatePassword, userPassword) => {
  return bcrypt.compare(candidatePassword, userPassword);
};

exports.createSocialUser = async ({ name, email, provider }) => {
  const [result] = await db.promise().query(
    "INSERT INTO users (name, email, provider) VALUES (?, ?, ?)",
    [name, email.toLowerCase(), provider]
  );

  return result.insertId;
};