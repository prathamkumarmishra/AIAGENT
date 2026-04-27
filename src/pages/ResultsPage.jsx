import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Filter, SlidersHorizontal, ArrowLeft, Loader } from "lucide-react";
import AdventureCard from "../components/AdventureCard";
import WeatherWidget from "../components/WeatherWidget";
import { getAdventures } from "../utils/api";

const DIFFICULTY_OPTIONS = ["All", "Easy", "Moderate", "Hard"];
const ACTIVITY_FILTERS = ["All", "Trekking", "Camping", "River Rafting", "Cycling", "Scuba Diving", "Skiing"];

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state?.searchParams || {};

  const [adventures, setAdventures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("All");
  const [activity, setActivity] = useState("All");
  const [searchQuery, setSearchQuery] = useState(searchParams.location || "");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAdventures();
  }, [difficulty, activity]);

  const fetchAdventures = async () => {
    setLoading(true);
    try {
      const params = {};
      if (difficulty !== "All") params.difficulty = difficulty;
      if (activity !== "All") params.activity = activity;
      const res = await getAdventures(params);
      setAdventures(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = adventures.filter((a) =>
    searchQuery
      ? a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.activities.some((act) => act.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
  );

  return (
    <div className="pt-20 min-h-screen bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-stone-200 transition-colors text-stone-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-stone-900">
              {searchParams.location
                ? `Adventures near ${searchParams.location}`
                : "Explore Destinations"}
            </h1>
            <p className="text-stone-500 text-sm">
              {filtered.length} adventures found
            </p>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1">
            {/* Search + Filter bar */}
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search destinations or activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  showFilters
                    ? "bg-forest-700 text-white border-forest-700"
                    : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="bg-white rounded-2xl p-5 border border-stone-100 mb-6 animate-fade-in">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
                      Difficulty
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DIFFICULTY_OPTIONS.map((d) => (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            difficulty === d
                              ? "bg-forest-700 text-white border-forest-700"
                              : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
                      Activity Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ACTIVITY_FILTERS.map((a) => (
                        <button
                          key={a}
                          onClick={() => setActivity(a)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            activity === a
                              ? "bg-forest-700 text-white border-forest-700"
                              : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300"
                          }`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Generate custom plan CTA */}
            {searchParams.location && (
              <div className="bg-gradient-to-r from-forest-800 to-forest-900 rounded-2xl p-5 mb-6 text-white flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-lg">
                    Want a custom plan for {searchParams.location}?
                  </p>
                  <p className="text-forest-300 text-sm mt-0.5">
                    Get an AI-generated itinerary tailored to your preferences
                  </p>
                </div>
                <button
                  onClick={() => navigate("/itinerary", { state: { prefill: searchParams } })}
                  className="flex-shrink-0 bg-earth-500 hover:bg-earth-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Generate Plan →
                </button>
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader className="w-8 h-8 animate-spin text-forest-600 mx-auto mb-3" />
                  <p className="text-stone-500 text-sm">Loading adventures...</p>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🏕️</div>
                <p className="text-stone-600 font-medium">No adventures found</p>
                <p className="text-stone-400 text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((adventure) => (
                  <AdventureCard
                    key={adventure.id}
                    adventure={adventure}
                    searchParams={searchParams}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden xl:block w-72 space-y-6 flex-shrink-0">
            <WeatherWidget location={searchParams.location || "Manali"} />

            {/* Quick stats */}
            <div className="bg-white rounded-2xl p-5 border border-stone-100">
              <h3 className="font-display font-bold text-stone-800 mb-4">
                Trip Summary
              </h3>
              <div className="space-y-3">
                {searchParams.location && (
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Destination</span>
                    <span className="font-medium text-stone-800">{searchParams.location}</span>
                  </div>
                )}
                {searchParams.days && (
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Duration</span>
                    <span className="font-medium text-stone-800">{searchParams.days} days</span>
                  </div>
                )}
                {searchParams.budget && (
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Budget</span>
                    <span className="font-medium text-forest-700">₹{searchParams.budget}</span>
                  </div>
                )}
                {searchParams.activities?.length > 0 && (
                  <div className="text-sm">
                    <span className="text-stone-500 block mb-1.5">Activities</span>
                    <div className="flex flex-wrap gap-1">
                      {searchParams.activities.map((a) => (
                        <span key={a} className="tag-pill bg-forest-50 text-forest-700 text-[11px]">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
