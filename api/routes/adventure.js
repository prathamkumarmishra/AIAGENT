const express = require("express");
const router = express.Router();
const {
  getAdventures,
  generatePlan,
  saveTrip,
  getMyTrips,
  reviewTrip,
  chatWithAI,
} = require("../controllers/adventureController");
const { protect, optionalAuth } = require("../middleware/auth");

router.get("/", getAdventures);
router.post("/generate-plan", optionalAuth, generatePlan);
router.post("/save-trip", protect, saveTrip);
router.get("/my-trips", protect, getMyTrips);
router.put("/trips/:id/review", protect, reviewTrip);
router.post("/chat", chatWithAI);

module.exports = router;
