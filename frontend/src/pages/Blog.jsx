import { Clock, ArrowRight } from "lucide-react";

const POSTS = [
  { img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80", title: "The future of modular hospitals", date: "Feb 2026", read: "8 min", cat: "Architecture" },
  { img: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80", title: "Designing for infection control: a 2026 primer", date: "Jan 2026", read: "6 min", cat: "Clinical" },
  { img: "https://images.pexels.com/photos/6749774/pexels-photo-6749774.jpeg?auto=compress&cs=tinysrgb&w=1200", title: "Why NABH readiness starts at master-planning", date: "Dec 2025", read: "5 min", cat: "Operations" },
  { img: "https://images.pexels.com/photos/4421494/pexels-photo-4421494.jpeg?auto=compress&cs=tinysrgb&w=1200", title: "EMR selection: a buyer's framework", date: "Nov 2025", read: "10 min", cat: "Digital" },
  { img: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1200&q=80", title: "Biophilia & healing — the new evidence", date: "Oct 2025", read: "7 min", cat: "Design" },
  { img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80", title: "Net-zero hospitals: a roadmap for India", date: "Sep 2025", read: "9 min", cat: "Sustainability" },
];

const Blog = () => {
  const [feat, ...rest] = POSTS;
  return (
    <div data-testid="blog-page">
      <section className="border-b border-border py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">Insights</p>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl mt-4 max-w-3xl leading-[1.02]">Field notes from a healthcare studio.</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-7">Practical thinking on hospital planning, design quality, accreditation readiness and the future of care delivery.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <article className="grid lg:grid-cols-12 gap-8 group cursor-pointer" data-testid="blog-featured">
          <div className="lg:col-span-7 aspect-[16/10] overflow-hidden rounded-lg border border-border">
            <img src={feat.img} alt={feat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-widest text-brand-2 font-bold">{feat.cat} • Featured</p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl mt-4">{feat.title}</h2>
            <p className="text-muted-foreground mt-4 leading-7">A deep dive into how modular construction is rewriting the economics of mid-sized hospital projects across emerging markets.</p>
            <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
              <span>{feat.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {feat.read}</span>
            </div>
            <button className="mt-6 inline-flex items-center gap-2 text-brand font-semibold w-fit">Read article <ArrowRight className="w-4 h-4"/></button>
          </div>
        </article>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((p, i) => (
          <article key={p.title} className="group cursor-pointer" data-testid={`blog-card-${i}`}>
            <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border">
              <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
            </div>
            <p className="text-xs uppercase tracking-widest text-brand-2 font-bold mt-4">{p.cat}</p>
            <h3 className="font-display font-bold text-xl mt-2 group-hover:text-brand transition-colors">{p.title}</h3>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span>{p.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {p.read}</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Blog;
