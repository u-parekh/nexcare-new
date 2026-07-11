import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const FAQS = [
  {
    q: ["service", "services", "offer", "do"],
    a: "NEXCARE offers hospital planning, healthcare consulting, architecture & design, medical equipment planning, commissioning, and digital health roadmaps.",
  },
  { q: ["project", "portfolio", "case"], a: "We've delivered 200+ healthcare projects across 14 countries. Visit /projects to explore featured case studies." },
  { q: ["contact", "reach", "call", "phone", "email"], a: "Reach us at hello@nexcare.health or +91 98765 43210. The Contact page also has a form that goes straight to our inbox." },
  { q: ["brochure", "download", "pdf"], a: "You can download our brochure from the footer or Services page — it's a quick PDF overview of our capabilities." },
  { q: ["location", "office", "where"], a: "Our offices are in Mumbai, Dubai and Singapore. We operate on projects globally." },
  { q: ["price", "cost", "fee"], a: "Engagements are scoped per project. Please share your brief via the Contact form and we'll respond within 1 business day." },
  { q: ["career", "job", "hire", "work"], a: "We are not hiring currently, but we welcome thoughtful introductions and future opportunities. Please reach out through the Contact page." },
  { q: ["nabh", "jci", "accred"], a: "Yes — we support NABH/JCI accreditation readiness as part of our consulting service." },
  { q: ["hi", "hello", "hey"], a: "Hi! I'm Nexa, NEXCARE's assistant. Ask me about services, projects, careers or pricing." },
];

const findAnswer = (text) => {
  const t = text.toLowerCase();
  for (const f of FAQS) if (f.q.some((k) => t.includes(k))) return f.a;
  return "I can help with our services, projects, careers, pricing, brochure and contact info. Try asking about one of those — or use the Contact form for a detailed enquiry.";
};

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "Hi! I'm Nexa 👋 Ask me about NEXCARE's services, projects, careers or how to get in touch." },
  ]);
  const ref = useRef(null);
  useEffect(() => { ref.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [msgs, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const next = [...msgs, { from: "user", text }];
    setMsgs(next);
    setInput("");
    setTimeout(() => setMsgs((m) => [...m, { from: "bot", text: findAnswer(text) }]), 420);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        data-testid="chatbot-toggle"
        className="fixed bottom-6 right-6 z-50 grid place-items-center w-14 h-14 rounded-full bg-brand text-white shadow-[0_18px_40px_-10px_hsl(var(--brand)/0.7)] hover:scale-105 transition-transform"
        aria-label="open chat"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[92vw] h-[460px] bg-card border border-border rounded-2xl shadow-[0_24px_70px_-24px_rgba(15,23,42,0.45)] flex flex-col overflow-hidden"
          data-testid="chatbot-window"
        >
          <div className="px-4 py-3 bg-gradient-to-r from-brand to-brand/90 text-white flex items-center gap-3">
            <div className="grid place-items-center w-8 h-8 rounded-full bg-white/15 font-display font-bold">N</div>
            <div>
              <p className="font-display font-bold text-sm">Nexa Assistant</p>
              <p className="text-xs opacity-80">FAQ • online</p>
            </div>
          </div>
          <div ref={ref} className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-background" data-testid="chatbot-messages">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-lg text-sm leading-5 ${
                  m.from === "bot"
                    ? "bg-accent text-foreground rounded-bl-sm"
                    : "ml-auto bg-brand text-white rounded-br-sm"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-border flex gap-2 bg-card">
            <input
              data-testid="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about services, projects…"
              className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              data-testid="chatbot-send"
              onClick={send}
              className="grid place-items-center w-10 h-10 rounded-md bg-brand text-white hover:opacity-90"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
