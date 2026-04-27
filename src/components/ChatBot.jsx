import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { chatWithAI } from "../utils/api";

const GREETING = "Hey! I'm your WildPath AI guide. Ask me to compare destinations, tune a route to your budget, build a packing list, explain weather risks, or turn a rough weekend idea into a polished adventure plan.";

function TypewriterText({ text }) {
  const [visibleText, setVisibleText] = useState(text);

  useEffect(() => {
    setVisibleText("");
    const step = Math.max(1, Math.ceil(text.length / 90));
    let index = 0;
    const timer = window.setInterval(() => {
      index = Math.min(text.length, index + step);
      setVisibleText(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, 18);

    return () => window.clearInterval(timer);
  }, [text]);

  return <>{visibleText}</>;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await chatWithAI({ message: text });
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: res.data.data.response },
      ]);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Sorry, I couldn't connect right now. Please try again!";
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: errorMsg },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const quickQuestions = [
    "Best treks in Himalayas?",
    "What gear for camping?",
    "Safety tips for rafting?",
  ];

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className={`chat-ripple fixed bottom-6 right-6 z-40 w-14 h-14 bg-sunlight-700 text-white rounded-full shadow-lg hover:bg-sunlight-600 transition-all flex items-center justify-center ${open ? "hidden" : "flex"}`}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-earth-500 rounded-full text-[9px] font-bold flex items-center justify-center">
          AI
        </span>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] glass rounded-lg shadow-2xl border border-white/60 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-sunlight-900/90 text-white border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-sunlight-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm">WildPath AI</div>
                <div className="flex items-center gap-1 text-[10px] text-sunlight-300">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Terrain, gear, weather
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[340px] min-h-[200px] nature-bg">
            {messages.map((msg, i) => (
              <motion.div
                key={`${msg.role}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "bot" ? "bg-sunlight-100" : "bg-stone-200"}`}>
                  {msg.role === "bot"
                    ? <Bot className="w-3.5 h-3.5 text-sunlight-700" />
                    : <User className="w-3.5 h-3.5 text-stone-600" />
                  }
                </div>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "bot"
                    ? "bg-white/60 backdrop-blur-md border border-white/70 text-stone-800 rounded-tl-none shadow-sm"
                    : "bg-earth-600 text-white rounded-tr-none shadow-sm"
                }`}>
                  {msg.role === "bot" && i === messages.length - 1
                    ? <TypewriterText text={msg.text} />
                    : msg.text}
                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-sunlight-100 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-sunlight-700" />
                </div>
                <div className="bg-white/60 backdrop-blur-md border border-white/70 px-4 py-3 rounded-2xl rounded-tl-none w-44">
                  <div className="shimmer-line h-3 w-full rounded-full mb-2" />
                  <div className="shimmer-line h-3 w-2/3 rounded-full" />
                </div>
              </div>
            )}

            {/* Quick questions (only at start) */}
            {messages.length === 1 && !loading && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] text-stone-400 uppercase tracking-wider">Quick questions</p>
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); }}
                  className="block w-full text-left text-xs px-3 py-2 bg-white/60 backdrop-blur-sm text-sunlight-700 rounded-xl hover:bg-sunlight-100 transition-colors border border-white/70"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/60 bg-white/50">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about adventures..."
                rows={1}
                className="flex-1 resize-none text-sm border border-white/70 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sunlight-500 focus:border-transparent bg-white/80"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="primary-glow w-10 h-10 bg-sunlight-700 text-white rounded-xl flex items-center justify-center hover:bg-sunlight-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
