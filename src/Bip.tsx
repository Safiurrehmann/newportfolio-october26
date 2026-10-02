import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, RotateCcw, X } from "lucide-react";
import { destinations, guideAnswer } from "../shared/knowledge.mjs";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  mode?: string;
  notice?: string;
};
export function BipCharacter({
  small = false,
  thinking = false,
}: {
  small?: boolean;
  thinking?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`bip-character ${small ? "small" : ""} ${thinking ? "thinking" : ""}`}
    >
      <span className="bip-antenna" />
      <span className="bip-ear left" />
      <span className="bip-ear right" />
      <span className="bip-visor">
        <i />
        <i />
      </span>
      <span className="bip-feet" />
    </span>
  );
}
export default function Bip({
  open,
  setOpen,
  navigate,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  navigate: (id: string) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("guide");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const abort = useRef<AbortController | null>(null);
  const busyRef = useRef(false);
  const messageRef = useRef(messages);
  messageRef.current = messages;
  useEffect(() => {
    fetch("/api/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.mode) setMode(data.mode);
      })
      .catch(() => {});
    return () => abort.current?.abort();
  }, []);
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, busy]);
  useEffect(() => {
    const listener = (event: Event) => {
      const question = (event as CustomEvent<string>).detail;
      setOpen(true);
      void send(question);
    };
    window.addEventListener("bip-question", listener);
    return () => window.removeEventListener("bip-question", listener);
  }, []);

  const close = () => {
    setOpen(false);
    launcher.current?.focus();
  };
  async function send(question: string) {
    if (busyRef.current || !question.trim()) return;
    const text = question.trim().slice(0, 1200);
    const history = messageRef.current
      .slice(-6)
      .map(({ role, content }) => ({ role, content: content.slice(0, 2000) }));
    busyRef.current = true;
    setBusy(true);
    setError("");
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    abort.current = new AbortController();
    const timeout = setTimeout(() => abort.current?.abort(), 22000);
    try {
      const response = await fetch("/api/bip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
        signal: abort.current.signal,
      });
      if (response.status === 429) {
        setError(
          "A few too many questions at once. Please try again in a minute.",
        );
        return;
      }
      if (!response.ok) throw new Error("Bip unavailable");
      const result = await response.json();
      if (typeof result.answer !== "string")
        throw new Error("Invalid response");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.answer,
          sources: result.sources,
          mode: result.mode,
          notice: result.notice,
        },
      ]);
    } catch {
      const result = guideAnswer(text);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.answer,
          sources: result.sources,
          mode: "guide",
          notice:
            "Showing the built-in guide. The AI connection is unavailable.",
        },
      ]);
    } finally {
      clearTimeout(timeout);
      busyRef.current = false;
      setBusy(false);
    }
  }

  const onKey = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      close();
      return;
    }
    if (event.key === "Tab" && panel.current) {
      const elements = [
        ...panel.current.querySelectorAll<HTMLElement>(
          "button:not(:disabled), a, input:not(:disabled)",
        ),
      ];
      const first = elements[0],
        last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  };

  return (
    <div className="bip-container">
      {open && (
        <section
          className="bip-panel"
          ref={panel}
          role="dialog"
          aria-label="Chat with Bip, Safi’s portfolio guide"
          onKeyDown={onKey}
        >
          <header className="bip-header">
            <BipCharacter />
            <div>
              <strong>
                Bip
                <span className="bip-online" />
              </strong>
              <span>
                {mode === "ai" ? "AI portfolio guide" : "Portfolio guide"}
              </span>
            </div>
            <button
              className="icon-button"
              aria-label="Clear conversation"
              disabled={busy}
              onClick={() => {
                setMessages([]);
                setError("");
                inputRef.current?.focus();
              }}
            >
              <RotateCcw size={15} />
            </button>
            <button
              className="icon-button"
              aria-label="Close Bip"
              onClick={close}
            >
              <X size={19} />
            </button>
          </header>
          <div
            className="bip-log"
            ref={log}
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
          >
            <div className="bip-welcome">
              <span className="mono">SMALL GUIDE. BIG CONTEXT.</span>
              <h3>
                Hey, I’m Bip.
                <br />
                Let me show you around.
              </h3>
              <p>
                Ask me about Safi’s work, his experience, or the systems he
                builds.
              </p>
            </div>
            {!messages.length && (
              <div className="bip-suggestions">
                {[
                  "Give me a quick tour",
                  "What does Safi do at Millos.ai?",
                  "Tell me about Clicky",
                ].map((q) => (
                  <button disabled={busy} key={q} onClick={() => send(q)}>
                    {q}
                    <ArrowUpRight size={15} />
                  </button>
                ))}
              </div>
            )}
            {messages.map((message, index) => (
              <div className={`bip-message ${message.role}`} key={index}>
                <span className="mono">
                  {message.role === "user" ? "YOU" : "BIP"}
                </span>
                <p>{message.content}</p>
                {message.notice && <small>{message.notice}</small>}
                {message.sources && (
                  <div className="bip-sources">
                    {message.sources
                      .filter((id) => Object.hasOwn(destinations, id))
                      .map((id) => {
                        const target =
                          destinations[id as keyof typeof destinations];
                        return target.href.startsWith("#") ? (
                          <button
                            key={id}
                            onClick={() => {
                              navigate(target.href.slice(1));
                              close();
                            }}
                          >
                            {target.label}
                            <ArrowUpRight size={12} />
                          </button>
                        ) : (
                          <a
                            href={target.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={id}
                          >
                            {target.label}
                            <ArrowUpRight size={12} />
                          </a>
                        );
                      })}
                  </div>
                )}
              </div>
            ))}
            {busy && (
              <div className="bip-thinking">
                <span />
                <span />
                <span />
                <span className="sr-only">Bip is thinking</span>
              </div>
            )}
            {error && (
              <p role="alert" className="bip-error">
                {error}
              </p>
            )}
          </div>
          <form
            className="bip-form"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <label className="sr-only" htmlFor="bip-input">
              Ask Bip about Safi
            </label>
            <input
              id="bip-input"
              ref={inputRef}
              placeholder="Ask something about Safi…"
              autoComplete="off"
              maxLength={1200}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={busy}
            />
            <button aria-label="Send question" disabled={busy || !input.trim()}>
              <ArrowUp size={18} />
            </button>
          </form>
          <p className="bip-disclosure">
            {mode === "ai"
              ? "AI answers may be imperfect. Questions are sent to OpenAI."
              : "Built-in answers from Safi’s portfolio. No live AI connected."}
          </p>
        </section>
      )}
      <button
        ref={launcher}
        className={`bip-launcher ${open ? "is-open" : ""}`}
        aria-label={open ? "Close Bip" : "Ask Bip about Safi"}
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <BipCharacter thinking={busy} />
        <span>
          {open ? "See you around" : "Ask Bip"}
          <small>Your personal guide</small>
        </span>
        {open ? <X size={16} /> : <span className="bip-launch-dot" />}
      </button>
    </div>
  );
}
