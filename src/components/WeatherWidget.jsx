import { useState, useEffect } from "react";
import { Thermometer, Wind, Droplets, Eye, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { getWeather } from "../utils/api";

const weatherIcons = {
  Clear: "☀️",
  Clouds: "⛅",
  Rain: "🌧️",
  Snow: "❄️",
  Thunderstorm: "⛈️",
  Drizzle: "🌦️",
  Mist: "🌫️",
  Fog: "🌁",
};

export default function WeatherWidget({ location }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;
    setLoading(true);
    setError(null);
    getWeather(location)
      .then((res) => setWeather(res.data.data))
      .catch(() => setError("Weather data unavailable"))
      .finally(() => setLoading(false));
  }, [location]);

  if (!location) return null;

  if (loading) {
    return (
      <div className="premium-panel rounded-lg p-5 text-white">
        <div className="shimmer-line h-4 rounded w-1/2 mb-3" />
        <div className="shimmer-line h-8 rounded w-1/3 mb-2" />
        <div className="shimmer-line h-3 rounded w-2/3" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-lg p-5 text-stone-500 text-sm text-center border border-white/70">
        {error}
      </div>
    );
  }

  if (!weather) return null;

  const icon = weatherIcons[weather.condition] || "🌤️";

  return (
    <motion.div
      whileHover={{ y: -5, rotateX: 1.5 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="premium-panel depth-card topographic rounded-lg p-5 text-white overflow-hidden relative"
    >
      <div className="relative">
        <p className="text-earth-200 text-xs font-bold uppercase tracking-widest mb-1">
          Weather in
        </p>
        <h3 className="font-display font-bold text-lg">{weather.location}</h3>

        <div className="flex items-center gap-4 mt-4 mb-4">
          <span className="text-5xl">{icon}</span>
          <div>
            <div className="text-4xl font-bold">{weather.temperature}°C</div>
            <div className="text-forest-300 text-sm capitalize mt-0.5">
              {weather.description}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/10 border border-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm">
            <Wind className="w-3.5 h-3.5 mx-auto mb-1 text-forest-300" />
            <div className="text-xs font-semibold">{weather.windSpeed} m/s</div>
            <div className="text-[10px] text-white/60">Wind</div>
          </div>
          <div className="bg-white/10 border border-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm">
            <Droplets className="w-3.5 h-3.5 mx-auto mb-1 text-forest-300" />
            <div className="text-xs font-semibold">{weather.humidity}%</div>
            <div className="text-[10px] text-white/60">Humidity</div>
          </div>
          <div className="bg-white/10 border border-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm">
            <Eye className="w-3.5 h-3.5 mx-auto mb-1 text-forest-300" />
            <div className="text-xs font-semibold">{weather.visibility} km</div>
            <div className="text-[10px] text-white/60">Visibility</div>
          </div>
        </div>

        {/* Warnings */}
        <div className="space-y-1">
          {weather.adventureWarning?.map((w, i) => (
            <div
              key={i}
              className={`text-xs px-3 py-2 rounded-lg ${
                w.includes("✅")
                  ? "bg-green-500/20 text-green-200"
                  : "bg-yellow-500/20 text-yellow-200"
              }`}
            >
              {w}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
