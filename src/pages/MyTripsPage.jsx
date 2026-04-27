import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, MapPin, Calendar, Star, Trash2, ChevronRight, Lock, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getMyTrips } from "../utils/api";
import { useAuth } from "../hooks/useAuth";

export default function MyTripsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    if (!user && !authLoading) return;
    if (user) {
      getMyTrips()
        .then((res) => setTrips(res.data.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-forest-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center app-surface">
        <div className="glass-card depth-card rounded-lg border border-white/70 text-center p-10">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-stone-400" />
          </div>
          <h2 className="font-display font-bold text-2xl text-stone-900 mb-2">Sign In Required</h2>
          <p className="text-stone-500 text-sm mb-6">Create an account to save and revisit your adventure plans.</p>
          <button
            onClick={() => navigate("/")}
            className="primary-glow bg-forest-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-forest-600 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen app-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="premium-panel topographic rounded-lg p-6 text-white flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
          <div>
            <p className="section-kicker mb-3 text-earth-200">Saved Field Library</p>
            <h1 className="text-3xl font-display font-bold">My Adventures</h1>
            <p className="text-forest-100/75 mt-1 text-sm max-w-xl">
              Your saved trip plans, route ideas, itinerary highlights, and future weekend sparks in one quiet place.
            </p>
          </div>
          <button
            onClick={() => navigate("/itinerary")}
            className="primary-glow bg-earth-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-earth-400 transition-colors flex items-center gap-2"
          >
            + New Plan
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 animate-spin text-forest-600" />
          </div>
        ) : trips.length === 0 ? (
          <div className="glass-card depth-card rounded-lg p-14 border border-white/70 text-center">
            <div className="text-6xl mb-4">🏕️</div>
            <h3 className="font-display font-bold text-xl text-stone-900 mb-2">No trips saved yet</h3>
            <p className="text-stone-500 text-sm mb-6">Generate your first AI adventure plan and save it here!</p>
            <button
              onClick={() => navigate("/itinerary")}
              className="primary-glow bg-forest-700 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-forest-600"
            >
              Plan an Adventure →
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <motion.div
                key={trip._id}
                whileHover={{ y: -6, rotateX: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="glass-card depth-card rounded-lg border border-white/70 transition-all cursor-pointer group overflow-hidden"
                onClick={() => setSelectedTrip(selectedTrip?._id === trip._id ? null : trip)}
              >
                {/* Card header */}
                <div className="premium-panel topographic p-5 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-forest-300 text-[10px] uppercase tracking-widest mb-1">Adventure Plan</p>
                      <h3 className="font-display font-bold text-lg leading-snug">{trip.name}</h3>
                    </div>
                    <Bookmark className="w-4 h-4 text-forest-400 flex-shrink-0 mt-0.5" />
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                      <MapPin className="w-4 h-4 text-forest-600" />
                      {trip.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                      <Calendar className="w-4 h-4 text-forest-600" />
                      {trip.duration} days • Budget ₹{trip.budget}
                    </div>
                    {trip.rating && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: trip.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Activities */}
                  {trip.activities?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {trip.activities.slice(0, 3).map((a) => (
                        <span key={a} className="tag-pill bg-forest-50 text-forest-700 border border-forest-100 text-[11px]">
                          {a}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-400">
                      {new Date(trip.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </span>
                    <span className="text-forest-600 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Plan <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Expanded view */}
                <AnimatePresence>
                {selectedTrip?._id === trip._id && trip.itinerary && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-white/70 p-5 overflow-hidden"
                  >
                    <h4 className="font-semibold text-stone-800 text-sm mb-3">Itinerary Highlights</h4>
                    <div className="space-y-2">
                      {trip.itinerary.days?.slice(0, 2).map((day) => (
                        <div key={day.day} className="text-sm">
                          <span className="font-medium text-forest-700">Day {day.day}: </span>
                          <span className="text-stone-600">{day.plan?.substring(0, 80)}...</span>
                        </div>
                      ))}
                    </div>
                    {trip.itinerary.total_estimated_cost && (
                      <div className="mt-3 text-sm font-semibold text-forest-700">
                        Total: {trip.itinerary.total_estimated_cost}
                      </div>
                    )}
                  </motion.div>
                )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
