const { generateAdventureItinerary, generateChatResponse } = require("../utils/geminiHelper");
const Trip = require("../models/Trip");

// Popular destinations data
const popularDestinations = [
  {
    id: 1,
    name: "Manali, Himachal Pradesh",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400",
    activities: ["Trekking", "Skiing", "River Rafting", "Camping"],
    difficulty: "Moderate",
    bestTime: "Oct-Jun",
    avgBudget: "₹8,000-15,000",
    rating: 4.8,
    description: "Snow-capped mountains, lush valleys, and thrilling adventures await.",
  },
  {
    id: 2,
    name: "Rishikesh, Uttarakhand",
    image: "https://images.unsplash.com/photo-1591017403997-bcdeb9a5fc71?w=400",
    activities: ["River Rafting", "Bungee Jumping", "Camping", "Yoga"],
    difficulty: "Easy to Hard",
    bestTime: "Sep-Jun",
    avgBudget: "₹5,000-12,000",
    rating: 4.7,
    description: "Adventure capital of India with world-class rafting on the Ganges.",
  },
  {
    id: 3,
    name: "Coorg, Karnataka",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
    activities: ["Trekking", "Bird Watching", "Camping", "Cycling"],
    difficulty: "Easy",
    bestTime: "Oct-Mar",
    avgBudget: "₹6,000-10,000",
    rating: 4.6,
    description: "Scotland of India with misty hills, coffee plantations and waterfalls.",
  },
  {
    id: 4,
    name: "Spiti Valley, HP",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400",
    activities: ["Trekking", "Camping", "Motorcycling", "Rock Climbing"],
    difficulty: "Hard",
    bestTime: "Jun-Oct",
    avgBudget: "₹12,000-20,000",
    rating: 4.9,
    description: "Remote high-altitude desert with ancient monasteries and raw beauty.",
  },
  {
    id: 5,
    name: "Andaman Islands",
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400",
    activities: ["Scuba Diving", "Snorkeling", "Sea Kayaking", "Trekking"],
    difficulty: "Easy to Moderate",
    bestTime: "Nov-May",
    avgBudget: "₹15,000-25,000",
    rating: 4.8,
    description: "Crystal clear waters and pristine beaches perfect for water adventures.",
  },
  {
    id: 6,
    name: "Valley of Flowers, UK",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    activities: ["Trekking", "Photography", "Camping", "Bird Watching"],
    difficulty: "Moderate",
    bestTime: "Jul-Sep",
    avgBudget: "₹7,000-13,000",
    rating: 4.7,
    description: "UNESCO World Heritage trek through a stunning alpine flower meadow.",
  },
];

// @desc    Get all popular adventures/destinations
// @route   GET /api/adventures
// @access  Public
const getAdventures = async (req, res) => {
  try {
    const { activity, difficulty, budget } = req.query;
    let filtered = [...popularDestinations];

    if (activity) {
      filtered = filtered.filter((d) =>
        d.activities.some((a) =>
          a.toLowerCase().includes(activity.toLowerCase())
        )
      );
    }
    if (difficulty) {
      filtered = filtered.filter((d) =>
        d.difficulty.toLowerCase().includes(difficulty.toLowerCase())
      );
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate AI adventure plan
// @route   POST /api/adventures/generate-plan
// @access  Public
const generatePlan = async (req, res) => {
  try {
    const { location, budget, days, activities } = req.body;

    if (!location || !budget || !days) {
      return res.status(400).json({
        success: false,
        message: "Location, budget, and days are required",
      });
    }

    const itinerary = await generateAdventureItinerary({
      location,
      budget,
      days: parseInt(days),
      activities: activities || ["trekking", "camping"],
    });

    // Save trip if user is authenticated
    if (req.user) {
      const trip = await Trip.create({
        user: req.user._id,
        name: itinerary.title,
        location,
        budget,
        duration: days,
        activities: activities || [],
        itinerary,
      });
      itinerary.tripId = trip._id;
    }

    res.json({ success: true, data: itinerary });
  } catch (error) {
    console.error("Plan generation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate plan: " + error.message,
    });
  }
};

// @desc    Save a trip
// @route   POST /api/adventures/save-trip
// @access  Private
const saveTrip = async (req, res) => {
  try {
    const { name, location, budget, duration, activities, itinerary } = req.body;

    const trip = await Trip.create({
      user: req.user._id,
      name,
      location,
      budget,
      duration,
      activities,
      itinerary,
    });

    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's saved trips
// @route   GET /api/adventures/my-trips
// @access  Private
const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort("-createdAt");
    res.json({ success: true, count: trips.length, data: trips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Rate and review a trip
// @route   PUT /api/adventures/trips/:id/review
// @access  Private
const reviewTrip = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { rating, review },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    res.json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    AI Chatbot
// @route   POST /api/adventures/chat
// @access  Public
const chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }
    const response = await generateChatResponse(message, context);
    res.json({ success: true, data: { response } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdventures,
  generatePlan,
  saveTrip,
  getMyTrips,
  reviewTrip,
  chatWithAI,
};
