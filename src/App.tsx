import { useState } from "react";
import { sendMessage } from "./api";
import type { ChatMessage, ChatResponse } from "./types";

type DisplayMessage = ChatMessage & {
  meta?: Omit<ChatResponse, "reply">;
};

export default function App() {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const history: ChatMessage[] = messages.map(({ role, content }) => ({
      role,
      content,
    }));
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await sendMessage(text, history);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.reply,
          meta: {
            skill_used: response.skill_used,
            sources: response.sources,
            tool_calls: response.tool_calls,
          },
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Más allá del chat</h1>
        <p>Frontend de referencia del workshop — no se edita durante el taller.</p>
      </header>

      <main className="chat-window">
        {messages.length === 0 && (
          <div className="empty-state">Escribe un mensaje para empezar.</div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`bubble ${msg.role}`}>
            <div className="bubble-content">{msg.content}</div>
            {msg.meta && <ProcessPanel meta={msg.meta} />}
          </div>
        ))}
        {loading && <div className="bubble assistant pending">Pensando…</div>}
      </main>

      {error && <div className="error-banner">{error}</div>}

      <footer className="composer">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe tu mensaje…"
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()}>
          Enviar
        </button>
      </footer>
    </div>
  );
}

function ProcessPanel({ meta }: { meta: NonNullable<DisplayMessage["meta"]> }) {
  const hasSkill = !!meta.skill_used;
  const hasSources = !!meta.sources?.length;
  const hasTools = !!meta.tool_calls?.length;
  if (!hasSkill && !hasSources && !hasTools) return null;

  return (
    <details className="process-panel">
      <summary>Ver proceso</summary>

      {hasSkill && (
        <div className="process-section">
          <strong>Skill activada:</strong> {meta.skill_used!.name}
          {meta.skill_used!.reason && <p>{meta.skill_used!.reason}</p>}
        </div>
      )}

      {hasTools && (
        <div className="process-section">
          <strong>Herramientas usadas:</strong>
          <ul>
            {meta.tool_calls!.map((t, i) => (
              <li key={i}>
                <code>{t.name}</code>
                {t.args && <span> {JSON.stringify(t.args)}</span>}
                {t.result && <div className="tool-result">{t.result}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasSources && (
        <div className="process-section">
          <strong>Fuentes (RAG):</strong>
          <ul>
            {meta.sources!.map((s, i) => (
              <li key={i}>
                <strong>{s.title}</strong>
                <p>{s.snippet}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </details>
  );
}
