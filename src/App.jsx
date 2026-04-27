import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ResultsPage from "./pages/ResultsPage";
import ItineraryPage from "./pages/ItineraryPage";
import MapPage from "./pages/MapPage";
import MyTripsPage from "./pages/MyTripsPage";
import ChatBot from "./components/ChatBot";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/itinerary" element={<ItineraryPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/my-trips" element={<MyTripsPage />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen app-surface">
          <Navbar />
          <AnimatedRoutes />
          <ChatBot />
        </div>
      </Router>
    </AuthProvider>
  );
}
