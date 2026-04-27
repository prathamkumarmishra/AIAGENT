import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Mountain, Search, MapPin, Calendar, Wallet,
  Compass, Tent, Bike, Waves, ChevronRight, Star, Shield, Sparkles, Route, CloudSun, Activity, Clock3
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

const HERO_STATS = [
  { value: "500+", label: "curated wild routes" },
  { value: "42k", label: "AI plans generated" },
  { value: "4.8", label: "traveler rating" },
];

const HERO_SIGNAL_CARDS = [
  {
    icon: Shield,
    title: "Safety Layer",
    text: "Weather and route caution signals adapt to your selected activities.",
  },
  {
    icon: Route,
    title: "Flow Engine",
    text: "Daily pacing stays realistic with better energy and recovery balance.",
  },
];

const HERO_PULSE = [
  { label: "Weather sync", value: "Live" },
  { label: "Route confidence", value: "94%" },
  { label: "Packing coverage", value: "Complete" },
  { label: "Budget fit", value: "On target" },
];

const HERO_WINDOW = [
  "Sunrise trek window: 5:20 AM to 8:10 AM",
  "River activity preference: low-wind slots",
  "Contingency plan prepared for rain shifts",
];

const JOURNEY_STEPS = [
  {
    icon: Compass,
    title: "Tell WildPath the mood",
    text: "Choose the destination, pace, budget, and activities you actually want. The planner reads the trip like a brief, not a form.",
  },
  {
    icon: CloudSun,
    title: "Blend terrain with weather",
    text: "Weather, altitude, seasonality, route style, and safety warnings come together before the itinerary is shaped.",
  },
  {
    icon: Route,
    title: "Receive a polished field plan",
    text: "Get a day-by-day adventure plan with activities, packing notes, budget guidance, and practical safety context.",
  },
];

const SPOTLIGHTS = [
  {
    title: "Himalayan ridge mornings",
    text: "Soft starts, high-altitude pacing, warm gear reminders, and photo stops placed where the light is best.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    tag: "Alpine Trek",
  },
  {
    title: "River rush weekends",
    text: "Rafting windows, safe transfer timing, dry bags, recovery meals, and a calmer evening built into the plan.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    tag: "Whitewater",
  },
  {
    title: "sunlight camp rituals",
    text: "Camp setup, low-impact travel, night-sky pauses, trail snacks, and backup plans when the weather turns.",
    image: "https://images.unsplash.com/photo-1445307806294-bff7f67ff225?auto=format&fit=crop&w=900&q=80",
    tag: "Campcraft",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
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
    <div className="pt-16 app-surface">
      {/* HERO */}
      <section ref={heroRef} className="min-h-[92vh] flex items-center relative overflow-hidden bg-sunlight-900">
        <motion.video
          className="absolute inset-0 h-[115%] w-full object-cover"
          style={{ y: videoY }}
          src="https://www.pexels.com/download/video/11197364/"
          poster="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sunlight-950/90 via-sunlight-900/55 to-earth-800/35" />
        <div className="absolute inset-0 topographic opacity-40" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#eef3ef] to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-start">
            {/* Left — Copy */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-white space-y-6 pt-2"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-sunlight-200">
                <Sparkles className="w-4 h-4 text-earth-200" />
                Modern Alpine AI Planning
              </div>
              <h1 className="text-5xl lg:text-6xl font-display font-bold leading-tight">
                Plan the kind of trip
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sunlight-300 via-white to-earth-200">
                  you can already feel
                </span>
              </h1>
              <p className="text-sunlight-100/85 text-lg leading-relaxed max-w-xl">
                WildPath turns a loose adventure idea into a calm, cinematic field plan. It balances terrain, weather, budget, safety, packing, and route flow so your trip feels designed before you even leave home.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-sunlight-200">
                {["AI-crafted pacing", "Weather-aware safety", "Interactive route view", "Budget-smart days"].map((f) => (
                  <span key={f} className="bg-white/10 border border-white/15 px-3 py-1.5 rounded-full">{f}</span>
                ))}
              </div>

              <div className="grid sm:grid-cols-[1.2fr_0.8fr] gap-4 max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="glass depth-card rounded-lg p-4 border border-white/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-sunlight-200">
                      <Activity className="w-3.5 h-3.5" />
                      Expedition Pulse
                    </div>
                    <span className="text-[11px] px-2 py-1 rounded-full bg-sunlight-500/25 text-sunlight-100 border border-sunlight-300/30">
                      Live
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {HERO_PULSE.map((item) => (
                      <div key={item.label} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">
                        <div className="text-[11px] text-sunlight-100/70">{item.label}</div>
                        <div className="text-sm font-bold text-white mt-1">{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 space-y-2">
                    {HERO_WINDOW.map((line) => (
                      <div key={line} className="text-xs text-sunlight-100/80 flex items-start gap-2">
                        <Clock3 className="w-3.5 h-3.5 mt-0.5 text-earth-200 flex-shrink-0" />
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <div className="space-y-3">
                  {HERO_SIGNAL_CARDS.map(({ icon: Icon, title, text }, index) => (
                    <motion.div
                      key={title}
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                      className="glass rounded-lg p-4 border border-white/20"
                    >
                      <div className="w-9 h-9 rounded-xl bg-earth-500/85 text-white flex items-center justify-center mb-3">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-display text-base font-bold">{title}</h3>
                      <p className="text-xs text-sunlight-100/75 mt-1 leading-relaxed">{text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-2xl pt-1">
                {HERO_STATS.map((stat) => (
                  <div key={stat.label} className="glass rounded-xl px-4 py-3 border border-white/20">
                    <div className="font-display text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-sunlight-100/70 leading-snug">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="perspective-stage"
            >
              <div className="glass depth-card tilt-3d float-depth rounded-lg p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="section-kicker mb-2">AI Command Deck</p>
                    <h2 className="font-display font-bold text-2xl text-stone-900">
                      Build the first draft
                    </h2>
                    <p className="text-sm text-stone-500 mt-1">
                      Give WildPath the essentials and let it shape a trip with rhythm, safety, and a little wonder.
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-sunlight-900 text-white flex items-center justify-center shadow-lg">
                    <Compass className="w-6 h-6" />
                  </div>
                </div>

                <form onSubmit={handleSearch} className="space-y-4">
                {/* Location */}
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Where do you want to go? (e.g. Manali)"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sunlight-500 bg-white/80"
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
                      className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sunlight-500 bg-white/80"
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
                      className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sunlight-500 bg-white/80"
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
                            ? "bg-sunlight-700 text-white border-sunlight-700"
                            : "bg-white text-stone-600 border-stone-200 hover:border-sunlight-400"
                        }`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="primary-glow w-full bg-sunlight-700 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-sunlight-600 transition-colors flex items-center justify-center gap-2 group"
                >
                  <Search className="w-4 h-4" />
                  Find My Adventure
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                </form>
                <div className="mt-5 border-t border-white/70 pt-4 space-y-3">
                  {[
                    { label: "Terrain match", value: "High confidence" },
                    { label: "Weather layer", value: "Live-ready" },
                    { label: "Trip personality", value: "Adventure-first" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-xs">
                      <span className="text-stone-500">{row.label}</span>
                      <span className="font-semibold text-sunlight-800">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 topographic">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-kicker justify-center mb-3">Designed For The Trail</p>
            <h2 className="text-4xl font-display font-bold text-stone-900">
              A planner that feels like a calm expedition lead
            </h2>
            <p className="text-stone-500 mt-3 max-w-xl mx-auto">
              The interface stays beautiful, but the useful details stay close: weather checks, budgets, safety prompts, map context, and AI-generated day plans.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "AI Itinerary Generator",
                desc: "The planner shapes detailed day-by-day routes around your destination, time, budget, and preferred activity style.",
              },
              {
                icon: "🌦️",
                title: "Live Weather Insights",
                desc: "Live weather summaries pair with outdoor-specific warnings so you can understand conditions before committing.",
              },
              {
                icon: "🗺️",
                title: "Interactive Maps",
                desc: "Explore destinations with filtered map markers, activity context, and fast jumps into planning.",
              },
              {
                icon: "💰",
                title: "Smart Budget Planning",
                desc: "Trip planning stays grounded with cost expectations across travel, food, stays, and activities.",
              },
              {
                icon: "🛡️",
                title: "Safety First",
                desc: "Curated safety tips, fitness notes, packing lists, and emergency-minded reminders travel with every plan.",
              },
              {
                icon: "📌",
                title: "Save & Review Trips",
                desc: "Save finished itineraries, revisit the highlights, and keep a growing archive of places you want to return to.",
              },
            ].map((f) => (
              <motion.div
                key={f.title}
                whileHover={{ y: -5, scale: 1.01 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="glass-card p-6 rounded-lg border border-white/70 transition-all group"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-display font-bold text-lg text-stone-900 mb-2">{f.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="py-20 bg-sunlight-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
            <div>
              <p className="section-kicker mb-3 text-earth-200">How It Thinks</p>
              <h2 className="text-4xl font-display font-bold leading-tight">
                From spark to itinerary in three graceful moves
              </h2>
              <p className="text-sunlight-100/75 mt-4 leading-relaxed">
                WildPath is built to reduce the anxious parts of planning while keeping the inspiring parts alive. It asks for the essentials, reads the conditions, and returns a plan that feels practical, scenic, and human.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  { icon: Tent, label: "Camp" },
                  { icon: Bike, label: "Ride" },
                  { icon: Waves, label: "River" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
                    <Icon className="w-5 h-5 mx-auto text-earth-200 mb-2" />
                    <span className="text-xs text-sunlight-100/75">{label} modes</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {JOURNEY_STEPS.map(({ icon: Icon, title, text }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="glass rounded-lg p-5 border-white/15"
                >
                  <div className="flex gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-earth-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-earth-200 font-bold uppercase tracking-widest mb-1">
                        Step {index + 1}
                      </div>
                      <h3 className="font-display font-bold text-xl">{title}</h3>
                      <p className="text-sm text-sunlight-100/75 mt-1 leading-relaxed">{text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SPOTLIGHTS */}
      <section className="py-20 app-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
            <div>
              <p className="section-kicker mb-3">Adventure Moods</p>
              <h2 className="text-4xl font-display font-bold text-stone-900">
                Plans with texture, not templates
              </h2>
            </div>
            <p className="text-stone-500 max-w-xl leading-relaxed">
              Every itinerary should feel like it belongs to the terrain. WildPath adds small details like pacing, recovery windows, light, food timing, and gear reminders to make each plan feel lived in.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {SPOTLIGHTS.map((item) => (
              <motion.article
                key={item.title}
                whileHover={{ y: -6, rotateX: 1.5, rotateY: -1.5 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="depth-card rounded-lg overflow-hidden bg-white border border-white/70"
              >
                <div className="h-56 overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                </div>
                <div className="p-6">
                  <span className="tag-pill bg-earth-100 text-earth-700 border border-earth-200 mb-4">{item.tag}</span>
                  <h3 className="font-display font-bold text-xl text-stone-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{item.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 topographic">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-kicker justify-center mb-3">Field Notes</p>
          <h2 className="text-3xl font-display font-bold text-center text-stone-900 mb-10">
            Adventurers Love WildPath
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <motion.div
                key={t.name}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="glass-card p-6 rounded-lg shadow-sm border border-white/70"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sunlight-700 text-white flex items-center justify-center font-bold text-sm">
                    {t.avatar}
                  </div>
                  <span className="text-sm font-medium text-stone-800">{t.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-stone-900 text-stone-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Mountain className="w-5 h-5 text-sunlight-400" />
            <span className="font-display font-bold text-white text-lg">WildPath</span>
          </div>
          <p className="text-sm">AI-Powered Outdoor Adventure Planner • Built with ❤️ for explorers</p>
          <p className="text-xs mt-2 text-stone-600">© 2025 WildPath. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
