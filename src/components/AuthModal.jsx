import { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { register, login } from "../utils/api";
import { useAuth } from "../hooks/useAuth";

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { loginUser } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fn = mode === "login" ? login : register;
      const payload = mode === "login"
        ? { email: form.email, password: form.password }
        : form;
      const res = await fn(payload);
      loginUser(res.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-forest-950/55 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative glass depth-card rounded-lg shadow-2xl w-full max-w-md p-8"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-stone-900">
            {mode === "login" ? "Welcome back" : "Join WildPath"}
          </h2>
          <p className="text-stone-500 mt-1 text-sm leading-relaxed">
            {mode === "login" ? "Sign in to keep your saved plans, field notes, and future routes close." : "Create an account to save itineraries and build your own adventure library."}
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-white/70 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white/80"
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-stone-400" />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-white/70 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white/80"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-stone-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-10 pr-10 py-3 border border-white/70 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white/80"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-stone-400 hover:text-stone-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primary-glow w-full bg-forest-700 text-white py-3 rounded-xl font-medium hover:bg-forest-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="text-forest-600 font-medium hover:underline"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
