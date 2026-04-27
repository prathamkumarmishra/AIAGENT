import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mountain, Search, MapPin, Calendar, Wallet,
  Compass, Tent, Bike, Waves, ChevronRight, Star
} from "lucide-react";

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

const TESTIMONIALS = [
  { name: "Arjun Mehta", rating: 5, text: "WildPath planned our Spiti trip perfectly. The AI knew exactly what we needed!", avatar: "A" },
  { name: "Priya Sharma", rating: 5, text: "Saved hours of research. Got a complete itinerary for Rishikesh in seconds.", avatar: "P" },
  { name: "Ravi Kumar", rating: 4, text: "The safety tips were spot on for our Himalayan trek. Highly recommended.", avatar: "R" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    location: "",
    budget: "",
    days: "",
    activities: [],
  });

  const toggleActivity = (act) => {
    setForm((prev) => ({
      ...prev,
      activities: prev.activities.includes(act)
        ? prev.activities.filter((a) => a !== act)
        : [...prev.activities, act],
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/results", { state: { searchParams: form } });
  };

  return (
    <div className="pt-16">
      {/* HERO */}
      <section className="hero-gradient min-h-[92vh] flex items-center relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        {/* Floating elements */}
        <div className="absolute top-20 right-10 text-6xl animate-float opacity-20">🏔️</div>
        <div className="absolute bottom-20 left-10 text-5xl animate-float opacity-20" style={{ animationDelay: "2s" }}>🌲</div>
        <div className="absolute top-40 left-1/4 text-4xl animate-float opacity-10" style={{ animationDelay: "4s" }}>⛺</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Copy */}
            <div className="text-white space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-forest-200">
                <Compass className="w-4 h-4" />
                AI-Powered Adventure Planning
              </div>
              <h1 className="text-5xl lg:text-6xl font-display font-bold leading-tight">
                Your Next
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-forest-300 to-earth-200">
                  Wild Adventure
                </span>
                Awaits
              </h1>
              <p className="text-forest-100/80 text-lg leading-relaxed max-w-md">
                Let AI craft the perfect outdoor adventure for you. From hidden treks to base camp setups — personalized, safe, and unforgettable.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-forest-200">
                {["🏕️ 500+ Destinations", "🤖 AI Itineraries", "🗺️ Live Map View", "⛅ Weather Alerts"].map((f) => (
                  <span key={f} className="bg-white/10 px-3 py-1.5 rounded-full">{f}</span>
                ))}
              </div>
            </div>

            {/* Right — Search Form */}
            <div className="glass rounded-3xl p-6 shadow-2xl animate-slide-up">
              <h2 className="font-display font-bold text-xl text-stone-900 mb-5">
                Plan Your Adventure
              </h2>

              <form onSubmit={handleSearch} className="space-y-4">
                {/* Location */}
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Where do you want to go? (e.g. Manali)"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white/80"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Days */}
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                    <input
                      type="number"
                      placeholder="Days"
                      min="1"
                      max="30"
                      value={form.days}
                      onChange={(e) => setForm({ ...form, days: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white/80"
                      required
                    />
                  </div>
                  {/* Budget */}
                  <div className="relative">
                    <Wallet className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Budget (₹)"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white/80"
                      required
                    />
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                    Select Activities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ACTIVITIES.map(({ label, icon }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => toggleActivity(label)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          form.activities.includes(label)
                            ? "bg-forest-700 text-white border-forest-700"
                            : "bg-white text-stone-600 border-stone-200 hover:border-forest-400"
                        }`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-forest-700 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-forest-600 transition-colors flex items-center justify-center gap-2 group"
                >
                  <Search className="w-4 h-4" />
                  Find My Adventure
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-display font-bold text-stone-900">
              Why Choose WildPath?
            </h2>
            <p className="text-stone-500 mt-3 max-w-xl mx-auto">
              From AI-generated itineraries to real-time weather alerts — we've got your adventure covered.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "AI Itinerary Generator",
                desc: "Claude AI crafts detailed day-by-day plans tailored to your budget, fitness level, and interests.",
              },
              {
                icon: "🌦️",
                title: "Live Weather Insights",
                desc: "Real-time weather data with adventure-specific warnings to keep you safe on the trail.",
              },
              {
                icon: "🗺️",
                title: "Interactive Maps",
                desc: "Visualize routes, nearby attractions, and key landmarks with our built-in map view.",
              },
              {
                icon: "💰",
                title: "Smart Budget Planning",
                desc: "Detailed cost breakdowns covering travel, food, stay, and activities within your budget.",
              },
              {
                icon: "🛡️",
                title: "Safety First",
                desc: "Curated safety tips, gear checklists, and emergency guidelines for every adventure.",
              },
              {
                icon: "📌",
                title: "Save & Review Trips",
                desc: "Save your planned itineraries, revisit them anytime, and share reviews with the community.",
              },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-2xl bg-stone-50 border border-stone-100 hover:border-forest-200 hover:bg-forest-50/30 transition-all group">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-display font-bold text-lg text-stone-900 mb-2">{f.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center text-stone-900 mb-10">
            Adventurers Love WildPath
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-forest-700 text-white flex items-center justify-center font-bold text-sm">
                    {t.avatar}
                  </div>
                  <span className="text-sm font-medium text-stone-800">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-stone-900 text-stone-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Mountain className="w-5 h-5 text-forest-400" />
            <span className="font-display font-bold text-white text-lg">WildPath</span>
          </div>
          <p className="text-sm">AI-Powered Outdoor Adventure Planner • Built with ❤️ for explorers</p>
          <p className="text-xs mt-2 text-stone-600">© 2025 WildPath. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
