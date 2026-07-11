import { MapPin, ArrowUpRight, HeartPulse, Coffee, GraduationCap, Globe } from "lucide-react";

const ROLES = [
  { t: "Senior Healthcare Architect", l: "Mumbai · Hybrid", d: "Lead design for a 600-bed multispecialty programme. 8+ years required." },
  { t: "Clinical Strategy Consultant", l: "Dubai · On-site", d: "Drive service-line strategy for GCC hospital expansions. MBBS + MBA preferred." },
  { t: "MEP Engineer (Healthcare)", l: "Bengaluru · Hybrid", d: "Specialty-grade MEP design for tertiary care facilities." },
  { t: "Digital Health Lead", l: "Singapore · Remote-friendly", d: "Own EMR/HIS architecture for new builds. Epic/Cerner experience a plus." },
  { t: "Junior Architect", l: "Mumbai · On-site", d: "Join our studio cohort for a 2-year residency programme." },
];

const PERKS = [
  { i: HeartPulse, t: "Healthcare for life", d: "Full coverage for you and family — the hospitals we design treat our team first." },
  { i: GraduationCap, t: "Learning budget", d: "courses and certifications." },
  { i: Coffee, t: "Sabbatical-friendly", d: "Take 4 weeks paid every 4 years to recharge." },
  { i: Globe, t: "Travel that matters", d: "Site visits to live projects across country." },
];

const Career = () => (
  <div data-testid="career-page">
    <section className="relative py-24 border-b border-border overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="glow-blob bg-brand-2 w-[420px] h-[420px] top-10 right-1/4 opacity-30" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">Careers</p>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl mt-4 leading-[1.02]">Build the spaces that heal.</h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-7">We are clinicians, architects and engineers shaping high-impact healthcare environments for clients across the globe.</p>
          <div className="mt-8 inline-flex items-center rounded-full border border-brand/20 bg-card/70 px-4 py-2 text-sm font-semibold text-brand-2">We are not hiring currently, but we welcome thoughtful introductions.</div>
        </div>
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          <img src="https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=600" alt="culture" className="rounded-lg aspect-square object-cover border border-border"/>
          <img src="https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=600" alt="culture" className="rounded-lg aspect-square object-cover border border-border mt-8"/>
          <img src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600" alt="culture" className="rounded-lg aspect-square object-cover border border-border -mt-4"/>
          <img src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600" alt="culture" className="rounded-lg aspect-square object-cover border border-border mt-4"/>
        </div>
      </div>
    </section>

   {/* <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold mb-3">Open Positions</p>
      <h2 className="font-display font-extrabold text-4xl sm:text-5xl mb-12 max-w-2xl">Five roles. One studio.</h2>
      <div className="border-t border-border" data-testid="roles-list">
        {ROLES.map((r, i) => (
          <a key={r.t} href="#apply" data-testid={`role-${i}`} className="group flex items-center justify-between py-6 border-b border-border hover:bg-accent/40 px-4 -mx-4 rounded-md transition-colors">
            <div>
              <h3 className="font-display font-bold text-2xl group-hover:text-brand transition-colors">{r.t}</h3>
              <p className="text-muted-foreground mt-1 max-w-2xl">{r.d}</p>
              <p className="flex items-center gap-1 text-xs text-brand-2 font-semibold mt-2"><MapPin className="w-3 h-3"/> {r.l}</p>
            </div>
            <ArrowUpRight className="w-6 h-6 shrink-0 transition-transform group-hover:rotate-45"/>
          </a>
        ))}
      </div>
    </section>*/}

    <section className="bg-card/40 border-y border-border py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold mb-3">Perks</p>
        <h2 className="font-display font-extrabold text-4xl mb-12">Built to keep you well.</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PERKS.map((p) => (
            <div key={p.t} className="p-6 rounded-lg border border-border bg-card">
              <p.i className="w-7 h-7 text-brand mb-3" strokeWidth={1.6}/>
              <h3 className="font-display font-bold">{p.t}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-6">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Career;
