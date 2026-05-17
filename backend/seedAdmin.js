require("dotenv").config({ path: "./config.env" });

const bcrypt = require("bcryptjs");
const db = require("./config/db");
const AppError = require("./utils/appError");

const seedAdmin = async () => {
  try {
    console.log("Connecting to MySQL...");

    await db.promise().query("SELECT 1");
    console.log("DB Connection successful!");

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new AppError("Please provide ADMIN_EMAIL and ADMIN_PASSWORD", 400);
    }

    const [existingAdmin] = await db.promise().query(
      "SELECT id FROM users WHERE email = ?",
      [adminEmail]
    );

    if (existingAdmin.length > 0) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    await db.promise().query(
      `
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
      `,
      ["Super Admin", adminEmail, hashedPassword, "admin"]
    );

    console.log("Admin created successfully!");
    process.exit(0);
  } catch (err) {
    console.log("Seed admin failed");
    console.log(err.message);
    process.exit(1);
  }
};

seedAdmin();
