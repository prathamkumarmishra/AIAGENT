const axios = require("axios");

// @desc    Get weather for a location
// @route   GET /api/weather?location=Manali
// @access  Public
const getWeather = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ success: false, message: "Location is required" });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === "your_openweather_api_key_here") {
      // Return mock weather data if no API key
      const mockWeather = getMockWeather(location);
      return res.json({ success: true, data: mockWeather, mock: true });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`
    );

    const weather = response.data;
    const formattedWeather = {
      location: weather.name,
      country: weather.sys.country,
      temperature: Math.round(weather.main.temp),
      feelsLike: Math.round(weather.main.feels_like),
      humidity: weather.main.humidity,
      description: weather.weather[0].description,
      icon: weather.weather[0].icon,
      windSpeed: weather.wind.speed,
      visibility: weather.visibility / 1000,
      condition: weather.weather[0].main,
      adventureWarning: getAdventureWarning(weather),
    };

    res.json({ success: true, data: formattedWeather });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ success: false, message: "Location not found" });
    }
    if (error.response?.status === 401) {
      const mockWeather = getMockWeather(req.query.location);
      return res.json({ success: true, data: mockWeather, mock: true });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdventureWarning = (weather) => {
  const warnings = [];
  if (weather.wind.speed > 10) warnings.push("⚠️ High winds - be cautious");
  if (weather.main.temp < 5) warnings.push("🧊 Very cold - carry extra layers");
  if (weather.main.temp > 38) warnings.push("🔥 Extreme heat - stay hydrated");
  if (weather.weather[0].main === "Rain") warnings.push("🌧️ Rain expected - carry rain gear");
  if (weather.weather[0].main === "Snow") warnings.push("❄️ Snow conditions - special gear required");
  if (weather.weather[0].main === "Thunderstorm") warnings.push("⛈️ Thunderstorm - avoid exposed trails");
  return warnings.length > 0 ? warnings : ["✅ Good conditions for adventure!"];
};

const getMockWeather = (location) => {
  const conditions = [
    { condition: "Clear", description: "clear sky", temp: 22, humidity: 45 },
    { condition: "Clouds", description: "partly cloudy", temp: 18, humidity: 60 },
    { condition: "Rain", description: "light rain", temp: 15, humidity: 80 },
  ];
  const random = conditions[Math.floor(Math.random() * conditions.length)];

  return {
    location: location,
    country: "IN",
    temperature: random.temp,
    feelsLike: random.temp - 2,
    humidity: random.humidity,
    description: random.description,
    icon: "01d",
    windSpeed: 3.5,
    visibility: 10,
    condition: random.condition,
    adventureWarning: ["✅ Good conditions for adventure! (Demo data - add OpenWeather API key for real data)"],
  };
};

module.exports = { getWeather };
