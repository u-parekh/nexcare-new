import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Stethoscope, Building2, Server, Wrench, MonitorCog, LineChart, ShieldCheck,
  ArrowRight, CheckCircle2,
} from "lucide-react";

const SERVICES = {
  "healthcare-consulting": {
    icon: Stethoscope,
    title: "Healthcare Consulting",
    tagline: "Clinical strategy and operational excellence for modern health systems.",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=80",
    overview: "We partner with hospital boards and operators to define clinical strategy, accreditation readiness and service-line growth — translating ambition into a workable operating plan.",
    benefits: ["Clinical strategy aligned to market demand", "Accreditation and regulatory readiness", "Operational efficiency and cost control", "Stronger patient outcomes and satisfaction"],
    process: ["Discover", "Assess", "Strategize", "Implement"],
    tech: ["Data analytics", "Benchmarking tools", "Quality dashboards"],
  },
  "hospital-planning-design": {
    icon: Building2,
    title: "Hospital Planning & Design",
    tagline: "Master-planning, architecture and healing interiors for next-generation hospitals.",
    img: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1400&q=80",
    overview: "From master-planning to MEP coordination, our multidisciplinary studio designs hospitals that are efficient to build, operate and scale.",
    benefits: ["Evidence-based, patient-centric design", "Optimised bed mix and capex envelope", "Future-ready MEP and infrastructure", "Faster regulatory approvals"],
    process: ["Site Assessment", "Master Plan", "Design Development", "Construction Oversight"],
    tech: ["BIM modelling", "Space programming tools", "Sustainability simulation"],
  },
  "server-data-planning": {
    icon: Server,
    title: "Server & Data Planning",
    tagline: "Secure infrastructure and resilient data strategy for healthcare operations.",
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&q=80",
    overview: "We design server architecture, data residency and disaster-recovery strategy built for clinical-grade uptime and compliance.",
    benefits: ["High-availability infrastructure", "Data residency & compliance", "Disaster-recovery readiness", "Scalable cloud/on-prem hybrid design"],
    process: ["Audit", "Architecture", "Migration", "Monitoring"],
    tech: ["Cloud & hybrid hosting", "Backup & DR tooling", "Network security"],
  },
  "maintenance-it": {
    icon: Wrench,
    title: "Maintenance & IT Services",
    tagline: "Lifecycle support, biomedical maintenance and IT helpdesk operations.",
    img: "https://images.unsplash.com/photo-1581090700227-1e8e6e8b9c2b?w=1400&q=80",
    overview: "We keep clinical and IT assets running reliably with structured maintenance programmes and responsive helpdesk operations.",
    benefits: ["Reduced equipment downtime", "Predictable maintenance budgets", "24/7 IT helpdesk support", "Asset lifecycle visibility"],
    process: ["Inventory", "SLA Design", "Rollout", "Continuous Support"],
    tech: ["CMMS platforms", "Remote monitoring", "Ticketing systems"],
  },
  "software-hms-guidance": {
    icon: MonitorCog,
    title: "Software & HMS Guidance",
    tagline: "EMR/HIS evaluation, integration and digital transformation roadmaps.",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&q=80",
    overview: "We help hospitals select, integrate and adopt the right Hospital Management System and clinical software stack.",
    benefits: ["Objective vendor evaluation", "Smooth EMR/HIS integration", "Staff adoption & training", "Clear digital transformation roadmap"],
    process: ["Requirements", "Vendor Shortlist", "Integration", "Go-Live Support"],
    tech: ["EMR/HIS platforms", "Interoperability (HL7/FHIR)", "Workflow automation"],
  },
  "feasibility-business-analytics": {
    icon: LineChart,
    title: "Feasibility & Business Analytics",
    tagline: "DPRs, financial modelling and ROI analysis for confident investment decisions.",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&q=80",
    overview: "Our feasibility studies and financial models give investors and operators a clear, data-driven view before committing capital.",
    benefits: ["Robust DPRs and financial models", "Market & demand analysis", "Risk-adjusted ROI projections", "Investor-ready documentation"],
    process: ["Market Study", "Financial Model", "Sensitivity Analysis", "Reporting"],
    tech: ["Financial modelling tools", "Market data platforms", "Scenario simulation"],
  },
  "quality-assurance": {
    icon: ShieldCheck,
    title: "Quality Assurance",
    tagline: "Audits, NABH/JCI accreditation and continuous improvement programmes.",
    img: "https://images.unsplash.com/photo-1576765608866-5b51f0d9da00?w=1400&q=80",
    overview: "We guide hospitals through accreditation journeys and embed continuous-improvement quality systems that stick.",
    benefits: ["NABH/JCI accreditation readiness", "Standardised clinical protocols", "Continuous quality monitoring", "Stronger patient safety culture"],
    process: ["Gap Assessment", "SOP Development", "Mock Audits", "Accreditation Support"],
    tech: ["Quality management systems", "Incident tracking", "Audit dashboards"],
  },
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const data = SERVICES[slug];
  if (!data) return <Navigate to="/services" replace />;
  const Icon = data.icon;

  return (
    <div className="overflow-x-hidden">
      {/* HERO BANNER */}
      <section className="relative py-20 border-b border-border bg-card/30" data-testid="service-hero">
        <div className="absolute inset-0 grid-pattern opacity-30"/>
        <div className="relative max-w-5xl mx-auto px-6 lg:px-10 text-center">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand/10 border border-brand/30 mb-6">
            <Icon className="w-8 h-8 text-brand"/>
          </motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-extrabold text-3xl sm:text-5xl">{data.title}</motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-7">{data.tagline}</motion.p>
        </div>
      </section>

      {/* IMAGE + OVERVIEW */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <motion.img initial={{ x: -40, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          src={data.img} alt={data.title} className="w-full rounded-lg border border-border shadow-xl object-cover aspect-[4/3]"/>
        <motion.div initial={{ x: 40, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">Service Overview</p>
          <p className="mt-4 text-foreground/90 leading-8 text-lg">{data.overview}</p>
        </motion.div>
      </section>

      {/* KEY BENEFITS */}
      <section className="border-t border-border bg-card/30 py-20" data-testid="service-benefits">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">Key Benefits</p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl mt-3 mb-10">Why it matters</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {data.benefits.map((b, i) => (
              <motion.div key={b} initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-3 p-5 rounded-lg border border-border bg-card">
                <CheckCircle2 className="w-5 h-5 text-brand-2 mt-0.5 shrink-0"/>
                <p className="text-sm leading-6 text-foreground/90">{b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 border-t border-border" data-testid="service-process">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">Process</p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl mt-3 mb-12">How we deliver</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {data.process.map((step, i) => (
              <motion.div key={step} initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-brand text-white grid place-items-center font-display font-bold">{i + 1}</div>
                <p className="mt-4 font-semibold">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGIES */}
      <section className="border-t border-border bg-card/30 py-20" data-testid="service-tech">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">Technologies</p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl mt-3 mb-8">What we work with</h2>
          <div className="flex flex-wrap gap-3">
            {data.tech.map((t) => (
              <span key={t} className="px-4 py-2 rounded-full border border-border bg-card text-sm font-medium">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="relative overflow-hidden rounded-lg border border-border bg-card p-10 md:p-16 text-center">
          <h3 className="font-display font-extrabold text-3xl sm:text-4xl">Ready to discuss {data.title.toLowerCase()}?</h3>
          <p className="mt-4 text-muted-foreground leading-7 max-w-xl mx-auto">Tell us about your project — we respond within one business day.</p>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 px-7 py-4 bg-brand text-white font-semibold rounded-md hover:translate-y-[-2px] transition-all">
            Request Consultation <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
