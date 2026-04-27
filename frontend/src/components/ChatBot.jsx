import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { chatWithAI } from "../utils/api";

const GREETING = "Hey! I'm your WildPath AI guide 🏕️ Ask me anything about outdoor adventures, gear recommendations, safety tips, or help planning your next trek!";

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
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, I couldn't connect right now. Please try again!" },
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
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 bg-forest-700 text-white rounded-full shadow-lg hover:bg-forest-600 transition-all flex items-center justify-center ${open ? "hidden" : "flex"}`}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-earth-500 rounded-full text-[9px] font-bold flex items-center justify-center">
          AI
        </span>
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col animate-slide-up overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-forest-800 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-forest-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm">WildPath AI</div>
                <div className="flex items-center gap-1 text-[10px] text-forest-300">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Always online
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[340px] min-h-[200px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "bot" ? "bg-forest-100" : "bg-stone-200"}`}>
                  {msg.role === "bot"
                    ? <Bot className="w-3.5 h-3.5 text-forest-700" />
                    : <User className="w-3.5 h-3.5 text-stone-600" />
                  }
                </div>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "bot"
                    ? "bg-stone-100 text-stone-800 rounded-tl-none"
                    : "bg-forest-700 text-white rounded-tr-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-forest-100 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-forest-700" />
                </div>
                <div className="bg-stone-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <span className="w-2 h-2 bg-stone-400 rounded-full dot-1" />
                  <span className="w-2 h-2 bg-stone-400 rounded-full dot-2" />
                  <span className="w-2 h-2 bg-stone-400 rounded-full dot-3" />
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
                    className="block w-full text-left text-xs px-3 py-2 bg-forest-50 text-forest-700 rounded-xl hover:bg-forest-100 transition-colors border border-forest-100"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-stone-100">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about adventures..."
                rows={1}
                className="flex-1 resize-none text-sm border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-forest-700 text-white rounded-xl flex items-center justify-center hover:bg-forest-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
