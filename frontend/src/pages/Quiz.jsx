import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";

// 10 MCQs — each option maps weight to one of the 7 services
const SVC = [
  { slug: "healthcare-consulting", title: "Healthcare Consulting" },
  { slug: "hospital-planning-design", title: "Hospital Planning & Design" },
  { slug: "server-data-planning", title: "Server & Data Planning" },
  { slug: "maintenance-it", title: "Maintenance & IT" },
  { slug: "software-hms", title: "Software & HMS Guidance" },
  { slug: "feasibility-analytics", title: "Feasibility & Business Analytics" },
  { slug: "quality-assurance", title: "Quality Assurance" },
];

const Q = [
  { q: "What stage is your hospital project in?",
    opts: [{l:"Idea / Feasibility",w:["feasibility-analytics","healthcare-consulting"]},{l:"Design & approvals",w:["hospital-planning-design"]},{l:"Operating",w:["quality-assurance","maintenance-it"]},{l:"Expansion / Upgrade",w:["feasibility-analytics","hospital-planning-design"]}] },
  { q: "Top operational pain right now?",
    opts: [{l:"Patient flow & layout",w:["hospital-planning-design"]},{l:"EMR / Software inefficiency",w:["software-hms"]},{l:"Quality / Audits",w:["quality-assurance"]},{l:"IT downtime",w:["maintenance-it","server-data-planning"]}] },
  { q: "Are you accredited (NABH / JCI / similar)?",
    opts: [{l:"Yes — maintaining",w:["quality-assurance"]},{l:"In progress",w:["quality-assurance","healthcare-consulting"]},{l:"Planning to start",w:["healthcare-consulting","quality-assurance"]},{l:"Not on roadmap",w:["healthcare-consulting"]}] },
  { q: "How is your EMR / HIS performing?",
    opts: [{l:"Modern, integrated",w:["maintenance-it"]},{l:"Legacy, considering upgrade",w:["software-hms"]},{l:"Multiple systems, no integration",w:["software-hms","server-data-planning"]},{l:"No EMR yet",w:["software-hms","healthcare-consulting"]}] },
  { q: "Data residency & DR strategy?",
    opts: [{l:"Robust on-prem + cloud DR",w:["server-data-planning"]},{l:"Cloud-only",w:["server-data-planning","maintenance-it"]},{l:"On-prem only",w:["server-data-planning"]},{l:"None / unsure",w:["server-data-planning","feasibility-analytics"]}] },
  { q: "Have you done a financial feasibility / DPR?",
    opts: [{l:"Yes — recent",w:["healthcare-consulting"]},{l:"Outdated",w:["feasibility-analytics"]},{l:"Never done",w:["feasibility-analytics"]},{l:"In progress",w:["feasibility-analytics","healthcare-consulting"]}] },
  { q: "Bed strength of the facility?",
    opts: [{l:"<100",w:["hospital-planning-design","healthcare-consulting"]},{l:"100–300",w:["hospital-planning-design","quality-assurance"]},{l:"300–600",w:["server-data-planning","quality-assurance"]},{l:"600+",w:["server-data-planning","software-hms"]}] },
  { q: "Biggest infrastructure concern?",
    opts: [{l:"Power & HVAC reliability",w:["maintenance-it"]},{l:"Server / Network",w:["server-data-planning"]},{l:"Building condition",w:["hospital-planning-design"]},{l:"Wayfinding / Layout",w:["hospital-planning-design"]}] },
  { q: "Patient satisfaction trend?",
    opts: [{l:"Improving",w:["quality-assurance"]},{l:"Flat",w:["healthcare-consulting","quality-assurance"]},{l:"Declining",w:["healthcare-consulting","hospital-planning-design"]},{l:"Not measured",w:["quality-assurance","healthcare-consulting"]}] },
  { q: "Strategic priority for next 12 months?",
    opts: [{l:"Expand capacity",w:["hospital-planning-design","feasibility-analytics"]},{l:"Operational excellence",w:["healthcare-consulting","quality-assurance"]},{l:"Digital transformation",w:["software-hms","server-data-planning"]},{l:"Cost optimisation",w:["feasibility-analytics","maintenance-it"]}] },
];

const Quiz = () => {
  const [step, setStep] = useState(0); // 0..9 questions, then "info" at 5 (after Q5), then "result"
  const [answers, setAnswers] = useState([]);
  const [info, setInfo] = useState({ name: "", email: "", phone: "" });
  const [infoCollected, setInfoCollected] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [result, setResult] = useState(null);

  const choose = (oi) => {
    const next = [...answers, oi];
    setAnswers(next);
    if (!infoCollected && next.length === 5) { setShowInfo(true); return; }
    if (next.length === Q.length) finish(next);
    else setStep(next.length);
  };

  const submitInfo = (e) => {
    e.preventDefault();
    if (!info.name || !info.email || !info.phone) { toast.error("Please fill all fields to continue."); return; }
    setInfoCollected(true); setShowInfo(false); setStep(answers.length);
  };

  const finish = async (final) => {
    const scoreMap = {};
    final.forEach((oi, qi) => Q[qi].opts[oi].w.forEach((s) => { scoreMap[s] = (scoreMap[s] || 0) + 1; }));
    const sorted = Object.entries(scoreMap).sort((a, b) => b[1] - a[1]);
    const recommended = sorted.slice(0, 3).map(([slug]) => slug);
    const correctnessScore = sorted.slice(0, 3).reduce((acc, [, v]) => acc + v, 0);
    const out = {
      name: info.name, email: info.email, phone: info.phone,
      answers: final, score: correctnessScore, total: Q.length, recommended,
    };
    try { await api.post("/quiz", out); } catch { /* still show result */ }
    setResult({ recommended, score: correctnessScore, scoreMap });
  };

  const reset = () => { setStep(0); setAnswers([]); setInfo({ name: "", email: "", phone: "" }); setInfoCollected(false); setResult(null); };

  if (result) {
    return (
      <div className="min-h-[80vh] py-20 px-6" data-testid="quiz-result">
        <div className="max-w-3xl mx-auto">
          <CheckCircle2 className="w-16 h-16 text-brand-2 mb-4"/>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">Your Scorecard</p>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl mt-3">Recommended for {info.name.split(" ")[0]}.</h1>
          <p className="mt-4 text-muted-foreground max-w-xl leading-7">Based on your answers, here are the NEXCARE services that will move the needle for your organization.</p>
          <div className="mt-10 grid gap-4">
            {result.recommended.map((slug, i) => {
              const s = SVC.find((x) => x.slug === slug);
              return (
                <Link to={`/services#${slug}`} key={slug} data-testid={`rec-${i}`} className="group p-6 rounded-lg border border-border bg-card hover:border-brand transition-colors flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-brand-2 font-bold">Recommendation {i + 1}</p>
                    <h3 className="font-display font-bold text-2xl mt-1">{s?.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Match score: {result.scoreMap[slug]} / {Q.length}</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-brand group-hover:translate-x-1 transition-transform"/>
                </Link>
              );
            })}
          </div>
          <div className="mt-10 flex gap-3">
            <button onClick={reset} data-testid="quiz-retry" className="inline-flex items-center gap-2 px-5 py-3 border border-border rounded-md font-semibold text-sm hover:border-brand"><RotateCcw className="w-4 h-4"/> Retake</button>
            <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-3 bg-brand text-white rounded-md font-semibold text-sm">Talk to us <ArrowRight className="w-4 h-4"/></Link>
          </div>
        </div>
      </div>
    );
  }

  if (showInfo) {
    return (
      <div className="min-h-[80vh] grid place-items-center px-6 py-20">
        <form onSubmit={submitInfo} className="w-full max-w-md p-8 rounded-lg border border-border bg-card relative overflow-hidden" data-testid="quiz-info-form">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand-2/20 blur-3xl rounded-full"/>
          <Sparkles className="w-7 h-7 text-brand-2 mb-3"/>
          <h2 className="font-display font-extrabold text-2xl">Halfway there — quick details.</h2>
          <p className="text-sm text-muted-foreground mt-2 mb-6">We need your details to continue and share your personalized scorecard.</p>
          <div className="space-y-4">
            {[["name","Full name","text"],["email","Email","email"],["phone","Phone","tel"]].map(([k,l,t])=>(
              <div key={k}>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{l} *</label>
                <input data-testid={`qf-${k}`} required type={t} value={info[k]} onChange={(e)=>setInfo({...info,[k]:e.target.value})} className="mt-2 w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-sm"/>
              </div>
            ))}
          </div>
          <button data-testid="qf-continue" className="mt-6 w-full py-3 rounded-md bg-brand-2 text-white font-semibold">Continue quiz</button>
        </form>
      </div>
    );
  }

  const cur = Q[step];
  const progress = ((step + 1) / Q.length) * 100;

  return (
    <div className="min-h-[80vh] py-16 px-6" data-testid="quiz-page">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">Assessment</p>
          <p className="text-sm text-muted-foreground">Question {step + 1} of {Q.length}</p>
        </div>
        <div className="h-1.5 bg-accent rounded-full overflow-hidden mb-10">
          <div className="h-full bg-brand transition-all duration-500" style={{ width: `${progress}%` }}/>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl mb-8 text-balance">{cur.q}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {cur.opts.map((o, oi) => (
            <button key={oi} onClick={() => choose(oi)} data-testid={`q-opt-${oi}`} className="text-left p-5 rounded-lg border border-border bg-card hover:border-brand hover:bg-accent/40 transition-colors group">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{o.l}</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-brand"/>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
