import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const PROJECTS = [
  { img: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80", title: "Aurora Multispecialty", cat: "Multispecialty", meta: "420 beds • Pune, IN", year: "2023" },
  { img: "https://images.pexels.com/photos/4458205/pexels-photo-4458205.jpeg?auto=compress&cs=tinysrgb&w=1200", title: "Helix Cardiac Centre", cat: "Specialty", meta: "180 beds • Dubai, UAE", year: "2022" },
  { img: "https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=1200", title: "Meridian Cancer Institute", cat: "Specialty", meta: "300 beds • Singapore", year: "2024" },
  { img: "https://images.pexels.com/photos/6615086/pexels-photo-6615086.jpeg?auto=compress&cs=tinysrgb&w=1200", title: "Vesper Children's Hospital", cat: "Pediatric", meta: "150 beds • Bengaluru, IN", year: "2024" },
  { img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80", title: "Northpoint General", cat: "Multispecialty", meta: "650 beds • Mumbai, IN", year: "2021" },
  { img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80", title: "Riverbend Wellness", cat: "Wellness", meta: "80 beds • Goa, IN", year: "2023" },
  { img: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&q=80", title: "Solstice Eye Hospital", cat: "Specialty", meta: "60 beds • Hyderabad, IN", year: "2022" },
  { img: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1200&q=80", title: "Atlas Orthopaedic", cat: "Specialty", meta: "120 beds • Jakarta, ID", year: "2024" },
];

const CATS = ["All", "Multispecialty", "Specialty", "Pediatric", "Wellness"];

const Projects = () => {
  const [filter, setFilter] = useState("All");
  const list = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.cat === filter);
  return (
    <div data-testid="projects-page">
      <section className="relative py-24 border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">Projects</p>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl mt-4 max-w-4xl leading-[1.02]">
            Too many successful briefs. <span className="text-brand">One craft.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-7">A selection of healthcare environments shaped through clinical insight, operational rigor and design discipline.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="flex flex-wrap gap-2" data-testid="projects-filter">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              data-testid={`filter-${c.toLowerCase()}`}
              className={`px-4 py-2 rounded-md text-sm font-semibold border transition-colors ${
                filter === c
                  ? "bg-brand text-white border-brand"
                  : "bg-card border-border hover:border-brand"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="projects-grid">
        {list.map((p, i) => (
          <article key={p.title} className="group" data-testid={`project-${i}`}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border">
              <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 text-xs font-bold text-brand">{p.cat}</div>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white flex items-end justify-between">
                <div>
                  <h3 className="font-display font-bold text-2xl">{p.title}</h3>
                  <p className="text-xs opacity-80 mt-1">{p.meta} • {p.year}</p>
                </div>
                <ArrowUpRight className="w-6 h-6 transition-transform group-hover:rotate-45"/>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Projects;
