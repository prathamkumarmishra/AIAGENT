import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ResultsPage from "./pages/ResultsPage";
import ItineraryPage from "./pages/ItineraryPage";
import MapPage from "./pages/MapPage";
import MyTripsPage from "./pages/MyTripsPage";
import ChatBot from "./components/ChatBot";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#faf8f5]">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/itinerary" element={<ItineraryPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/my-trips" element={<MyTripsPage />} />
          </Routes>
          <ChatBot />
        </div>
      </Router>
    </AuthProvider>
  );
}
