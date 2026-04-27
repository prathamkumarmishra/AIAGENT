import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { MapPin, Search, Navigation, Mountain } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const DESTINATIONS = [
  { id: 1, name: "Manali", lat: 32.2396, lng: 77.1887, type: "Mountain", activities: ["Trekking", "Skiing", "Camping"], rating: 4.8 },
  { id: 2, name: "Rishikesh", lat: 30.0869, lng: 78.2676, type: "River", activities: ["Rafting", "Bungee", "Yoga"], rating: 4.7 },
  { id: 3, name: "Coorg", lat: 12.3375, lng: 75.8069, type: "Forest", activities: ["Trekking", "Bird Watching"], rating: 4.6 },
  { id: 4, name: "Spiti Valley", lat: 32.2464, lng: 78.0337, type: "Desert", activities: ["Trekking", "Camping", "Motorcycling"], rating: 4.9 },
  { id: 5, name: "Andaman", lat: 11.7401, lng: 92.6586, type: "Beach", activities: ["Scuba", "Snorkeling", "Kayaking"], rating: 4.8 },
  { id: 6, name: "Valley of Flowers", lat: 30.7283, lng: 79.6050, type: "Alpine", activities: ["Trekking", "Photography"], rating: 4.7 },
  { id: 7, name: "Leh Ladakh", lat: 34.1526, lng: 77.5771, type: "High Altitude", activities: ["Trekking", "Motorcycling", "Camping"], rating: 4.9 },
  { id: 8, name: "Hampi", lat: 15.3350, lng: 76.4600, type: "Heritage", activities: ["Cycling", "Rock Climbing", "Hiking"], rating: 4.5 },
];

const typeColors = {
  Mountain: "#15803d",
  River: "#0284c7",
  Forest: "#65a30d",
  Desert: "#d97706",
  Beach: "#0891b2",
  Alpine: "#7c3aed",
  "High Altitude": "#dc2626",
  Heritage: "#b45309",
};

const createCustomIcon = (color) =>
  L.divIcon({
    className: "",
    html: `<div style="width:32px;height:32px;background:${color};border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

export default function MapPage() {
  const [selectedDest, setSelectedDest] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const types = ["All", ...new Set(DESTINATIONS.map((d) => d.type))];

  const filtered = DESTINATIONS.filter((d) => {
    const matchType = filter === "All" || d.type === filter;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.activities.some((a) => a.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchSearch;
  });

  return (
    <div className="pt-16 h-screen flex flex-col bg-[#faf8f5]">
      {/* Top bar */}
      <div className="flex-shrink-0 bg-white border-b border-stone-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 mr-2">
            <Mountain className="w-5 h-5 text-forest-700" />
            <span className="font-display font-bold text-stone-900">Adventure Map</span>
          </div>

          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  filter === t
                    ? "bg-forest-700 text-white border-forest-700"
                    : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <span className="text-xs text-stone-400 ml-auto">
            {filtered.length} destinations
          </span>
        </div>
      </div>

      {/* Map + Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 bg-white border-r border-stone-200 overflow-y-auto hidden md:block">
          <div className="p-3 space-y-2">
            {filtered.map((dest) => (
              <button
                key={dest.id}
                onClick={() => setSelectedDest(dest)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedDest?.id === dest.id
                    ? "bg-forest-50 border-forest-300"
                    : "bg-stone-50 border-stone-100 hover:border-stone-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: typeColors[dest.type] }}
                  />
                  <span className="font-semibold text-sm text-stone-900">{dest.name}</span>
                  <span className="ml-auto text-xs text-yellow-600">★ {dest.rating}</span>
                </div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                  {dest.type}
                </span>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {dest.activities.slice(0, 2).map((a) => (
                    <span key={a} className="text-[10px] bg-forest-50 text-forest-600 px-1.5 py-0.5 rounded-full">
                      {a}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={[22.9734, 78.6569]}
            zoom={5}
            style={{ width: "100%", height: "100%" }}
            className="z-10"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {filtered.map((dest) => (
              <Marker
                key={dest.id}
                position={[dest.lat, dest.lng]}
                icon={createCustomIcon(typeColors[dest.type])}
                eventHandlers={{ click: () => setSelectedDest(dest) }}
              >
                <Popup>
                  <div className="min-w-[160px]">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: typeColors[dest.type] }}
                      />
                      <strong className="text-stone-900">{dest.name}</strong>
                    </div>
                    <p className="text-xs text-stone-500 mb-2">{dest.type} Adventure</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {dest.activities.map((a) => (
                        <span key={a} className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                          {a}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs font-semibold text-yellow-600">★ {dest.rating}/5</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Selected destination panel */}
          {selectedDest && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 min-w-[280px] animate-slide-up">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: typeColors[selectedDest.type] }}
                  />
                  <h3 className="font-display font-bold text-stone-900">{selectedDest.name}</h3>
                </div>
                <span className="text-xs text-yellow-600 font-semibold">★ {selectedDest.rating}</span>
              </div>
              <p className="text-xs text-stone-500 mb-2">{selectedDest.type} Adventure Destination</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {selectedDest.activities.map((a) => (
                  <span key={a} className="tag-pill bg-forest-50 text-forest-700 border border-forest-100 text-[11px]">
                    {a}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <a
                  href={`/itinerary?location=${selectedDest.name}`}
                  onClick={(e) => { e.preventDefault(); window.location.href = `/itinerary`; }}
                  className="flex-1 bg-forest-700 text-white text-xs py-2 rounded-xl text-center font-medium hover:bg-forest-600 transition-colors"
                >
                  Plan Adventure
                </a>
                <button
                  onClick={() => setSelectedDest(null)}
                  className="px-3 py-2 text-stone-500 hover:text-stone-700 rounded-xl hover:bg-stone-100 text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-stone-200">
            <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-2">Legend</p>
            <div className="space-y-1.5">
              {Object.entries(typeColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs text-stone-600">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
