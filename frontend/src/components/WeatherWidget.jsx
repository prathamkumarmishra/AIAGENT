import { useState, useEffect } from "react";
import { Thermometer, Wind, Droplets, Eye, AlertTriangle } from "lucide-react";
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
      <div className="bg-gradient-to-br from-forest-800 to-forest-900 rounded-2xl p-5 text-white animate-pulse">
        <div className="h-4 bg-white/20 rounded w-1/2 mb-3" />
        <div className="h-8 bg-white/20 rounded w-1/3 mb-2" />
        <div className="h-3 bg-white/20 rounded w-2/3" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-stone-100 rounded-2xl p-5 text-stone-500 text-sm text-center">
        {error}
      </div>
    );
  }

  if (!weather) return null;

  const icon = weatherIcons[weather.condition] || "🌤️";

  return (
    <div className="bg-gradient-to-br from-forest-800 via-forest-900 to-stone-900 rounded-2xl p-5 text-white overflow-hidden relative">
      {/* Decorative blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative">
        <p className="text-forest-300 text-xs font-medium uppercase tracking-widest mb-1">
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
          <div className="bg-white/10 rounded-xl p-2.5 text-center">
            <Wind className="w-3.5 h-3.5 mx-auto mb-1 text-forest-300" />
            <div className="text-xs font-semibold">{weather.windSpeed} m/s</div>
            <div className="text-[10px] text-white/60">Wind</div>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 text-center">
            <Droplets className="w-3.5 h-3.5 mx-auto mb-1 text-forest-300" />
            <div className="text-xs font-semibold">{weather.humidity}%</div>
            <div className="text-[10px] text-white/60">Humidity</div>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 text-center">
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
    </div>
  );
}
