"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages }),
      });
      const data = await res.json();
      setMessages([...newHistory, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#111", color: "#fff", padding: 16 }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", color: "#FBBF24", marginBottom: 24 }}>🤖 My AI Agent</h1>
        <div style={{ background: "#1F2937", borderRadius: 12, padding: 16, minHeight: 300, maxHeight: 400, overflowY: "auto", marginBottom: 16 }}>
          {messages.length === 0 && <p style={{ color: "#6B7280", textAlign: "center", marginTop: 32 }}>Mulai chat dengan AI Agent...</p>}
          {messages.map((msg, i) => (
            <div key={i} style={{ textAlign: msg.role === "user" ? "right" : "left", marginBottom: 12 }}>
              <span style={{ display: "inline-block", padding: "8px 14px", borderRadius: 12, background: msg.role === "user" ? "#FBBF24" : "#374151", color: msg.role === "user" ? "#111" : "#fff", maxWidth: "80%", fontSize: 14 }}>
                {msg.content}
              </span>
            </div>
          ))}
          {loading && <p style={{ color: "#9CA3AF", fontSize: 13 }}>⏳ Agent berpikir...</p>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ketik pesan..."
            style={{ flex: 1, background: "#1F2937", border: "1px solid #374151", borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14 }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{ background: "#FBBF24", color: "#111", fontWeight: "bold", padding: "12px 20px", borderRadius: 12, border: "none", cursor: "pointer" }}
          >
            Kirim
          </button>
        </div>
      </div>
    </main>
  );
        }
