import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mountain, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../hooks/useAuth";
import { login, register, googleLogin as googleLoginApi } from "../utils/api";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { loginUser, registerUser, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      if (isLogin) {
        const res = await login(formData.email, formData.password);
        loginUser(res.data.data);
      } else {
        const res = await register(formData);
        registerUser(res.data.data);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      const res = await googleLoginApi(credentialResponse.credential);
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      setUser(res.data.data);
      navigate("/");
    } catch (err) {
      setError("Google Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-sunlight-50">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full topographic opacity-30" />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -right-20 w-96 h-96 bg-sunlight-200/40 rounded-full blur-3xl" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-20 -left-20 w-80 h-80 bg-earth-200/30 rounded-full blur-3xl" 
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1100px] grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl shadow-sunlight-900/10 overflow-hidden relative z-10 border border-white/50"
      >
        {/* Left Side - Visual */}
        <div className="hidden lg:block relative bg-sunlight-900 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80" 
            alt="Adventure" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-sunlight-950/90 via-sunlight-900/60 to-transparent" />
          
          <div className="relative h-full flex flex-col justify-between p-12 text-white">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-2xl">WildPath</span>
            </Link>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-sunlight-200">
                <Sparkles className="w-4 h-4 text-sunlight-300" />
                Join 42k+ global adventurers
              </div>
              <h2 className="text-5xl font-display font-bold leading-tight">
                Unlock the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunlight-300 to-white">
                  Golden Standard
                </span> <br />
                of Planning.
              </h2>
              <div className="space-y-4">
                {[
                  "Save unlimited AI itineraries",
                  "Access premium map layers",
                  "Weather-aware safety alerts",
                  "Custom packing lists for any terrain"
                ].map((text) => (
                  <div key={text} className="flex items-center gap-3 text-sunlight-100/90">
                    <CheckCircle2 className="w-5 h-5 text-sunlight-400" />
                    <span className="text-sm font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm text-sunlight-300/80">
              © 2025 WildPath AI. Built for the modern explorer.
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-display font-bold text-stone-900">
              {isLogin ? "Welcome Back" : "Create Adventure Account"}
            </h1>
            <p className="text-stone-500 mt-2">
              {isLogin 
                ? "Enter your details to access your saved wild routes." 
                : "Join WildPath and start planning your next epic journey."}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Social Login */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Login failed")}
                useOneTap
                theme="outline"
                shape="pill"
                width="100%"
                text={isLogin ? "signin_with" : "signup_with"}
              />
            </div>
          </div>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <span className="relative px-4 bg-white text-xs text-stone-400 uppercase tracking-widest font-bold">
              Or continue with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Arjun Mehta"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sunlight-500 focus:border-transparent transition-all"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sunlight-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-stone-700 uppercase">Password</label>
                {isLogin && (
                  <button type="button" className="text-xs font-bold text-sunlight-700 hover:text-sunlight-800 transition-colors">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sunlight-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="primary-glow w-full bg-sunlight-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-sunlight-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In to WildPath" : "Join the Expedition"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-stone-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-bold text-sunlight-800 hover:text-sunlight-900 underline underline-offset-4 decoration-sunlight-300"
              >
                {isLogin ? "Create Account" : "Sign In Now"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
