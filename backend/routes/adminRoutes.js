const express = require("express");
const { adminLogin } = require("../controller/adminAuthController");
const adminController = require("../controller/adminController");
const upload = require("../utils/uploadConfig");

const router = express.Router();

// --- Auth ---
router.post("/login", adminLogin);

// --- Dashboard & Orders ---
router.get("/stats", adminController.getDashboardStats);
router.get("/orders", adminController.getAllOrders);

// --- Events Quản lý ---
router.get("/events", adminController.getAllEvents);
router.post("/events", upload.single("image"), adminController.createEvent);

router
    .route("/events/:id")
    .get(adminController.getEventById)
    .patch(upload.single("image"), adminController.updateEvent)
    .delete(adminController.deleteEvent);

// --- Seat Map ---
router.get("/events/:id/seatmap", adminController.getSeatMap);
router.put("/events/:id/seatmap", adminController.updateSeatMap);

module.exports = router;