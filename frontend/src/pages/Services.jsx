import { Building2, Stethoscope, Activity, LucideShieldCheck, Cpu, Download, Check, ServerIcon } from "lucide-react";
import { brochureURL } from "../lib/api";

const SERVICES = [
  { icon: Stethoscope, num: "01", title: "Healthcare Consulting", desc: "Clinical strategy, service-line definition, NABH/JCI readiness and operations playbooks rooted in measurable patient outcomes.", points: ["Clinical service mix", "NABH/JCI readiness", "Operating model design"] },
  { icon: Building2, num: "02", title: "Hospital Planning & Design", desc: "Feasibility studies, demand modelling, site analysis and phased master-plans tailored to local demographics and regulatory frameworks.", points: ["Capacity & demand modelling", "Land + zoning strategy", "Phased growth roadmap"] },
  { icon: ServerIcon, num: "03", title: "Server & Data Planning", desc: "Data centre design, server room layout, IT infrastructure and network architecture for secure and scalable healthcare operations.", points: ["Data centre design", "Network architecture", "IT infrastructure planning"] },
  { icon: Cpu, num: "04", title: "Maintenance & IT Services", desc: "Preventive maintenance schedules, asset management systems and IT support for uninterrupted hospital operations.", points: ["Preventive maintenance", "Asset management systems", "IT support services"] },
  { icon: LucideShieldCheck, num: "05", title: "Software & HMS Guidance", desc: "Hospital management system selection, EMR/HIS integration and digital workflow optimization for efficient patient care.", points: ["HMS selection & integration", "EMR/HIS optimization", "Digital workflow design"] },
  { icon: Activity, num: "06", title: "Feasibility & Business Analytics", desc: "Financial modelling, ROI analysis, and business intelligence dashboards to inform strategic decisions and operational efficiency.", points: ["Financial modelling", "ROI analysis", "Business intelligence dashboards"] },
  { icon: Check, num: "07", title: "Quality Assurance", desc: "Clinical audits, compliance checks, and quality improvement initiatives to ensure adherence to healthcare standards and best practices.", points: ["Clinical audits", "Compliance checks", "Quality improvement initiatives"] },
];

const Services = () => (
  <div data-testid="services-page">
    <section className="relative py-24 border-b border-border overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="glow-blob bg-brand w-[460px] h-[460px] -top-32 right-1/4 opacity-30" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">Services</p>
        <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl mt-4 max-w-4xl leading-[1.02] text-balance">
          End-to-end expertise across the <span className="text-brand">healthcare</span> value chain.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-7">
          Seven disciplines, one integrated team — bringing together clinical insight, architectural rigour and digital craft.
        </p>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 grid lg:grid-cols-2 gap-6">
      {SERVICES.map((s) => (
        <div key={s.num} className="relative p-8 rounded-lg border border-border bg-card hover:border-brand transition-colors" data-testid={`service-card-${s.num}`}>
          <div className="flex items-start justify-between mb-6">
            <s.icon className="w-9 h-9 text-brand" strokeWidth={1.6} />
            <span className="font-display font-extrabold text-3xl text-muted-foreground/30">{s.num}</span>
          </div>
          <h3 className="font-display font-bold text-2xl mb-3">{s.title}</h3>
          <p className="text-muted-foreground leading-7 mb-5">{s.desc}</p>
          <ul className="space-y-2">
            {s.points.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 mt-0.5 text-brand-2 shrink-0" /> {p}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>

    <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
      <div className="relative overflow-hidden rounded-lg p-10 md:p-14 border border-border bg-gradient-to-br from-brand/10 to-transparent">
        <h3 className="font-display font-extrabold text-3xl md:text-4xl max-w-xl">Get a complete capability brief.</h3>
        <p className="mt-3 text-muted-foreground max-w-xl">Our brochure covers services, methodology, sectors and case studies.</p>
        <a href={brochureURL} data-testid="services-brochure" className="mt-6 inline-flex items-center gap-2 px-6 py-3.5 bg-brand text-white rounded-md font-semibold hover:translate-y-[-2px] transition-transform">
          <Download className="w-4 h-4" /> Download Brochure (PDF)
        </a>
      </div>
    </section>
  </div>
);

export default Services;
