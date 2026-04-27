import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mountain, Menu, X, User, LogOut, Map, Bookmark } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: "Explore", path: "/results" },
    { label: "Map View", path: "/map" },
    ...(user ? [{ label: "My Trips", path: "/my-trips" }] : []),
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-stone-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-forest-700 rounded-xl flex items-center justify-center group-hover:bg-forest-600 transition-colors">
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-stone-900">
                Wild<span className="text-forest-600">Path</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? "bg-forest-700 text-white"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-stone-600 font-medium">
                    Hey, {user.name?.split(" ")[0]} 👋
                  </span>
                  <button
                    onClick={logoutUser}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="flex items-center gap-2 bg-forest-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-forest-600 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white/95 backdrop-blur-sm px-4 py-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? "bg-forest-700 text-white"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <button
                onClick={() => { setAuthOpen(true); setMenuOpen(false); }}
                className="w-full bg-forest-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium"
              >
                Sign In / Register
              </button>
            )}
            {user && (
              <button
                onClick={() => { logoutUser(); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
