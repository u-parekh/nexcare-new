import { useState } from "react";
import { Mail, Phone, MapPin, Send, Download, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { submitContact, brochureURL } from "../lib/api";

const SERVICES = ["Healthcare Consulting","Hospital Planning & Design", "Server & Data Planning", "Maintenance & IT Services", "Software & HMS Guidance", "Feasibility & Business Analytics","Quality Assurance", "Other"];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) { toast.error("Please fill name, email , phone no. and message."); return; }
    setLoading(true);
    try {
      await submitContact(form);
      setSuccess(true);
      toast.success("Thank you — your message has been delivered.");
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Submission failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div data-testid="contact-page">
      <section className="relative py-24 border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="glow-blob bg-brand w-[480px] h-[480px] -top-32 left-1/4 opacity-30 animate-pulse-glow" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">Contact</p>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl mt-4 max-w-4xl leading-[1.02]">Tell us about your <span className="text-brand">project.</span></h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-7">Share your brief — feasibility, design, accreditation or operations. We respond within one business day.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="space-y-6">
            <div className="p-6 rounded-lg border border-border bg-card">
              <Mail className="w-6 h-6 text-brand mb-3"/>
              <p className="font-display font-bold">Email</p>
              <p className="text-muted-foreground text-sm mt-1">hello@nexcare.health</p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <Phone className="w-6 h-6 text-brand mb-3"/>
              <p className="font-display font-bold">Phone</p>
              <p className="text-muted-foreground text-sm mt-1">+91 98765 43210</p>
            </div>
            
            <a href={brochureURL} data-testid="contact-brochure" className="flex items-center gap-2 px-5 py-4 border-2 border-brand text-brand rounded-md font-semibold hover:bg-brand hover:text-white transition-colors w-fit">
              <Download className="w-4 h-4"/> Download Brochure
            </a>
          </div>
        </div>

        <div className="lg:col-span-7">
          {success ? (
            <div className="p-10 rounded-lg border border-brand/40 bg-card text-center" data-testid="contact-success">
              <CheckCircle2 className="w-14 h-14 text-brand-2 mx-auto mb-4"/>
              <h3 className="font-display font-extrabold text-3xl">Message delivered.</h3>
              <p className="text-muted-foreground mt-3">A team member will reach out within one business day.</p>
              <button onClick={() => setSuccess(false)} className="mt-6 px-5 py-2.5 rounded-md border border-border hover:border-brand text-sm font-semibold">Send another</button>
            </div>
          ) : (
            <form onSubmit={submit} className="p-8 rounded-lg border border-border bg-card space-y-5" data-testid="contact-form">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name *</label>
                  <input placeholder="John doe" data-testid="cf-name" required value={form.name} onChange={set("name")} className="mt-2 w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email *</label>
                  <input placeholder="john.doe@example.com" data-testid="cf-email" required type="email" value={form.email} onChange={set("email")} className="mt-2 w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone *</label>
                  <input placeholder="+91 98765 43210" data-testid="cf-phone" value={form.phone} onChange={set("phone")} className="mt-2 w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service</label>
                  <select data-testid="cf-service" value={form.service} onChange={set("service")} className="mt-2 w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-sm">
                    <option value="">Select a service</option>
                    {SERVICES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message *</label>
                <textarea placeholder="Tell us about your project, timeline and what you'd like help with…" data-testid="cf-message" required rows={6} value={form.message} onChange={set("message")} className="mt-2 w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-sm"/>
              </div>
              <button data-testid="cf-submit" disabled={loading} className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand text-white rounded-md font-semibold hover:translate-y-[-2px] transition-transform disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Sending…" : <>Send Message <Send className="w-4 h-4"/></>}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Contact;
