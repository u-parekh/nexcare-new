import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Download, Stethoscope, Building2, Server, MonitorCog,
  ChevronRight, ChevronDown, Quote, Star,
  ClipboardCheck, SearchCheck, Lightbulb, PencilRuler, Hammer, LifeBuoy,
  Hospital, Activity, Database, ShieldCheck,
} from "lucide-react";
import HeroParticles from "../components/HeroParticles";
import AutoCarousel from "../components/AutoCarousel";
import { brochureURL, trackBrochure } from "../lib/api";

const FEATURED_SERVICES = [
  { icon: Stethoscope, slug: "healthcare-consulting", title: "Healthcare Consulting", desc: "Clinical strategy, accreditation readiness and operational excellence.", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80" },
  { icon: Building2, slug: "hospital-planning-design", title: "Hospital Planning & Design", desc: "Master-planning, architecture, MEP and healing interiors.", img: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80" },
  { icon: Server, slug: "server-data-planning", title: "Server & Data Planning", desc: "Secure infrastructure, data residency and DR strategy.", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80" },
  { icon: MonitorCog, slug: "software-hms-guidance", title: "Software & HMS Guidance", desc: "EMR/HIS evaluation, integration and digital transformation.", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80" },
];

const STEPS = [
  { icon: ClipboardCheck, title: "Consultation", desc: "Understand your vision, context and goals.", img: "https://images.unsplash.com/photo-1576091160501-787f6f573b5e?w=600&q=80" },
  { icon: SearchCheck, title: "Assessment", desc: "Site audit, demand study and readiness review.", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80" },
  { icon: Lightbulb, title: "Strategy", desc: "Service mix, capex envelope and roadmap.", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80" },
  { icon: PencilRuler, title: "Design", desc: "Master-plan, architecture and clinical briefs.", img: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=80" },
  { icon: Hammer, title: "Implementation", desc: "Construction oversight, equipment, HR ramp-up.", img: "https://images.unsplash.com/photo-1581090700227-1e8e6e8b9c2b?w=600&q=80" },
  { icon: LifeBuoy, title: "Support", desc: "SOPs and continuous quality.", img: "https://images.unsplash.com/photo-1576765608866-5b51f0d9da00?w=600&q=80" },
];

const REVIEWS = [
  { name: "Dr. Karan Mehra", role: "CEO", company: "Aurora Health", img: "https://images.pexels.com/photos/5452285/pexels-photo-5452285.jpeg?auto=compress&cs=tinysrgb&w=200", text: "NEXCARE turned a feasibility study into a 420-bed reality. Their clinical-first thinking is unmatched." },
  { name: "Sara", role: "Director", company: "Helix Group", img: "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=200", text: "JCI accreditation in 9 months — they ran the whole programme like clockwork." },
  { name: "Vikram Sethi", role: "COO", company: "Meridian Care", img: "https://images.pexels.com/photos/4173324/pexels-photo-4173324.jpeg?auto=compress&cs=tinysrgb&w=200", text: "From DPR to commissioning, their cross-functional team simply delivers." },
  { name: "Dr. R. Verma", role: "Group COO", company: "Apex Healthcare", img: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=200", text: "Nexcare turned our 200-bed brief into a fully commissioned hospital, on budget." },
];

const PROJECTS = [
  { img: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80", title: "Aurora Multispecialty", category: "Hospital Planning", meta: "420 beds • Pune", desc: "A phased master plan for a 420-bed tertiary care network designed around staff flow and patient recovery." },
  { img: "https://images.pexels.com/photos/4458205/pexels-photo-4458205.jpeg?auto=compress&cs=tinysrgb&w=1200", title: "Helix Cardiac Centre", category: "Healthcare Consulting", meta: "180 beds • Dubai", desc: "Clinical operations and accreditation strategy for a highly specialized cardiac institute in the GCC." },
  { img: "https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=1200", title: "Meridian Cancer Institute", category: "Quality Assurance", meta: "300 beds • Singapore", desc: "A quality-led commissioning roadmap for a cancer-focused facility with advanced digital workflows." },
  { img: "https://images.pexels.com/photos/6615086/pexels-photo-6615086.jpeg?auto=compress&cs=tinysrgb&w=1200", title: "Vesper Children's Hospital", category: "Software & HMS", meta: "150 beds • Bengaluru", desc: "A pediatric care environment shaped around family experience, infection control and smart operations." },
];

{/*const heroIcons = [
  { icon: Building2, label: "Planning" },
  { icon: Hospital, label: "Facilities" },
  { icon: Activity, label: "Operations" },
  { icon: Database, label: "Data" },
  { icon: ShieldCheck, label: "Quality" },
  { icon: Server, label: "IT" },
];*/}

const fadeUp = { initial: { y: 40, opacity: 0 }, whileInView: { y: 0, opacity: 1 }, viewport: { once: true }, transition: { duration: 0.5 } };

const Home = () => (
  <div className="overflow-x-hidden">
    <section className="relative min-h-[90vh] flex items-center overflow-hidden" data-testid="hero">
      <div className="absolute inset-0 grid-pattern opacity-40 dark:opacity-20" />
      <HeroParticles />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(74,144,226,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(63,181,73,0.16),transparent_30%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-12 gap-10 items-center w-full">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="lg:col-span-7">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-brand/20 bg-white/70 dark:bg-background/60 backdrop-blur text-brand-2 text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6BCB3D] animate-pulse" />
            Healthcare Consulting • Hospital Planning & Design
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-7xl leading-[1.02] mt-2 text-balance">
            Shaping the <span className="text-brand-2">Future</span> of Healthcare
          </h1>
          <p className="mt-2 text-base sm:text-lg text-muted-foreground max-w-xl leading-7">
            NEXCARE is a healthcare consulting partner that helps hospitals and health systems navigate modern delivery, digital transformation and high-quality growth.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/assessment" data-testid="hero-cta-assess" className="group inline-flex items-center gap-2 px-6 py-3.5 bg-brand-2 text-white font-semibold rounded-md hover:translate-y-[-2px] hover:shadow-[0_12px_28px_-8px_rgba(63,181,73,0.6)] transition-all">
              Take an Assessment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" data-testid="hero-cta-start" className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand text-white font-semibold rounded-md hover:translate-y-[-2px] hover:shadow-[0_12px_28px_-8px_hsl(var(--brand)/0.6)] transition-all">
              Start a Project <ArrowRight className="w-4 h-4" />
            </Link>
            <a href={brochureURL} onClick={trackBrochure} data-testid="hero-brochure" className="inline-flex items-center gap-2 px-6 py-3.5 border-2 border-border bg-card/70 backdrop-blur rounded-md font-semibold hover:border-brand hover:text-brand transition-colors">
              <Download className="w-4 h-4" /> Brochure
            </a>
          </div>

          {/*<div className="mt-6 flex flex-wrap gap-2">
            {heroIcons.map(({ icon: Icon, label }) => (
              <div key={label} className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-2 text-sm text-muted-foreground">
                <Icon className="w-4 h-4 text-brand" strokeWidth={1.8} />
                {label}
              </div>
            ))}
          </div>*/}
        </motion.div>

        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.15 }} className="lg:col-span-5">
          <div className="relative max-w-md mx-auto">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} className="absolute inset-6 rounded-full border border-brand/20" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }} className="absolute inset-2 rounded-full border border-brand-2/20" />
            <img src="/hero-consulting.png" alt="NEXCARE healthcare consulting team reviewing a hospital master-plan" className="relative w-full rounded-lg border border-border shadow-2xl" />
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce opacity-50">
        <span className="text-[10px] uppercase tracking-[.2em] text-foreground/50">Scroll</span>
        <ChevronDown className="w-4 h-4 text-foreground/50" />
      </div>
    </section>

    {/* SERVICES — 4 featured */}
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24" data-testid="services-section">
      <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">/ 01 — Our Services</p>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl mt-3 max-w-2xl">Featured disciplines from our integrated studio.</h2>
        </div>
        <Link to="/services" data-testid="explore-services" className="inline-flex items-center gap-1 text-sm font-semibold hover:text-brand">
          Explore All Services <ChevronRight className="w-4 h-4"/>
        </Link>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {FEATURED_SERVICES.map((s, i) => (
          <motion.div key={s.slug} initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}>
            <Link to={`/services/${s.slug}`} data-testid={`svc-${i}`}
              className="group relative block rounded-lg border border-border bg-card/70 backdrop-blur-md overflow-hidden hover:border-brand hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-36 overflow-hidden">
                <img src={s.img} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent"/>
              </div>
              <div className="p-5">
                <s.icon className="w-7 h-7 text-brand mb-3" strokeWidth={1.6}/>
                <h3 className="font-display font-bold text-base mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-6">{s.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="border-t border-border bg-card/30 py-24" data-testid="how-we-work">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div {...fadeUp}>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">/ 02 — How we work</p>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl mt-3 mb-14 max-w-2xl">A clear path, from brief to operations.</h2>
        </motion.div>
        <div className="relative">
          <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-brand via-brand-2 to-transparent hidden md:block" />
          <div className="space-y-6 md:space-y-8">
            {STEPS.map((s, i) => (
              <motion.div key={s.title} initial={{ x: i % 2 === 0 ? -30 : 30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }} data-testid={`step-${i}`} className="relative md:pl-16">
                <div className="absolute left-0 top-4 hidden md:grid h-10 w-10 place-items-center rounded-full border border-brand/20 bg-card text-sm font-bold text-brand shadow-sm">{i + 1}</div>
                <div className="rounded-xl border border-border bg-card/80 p-5 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.35)] hover:border-brand hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand/10 text-brand">
                      <s.icon className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    <h3 className="font-display font-bold text-xl">{s.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-6">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="py-24 border-t border-border" data-testid="reel-projects">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-10">
        <motion.div {...fadeUp}>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">/ 03 — Recent work</p>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl mt-3 max-w-2xl">Hospitals as instruments of healing.</h2>
        </motion.div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <AutoCarousel delay={4000}>
          {PROJECTS.map((p) => (
            <Link to="/projects" key={p.title} className="group shrink-0 basis-[85%] sm:basis-[55%] lg:basis-[32%] px-2">
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-border bg-card/80 shadow-sm">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="text-xs uppercase tracking-widest text-brand-2 mb-1">{p.category}</p>
                  <h3 className="font-display font-bold text-2xl">{p.title}</h3>
                  <p className="text-sm opacity-80 mt-1">{p.meta}</p>
                  <p className="text-sm text-white/70 mt-2 leading-6">{p.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </AutoCarousel>
      </div>
    </section>

    {/* CLIENT REVIEWS — auto slider */}
    <section className="py-24 border-t border-border bg-card/30" data-testid="reviews">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div {...fadeUp}>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">/ 04 — Client reviews</p>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl mt-3 mb-14 max-w-2xl">Trusted by healthcare professionals.</h2>
        </motion.div>
        <AutoCarousel delay={4500}>
          {REVIEWS.map((r, i) => (
            <div key={r.name} data-testid={`review-${i}`} className="shrink-0 basis-[88%] sm:basis-[48%] lg:basis-[32%] px-2">
              <div className="relative h-full p-7 rounded-lg border border-border bg-card/70 backdrop-blur-md shadow-sm hover:shadow-lg hover:border-brand transition-all">
                <Quote className="absolute top-5 right-5 w-8 h-8 text-brand/20"/>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, si) => <Star key={si} className="w-4 h-4 fill-brand-2 text-brand-2"/>)}
                </div>
                <p className="text-muted-foreground leading-7 mb-6">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img src={r.img} alt={r.name} className="w-12 h-12 rounded-full object-cover border-2 border-brand/30"/>
                  <div>
                    <p className="font-display font-bold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.role}, {r.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </AutoCarousel>
      </div>
    </section>

    {/* CTA */}
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
      <motion.div {...fadeUp} className="relative overflow-hidden rounded-lg border border-border bg-card p-10 md:p-16">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brand/20 blur-3xl"/>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-brand-2/20 blur-3xl"/>
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-display font-extrabold text-4xl">Have a brief? Let's plan it together.</h3>
            <p className="mt-4 text-muted-foreground leading-7">Tell us about your project — we respond within one business day.</p>
          </div>
          <div className="flex md:justify-end">
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-4 bg-brand text-white font-semibold rounded-md hover:translate-y-[-2px] transition-all">
              Start a Conversation <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  </div>
);

export default Home;
