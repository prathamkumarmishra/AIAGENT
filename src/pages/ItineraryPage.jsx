import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapPin, Calendar, Wallet, Zap, Download, Bookmark,
  ChevronDown, ChevronUp, Shield, Backpack, Clock,
  DollarSign, Star, Loader, ArrowLeft, CheckCircle
} from "lucide-react";
import { generatePlan, saveTrip } from "../utils/api";
import { useAuth } from "../hooks/useAuth";
import WeatherWidget from "../components/WeatherWidget";

const ACTIVITIES = [
  { label: "Trekking", icon: "🥾" },
  { label: "Camping", icon: "⛺" },
  { label: "Cycling", icon: "🚵" },
  { label: "River Rafting", icon: "🛶" },
  { label: "Rock Climbing", icon: "🧗" },
  { label: "Bird Watching", icon: "🦅" },
  { label: "Scuba Diving", icon: "🤿" },
  { label: "Skiing", icon: "⛷️" },
];

export default function ItineraryPage() {
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const prefill = routerLocation.state?.prefill || {};

  const [form, setForm] = useState({
    location: prefill.location || "",
    budget: prefill.budget || "",
    days: prefill.days || "",
    activities: prefill.activities || [],
  });
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [expandedDay, setExpandedDay] = useState(0);
  const itineraryRef = useRef(null);

  const toggleActivity = (act) => {
    setForm((prev) => ({
      ...prev,
      activities: prev.activities.includes(act)
        ? prev.activities.filter((a) => a !== act)
        : [...prev.activities, act],
    }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setItinerary(null);
    setSaved(false);
    try {
      const res = await generatePlan(form);
      setItinerary(res.data.data);
      setTimeout(() => {
        itineraryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate plan. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      await saveTrip({
        name: itinerary.title,
        location: form.location,
        budget: form.budget,
        duration: form.days,
        activities: form.activities,
        itinerary,
      });
      setSaved(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = () => window.print();

  const difficultyColor = {
    Easy: "text-green-600 bg-green-50",
    Moderate: "text-yellow-600 bg-yellow-50",
    Hard: "text-red-600 bg-red-50",
  };

  return (
    <div className="pt-20 min-h-screen bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-800 mb-6 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm sticky top-24">
              <h2 className="font-display font-bold text-xl text-stone-900 mb-5">
                Generate AI Itinerary
              </h2>

              <form onSubmit={handleGenerate} className="space-y-4">
                {/* Location */}
                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
                    Destination
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="e.g. Manali, Himachal Pradesh"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                      required
                    />
                  </div>
                </div>

                {/* Days */}
                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
                    Duration (Days)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="number"
                      min="1"
                      max="14"
                      placeholder="e.g. 3"
                      value={form.days}
                      onChange={(e) => setForm({ ...form, days: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                      required
                    />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
                    Budget (₹)
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="e.g. 15000"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                      required
                    />
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
                    Activities
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ACTIVITIES.map(({ label, icon }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => toggleActivity(label)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                          form.activities.includes(label)
                            ? "bg-forest-700 text-white border-forest-700"
                            : "bg-stone-50 text-stone-600 border-stone-200 hover:border-forest-400"
                        }`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-forest-700 text-white py-3 rounded-xl font-semibold text-sm hover:bg-forest-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Crafting your plan...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Generate with AI
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Weather */}
            {form.location && <WeatherWidget location={form.location} />}
          </div>

          {/* Itinerary Output */}
          <div className="lg:col-span-2" ref={itineraryRef}>
            {loading && (
              <div className="bg-white rounded-2xl p-12 border border-stone-100 text-center animate-fade-in">
                <div className="w-16 h-16 bg-forest-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader className="w-8 h-8 text-forest-600 animate-spin" />
                </div>
                <h3 className="font-display font-bold text-xl text-stone-900 mb-2">
                  AI is crafting your adventure...
                </h3>
                <p className="text-stone-500 text-sm">
                  Analyzing {form.location}, weather patterns, and your preferences
                </p>
                <div className="flex justify-center gap-1.5 mt-6">
                  <span className="w-2.5 h-2.5 bg-forest-400 rounded-full dot-1" />
                  <span className="w-2.5 h-2.5 bg-forest-400 rounded-full dot-2" />
                  <span className="w-2.5 h-2.5 bg-forest-400 rounded-full dot-3" />
                </div>
              </div>
            )}

            {!loading && !itinerary && (
              <div className="bg-white rounded-2xl p-12 border border-stone-100 text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="font-display font-bold text-xl text-stone-900 mb-2">
                  Ready to Plan Your Adventure?
                </h3>
                <p className="text-stone-500 text-sm max-w-sm mx-auto">
                  Fill in the form and let our AI generate a personalized outdoor adventure itinerary for you.
                </p>
              </div>
            )}

            {itinerary && (
              <div className="space-y-6 animate-fade-in">
                {/* Header card */}
                <div className="bg-gradient-to-br from-forest-800 to-forest-900 rounded-2xl p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-forest-300 text-xs uppercase tracking-widest mb-1">AI Generated Plan</p>
                      <h2 className="font-display font-bold text-2xl">{itinerary.title}</h2>
                      <div className="flex items-center gap-2 mt-2 text-forest-300 text-sm">
                        <MapPin className="w-3.5 h-3.5" />
                        {itinerary.location}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrint}
                        className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors no-print"
                        title="Print"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {user && (
                        <button
                          onClick={handleSave}
                          disabled={saved}
                          className={`p-2 rounded-xl transition-colors no-print ${
                            saved
                              ? "bg-green-500 text-white"
                              : "bg-white/10 hover:bg-white/20"
                          }`}
                          title="Save Trip"
                        >
                          {saved ? <CheckCircle className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { icon: <DollarSign className="w-4 h-4" />, label: "Total Cost", value: itinerary.total_estimated_cost },
                      { icon: <Calendar className="w-4 h-4" />, label: "Duration", value: `${form.days} Days` },
                      { icon: <Star className="w-4 h-4" />, label: "Difficulty", value: itinerary.difficulty_level || "Moderate" },
                      { icon: <Clock className="w-4 h-4" />, label: "Best Time", value: itinerary.best_time_to_visit?.split(" ").slice(0, 2).join(" ") || "Year-round" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white/10 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 text-forest-300 text-xs mb-1">
                          {stat.icon}
                          {stat.label}
                        </div>
                        <div className="font-semibold text-sm">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Day-wise plan */}
                <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-stone-100">
                    <h3 className="font-display font-bold text-lg text-stone-900">Day-wise Itinerary</h3>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {itinerary.days?.map((day, i) => (
                      <div key={day.day} className="p-5">
                        <button
                          onClick={() => setExpandedDay(expandedDay === i ? -1 : i)}
                          className="w-full flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-forest-700 text-white rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">
                              D{day.day}
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-stone-900 text-sm">Day {day.day}</div>
                              <div className="text-stone-500 text-xs">{day.activities?.slice(0, 2).join(" · ")}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-forest-700 font-semibold text-sm">{day.cost}</span>
                            {expandedDay === i
                              ? <ChevronUp className="w-4 h-4 text-stone-400" />
                              : <ChevronDown className="w-4 h-4 text-stone-400" />
                            }
                          </div>
                        </button>

                        {expandedDay === i && (
                          <div className="mt-4 ml-13 animate-fade-in">
                            <p className="text-stone-600 text-sm leading-relaxed mb-3 ml-[52px]">
                              {day.plan}
                            </p>
                            <div className="ml-[52px] flex flex-wrap gap-1.5">
                              {day.activities?.map((act) => (
                                <span key={act} className="tag-pill bg-earth-100 text-earth-700 border border-earth-200 text-[11px]">
                                  {act}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grid cards */}
                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Packing list */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Backpack className="w-5 h-5 text-forest-700" />
                      <h3 className="font-display font-bold text-stone-900">Packing List</h3>
                    </div>
                    <ul className="space-y-2">
                      {itinerary.packing_list?.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-stone-600">
                          <CheckCircle className="w-4 h-4 text-forest-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Safety tips */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-earth-600" />
                      <h3 className="font-display font-bold text-stone-900">Safety Tips</h3>
                    </div>
                    <ul className="space-y-2">
                      {itinerary.safety_tips?.map((tip) => (
                        <li key={tip} className="flex items-start gap-2 text-sm text-stone-600">
                          <span className="w-4 h-4 rounded-full bg-earth-100 text-earth-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">!</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Activities & Highlights */}
                {itinerary.activities?.length > 0 && (
                  <div className="bg-white rounded-2xl p-5 border border-stone-100">
                    <h3 className="font-display font-bold text-stone-900 mb-3">Recommended Activities</h3>
                    <div className="flex flex-wrap gap-2">
                      {itinerary.activities.map((act) => (
                        <span key={act} className="tag-pill bg-forest-50 text-forest-700 border border-forest-100 text-sm py-1.5 px-4">
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Best time */}
                <div className="bg-earth-50 border border-earth-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-earth-600" />
                    <span className="font-semibold text-earth-800 text-sm">Best Time to Visit</span>
                  </div>
                  <p className="text-earth-700 text-sm">{itinerary.best_time_to_visit}</p>
                </div>

                {/* Fitness required */}
                {itinerary.fitness_required && (
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
                    <span className="font-semibold text-stone-800 text-sm block mb-1">Fitness Requirement</span>
                    <p className="text-stone-600 text-sm">{itinerary.fitness_required}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
