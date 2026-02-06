import { useState } from "react";
import TopNav from "../components/TopNav";

export default function AICoach() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text:
        "Hi! 👋 I’m your AI fitness coach. Ask me about workouts, nutrition, sleep, or stress management.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");

  const send = async () => {
    if (!input.trim()) return;

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { role: "user", text: input.trim(), time: now };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    // placeholder bot reply (next phase: call backend Gemini)
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: "Got it ✅ Next phase we’ll connect this to Gemini so you get real answers based on your health form + plans.",
          time: now,
        },
      ]);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0f172a,#020617)] text-white">
      <TopNav rightText="Dashboard" onRightClick={() => (window.location.href = "/dashboard")} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold">AI Fitness Coach</h1>
        <p className="text-white/70 mt-1">Your personal AI trainer is here to help 24/7</p>

        <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="h-[520px] p-5 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <Bubble key={idx} msg={msg} />
            ))}
          </div>

          <div className="p-4 border-t border-white/10 bg-black/20 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask me anything about fitness, nutrition, or wellness..."
              className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={send}
              className="px-5 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-fuchsia-500 text-black"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[70%] rounded-2xl px-4 py-3 border",
          isUser
            ? "bg-purple-500/20 border-purple-400/20"
            : "bg-white/10 border-white/10",
        ].join(" ")}
      >
        <div className="text-sm text-white/90 whitespace-pre-wrap">{msg.text}</div>
        <div className="text-[11px] text-white/50 mt-1">{msg.time}</div>
      </div>
    </div>
  );
}
