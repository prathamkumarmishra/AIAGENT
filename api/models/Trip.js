const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: { type: String, required: true },
    location: { type: String, required: true },
    budget: { type: String, required: true },
    duration: { type: Number, required: true },
    activities: [String],
    itinerary: {
      title: String,
      total_estimated_cost: String,
      best_time_to_visit: String,
      days: [
        {
          day: Number,
          plan: String,
          activities: [String],
          cost: String,
        },
      ],
      activities: [String],
      packing_list: [String],
      safety_tips: [String],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: String,
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
