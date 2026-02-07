import { useState } from "react";
import { auth } from "../services/firebase";
import TopNav from "../components/TopNav";

export default function Coach() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const user = auth.currentUser;
    if (!user) return alert("Not logged in");

    const userMsg = { role: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.uid,
        message: userMsg.text,
      }),
    });

    const data = await res.json();

 let aiText = "I'm here to help you 😊";

if (typeof data === "string") {
  try {
    const cleaned = data.replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    // handle all known keys
    aiText =
      parsed.message ||
      parsed.response ||
      parsed.reply ||
      aiText;
  } catch (e) {
    aiText = data;
  }
}
else if (data.reply) {
  aiText = typeof data.reply === "string"
    ? data.reply
    : data.reply.message || data.reply.response || aiText;
}
else if (data.message || data.response) {
  aiText = data.message || data.response;
}

// final safety guard
if (!aiText.trim()) {
  aiText = "Tell me a bit more — I’m listening 😊";
}



  setMessages((m) => [
    ...m,
    {
      role: "ai",
      text: aiText,
      suggestions: data.suggestions || [],
      encouragement: data.encouragement || null,
    },
  ]);
  ;

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <TopNav />

      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">AI Coach 🤖</h1>

        <div className="space-y-3 mb-4">
          {messages.map((m, i) => (
  <div
    key={i}
    className={`p-4 rounded-xl space-y-2 ${
      m.role === "user"
        ? "bg-green-500 text-black self-end"
        : "bg-zinc-800"
    }`}
  >
    {/* Main message */}
    <div>{m.text}</div>

    {/* Suggestions */}
    {m.suggestions && m.suggestions.length > 0 && (
      <ul className="list-disc pl-5 text-sm text-gray-300">
        {m.suggestions.map((s, idx) => (
          <li key={idx}>{s}</li>
        ))}
      </ul>
    )}

    {/* Encouragement */}
    {m.encouragement && (
      <div className="text-green-400 font-semibold">
        🌱 {m.encouragement}
      </div>
    )}
  </div>
))}

          {loading && <div className="text-gray-400">Thinking…</div>}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 rounded-lg bg-zinc-900 border border-zinc-700"
            placeholder="Ask about your workout or diet..."
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-green-500 text-black rounded-lg font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
