import { MapPin, Star, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const difficultyColors = {
  Easy: "bg-green-100 text-green-700",
  Moderate: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
  "Easy to Moderate": "bg-blue-100 text-blue-700",
  "Easy to Hard": "bg-purple-100 text-purple-700",
};

export default function AdventureCard({ adventure, searchParams }) {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate("/itinerary", {
      state: {
        prefill: {
          location: adventure.name,
          ...searchParams,
        },
      },
    });
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="adventure-card glass-card depth-card rounded-lg overflow-hidden shadow-sm border border-white/60 group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-stone-200">
        <img
          src={adventure.image}
          alt={adventure.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Difficulty badge */}
        <div
          className={`absolute top-3 left-3 tag-pill text-[11px] font-semibold ${
            difficultyColors[adventure.difficulty] || "bg-gray-100 text-gray-700"
          }`}
        >
          <TrendingUp className="w-3 h-3 mr-1" />
          {adventure.difficulty}
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          {adventure.rating}
        </div>

        {/* Location */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-medium">
          <MapPin className="w-3.5 h-3.5" />
          {adventure.name}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 relative">
        <div className="flex items-center justify-between mb-3">
          <span className="section-kicker">Curated Route</span>
          <span className="text-[11px] text-stone-400 font-medium">AI-ready</span>
        </div>
        <p className="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-2">
          {adventure.description}
        </p>

        {/* Activities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {adventure.activities.slice(0, 3).map((act) => (
            <span
              key={act}
              className="tag-pill bg-forest-50 text-forest-700 border border-forest-100"
            >
              {act}
            </span>
          ))}
          {adventure.activities.length > 3 && (
            <span className="tag-pill bg-stone-100 text-stone-500">
              +{adventure.activities.length - 3}
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-stone-500 text-xs">
            <Clock className="w-3.5 h-3.5" />
            Best: {adventure.bestTime}
          </div>
          <div className="text-forest-700 font-semibold text-sm">
            {adventure.avgBudget}
          </div>
        </div>

        <button
          onClick={handleExplore}
          className="primary-glow w-full bg-forest-700 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-forest-600 transition-colors flex items-center justify-center gap-2 group/btn"
        >
          Generate Itinerary
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
