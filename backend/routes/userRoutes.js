const express = require("express");
const { signup, login, socialLogin } = require("../controller/userController");
const userController = require('../controller/userController');
const db = require("../config/db");
const authController = require("../controller/authController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/social-login", socialLogin);
router.get("/events", userController.getAllEvents);
router.get("/my-tickets", authController.protect, userController.getMyTickets);

router.get("/events/:id", userController.getEventById);

router.post("/purchase", authController.protect, userController.purchaseTicket);
router.post("/hold-seats", authController.protect, userController.holdSeats);
router.post("/release-seats", authController.protect, userController.releaseSeats);
router.post("/forgot-password", userController.forgotPassword);

router.patch("/reset-password/:token", userController.resetPassword);

router.get("/profile", authController.protect, userController.getProfile);
router.patch("/profile", authController.protect, userController.updateProfile);
module.exports = router;