const TIMELINE = [
  { y: "2007", t: "Founded in Mumbai", d: "Started as a 5-person consulting studio focused on tier-2 hospitals." },
  { y: "2012", t: "First 500-bed master-plan", d: "Delivered the Aurora Multispecialty programme, our first super-specialty mandate." },
  { y: "2017", t: "Middle East practice", d: "Opened our Dubai studio — expanded into JCI-accredited deliveries." },
  { y: "2021", t: "Digital health vertical", d: "Built dedicated EMR/HIS and analytics advisory practice." },
  { y: "2024", t: "Sustainability framework", d: "Launched NEX-Green — a net-zero pathway for hospital infrastructure." },
];

const TEAM = [
  { img: "https://images.pexels.com/photos/5452285/pexels-photo-5452285.jpeg?auto=compress&cs=tinysrgb&w=600", name: "Dr. Het Limbachiya", role: "Founder • CEO" },
  { img: "https://images.pexels.com/photos/7108401/pexels-photo-7108401.jpeg?auto=compress&cs=tinysrgb&w=600", name: "Vikram", role: "Principal Architect" },
  { img: "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=600", name: "Dr. Maya", role: "Clinical Strategy" },
  { img: "https://images.pexels.com/photos/4173324/pexels-photo-4173324.jpeg?auto=compress&cs=tinysrgb&w=600", name: "Arjun Nair", role: "Operations Lead" },
];

const About = () => (
  <div data-testid="about-page">
    <section className="relative py-24 border-b border-border overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="glow-blob bg-brand-2 w-[400px] h-[400px] -bottom-24 right-10 opacity-30" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">About NEXCARE</p>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl mt-4 leading-[1.02] text-balance">
           Building the trust <span className="text-brand">in healthcare.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-7">
            We are clinicians, architects and operators — united by the belief that the built environment of healthcare directly shapes patient outcomes.
          </p>
        </div>
        <div className="lg:col-span-5">
          <div className="relative">
            <div className="absolute inset-0 bg-brand/20 blur-3xl rounded-full"/>
            <img src="https://images.pexels.com/photos/7108401/pexels-photo-7108401.jpeg?auto=compress&cs=tinysrgb&w=900" alt="team" className="relative rounded-lg border border-border" />
          </div>
        </div>
      </div>
    </section>

   {/* TIMELINE 
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold mb-3">Our Journey</p>
      <h2 className="font-display font-extrabold text-4xl sm:text-5xl mb-12 max-w-2xl">From a studio of five to a global practice.</h2>
      <div className="relative">
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border" />
        {TIMELINE.map((t, i) => (
          <div key={t.y} className={`relative grid md:grid-cols-2 gap-6 mb-10 ${i % 2 ? "md:[direction:rtl]" : ""}`}>
            <div className="md:[direction:ltr] pl-8 md:pl-0 md:pr-12 md:text-right">
              <div className="font-display font-extrabold text-4xl text-brand">{t.y}</div>
              <h3 className="font-display font-bold text-xl mt-2">{t.t}</h3>
              <p className="text-muted-foreground mt-2">{t.d}</p>
            </div>
            <div className="hidden md:block" />
            <span className="absolute left-0 md:left-1/2 -translate-x-1/2 top-2 w-3 h-3 bg-brand rounded-full ring-4 ring-background" />
          </div>
        ))}
      </div>
    </section>*/}

    {/* TEAM */}
    <section className="bg-card/40 border-y border-border py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold mb-3">Leadership</p>
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl mb-12">Multidisciplinary by experience.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((m) => (
            <div key={m.name} className="group">
              <div className="aspect-[4/5] overflow-hidden rounded-lg border border-border">
                <img src={m.img} alt={m.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"/>
              </div>
              <h3 className="font-display font-bold text-lg mt-4">{m.name}</h3>
              <p className="text-sm text-muted-foreground">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
