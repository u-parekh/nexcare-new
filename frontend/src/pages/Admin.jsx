import { useEffect, useState } from "react";
import { Lock, Trash2, RefreshCcw, Mail, LogOut, Search, Users, Eye, Download, Smartphone, MapPin, Clock, Inbox } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { LogoMark } from "../components/LogoMark";
import { adminLogin, fetchContacts, deleteContact, updateStatus, fetchAnalytics, fetchVisitors, fetchBrochures } from "../lib/api";

const TABS = [
  { k: "overview", l: "Overview", i: Eye },
  { k: "contacts", l: "Contacts", i: Inbox },
  { k: "visitors", l: "Quiz Visitors", i: Users },
  { k: "brochures", l: "Brochures", i: Download },
];

const StatCard = ({ label, value, sub }) => (
  <div className="p-5 rounded-lg border border-border bg-card">
    <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className="font-display font-extrabold text-3xl text-brand mt-2">{value}</p>
    {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
  </div>
);

const Bar = ({ data, max }) => (
  <div className="space-y-2">
    {data.slice(0, 6).map((d) => (
      <div key={d.name || d.path}>
        <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{d.name || d.path}</span><span className="font-semibold">{d.count}</span></div>
        <div className="h-1.5 bg-accent rounded-full overflow-hidden"><div className="h-full bg-brand" style={{ width: `${(d.count / max) * 100}%` }}/></div>
      </div>
    ))}
  </div>
);

const Admin = () => {
  const [token, setToken] = useState(() => localStorage.getItem("nexcare-admin") || "");
  const [pw, setPw] = useState("");
  const [tab, setTab] = useState("overview");
  const [analytics, setAnalytics] = useState(null);
  const [contacts, setContacts] = useState({ items: [], total: 0, pages: 1 });
  const [cPage, setCPage] = useState(1);
  const [cSort, setCSort] = useState("latest");
  const [cSearch, setCSearch] = useState("");
  const [visitors, setVisitors] = useState({ items: [], total: 0, pages: 1 });
  const [vPage, setVPage] = useState(1);
  const [brochures, setBrochures] = useState({ items: [], total: 0, pages: 1 });
  const [bPage, setBPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const loadAll = useCallback(async (t) => {
    try {
      const [a, c, v, b] = await Promise.all([
        fetchAnalytics(t),
        fetchContacts(t, { page: cPage, sort: cSort, search: cSearch }),
        fetchVisitors(t, { page: vPage }),
        fetchBrochures(t, { page: bPage }),
      ]);
      setAnalytics(a); setContacts(c); setVisitors(v); setBrochures(b);
    } catch (e) {
      if (e?.response?.status === 401) { setToken(""); localStorage.removeItem("nexcare-admin"); toast.error("Session expired"); }
      else toast.error("Failed to fetch data");
    }
  }, [cPage, cSort, cSearch, vPage, bPage]);

  useEffect(() => { if (token) loadAll(token); /* eslint-disable-next-line */ }, [token, loadAll]);
  useEffect(() => { if (token) fetchContacts(token, { page: cPage, sort: cSort, search: cSearch }).then(setContacts).catch(()=>{}); /* eslint-disable-next-line */ }, [token,cPage, cSort, cSearch]);
  useEffect(() => { if (token) fetchVisitors(token, { page: vPage }).then(setVisitors).catch(()=>{}); /* eslint-disable-next-line */ }, [token, vPage]);
  useEffect(() => { if (token) fetchBrochures(token, { page: bPage }).then(setBrochures).catch(()=>{}); /* eslint-disable-next-line */ }, [token, bPage]);

  const login = async (e) => {
    e.preventDefault();
    try { const r = await adminLogin(pw); setToken(r.token); localStorage.setItem("nexcare-admin", r.token); toast.success("Welcome"); }
    catch { toast.error("Invalid password"); }
  };
  const logout = () => { setToken(""); localStorage.removeItem("nexcare-admin"); };
  const removeC = async (id) => { if (!window.confirm("Delete?")) return; await deleteContact(token, id); loadAll(token); };
  const markC = async (id, s) => { await updateStatus(token, id, s); loadAll(token); };

  if (!token) {
    return (
      <div className="min-h-screen grid place-items-center px-6 bg-background grid-pattern">
        <form onSubmit={login} className="w-full max-w-md p-10 rounded-lg border border-border bg-card relative overflow-hidden" data-testid="admin-login-form">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand/20 blur-3xl rounded-full"/>
          <Link to="/" className="flex items-center gap-2 mb-8"><LogoMark className="w-9 h-9"/><span className="font-display font-extrabold">NEX<span className="text-brand-2">CARE</span></span></Link>
          <h1 className="font-display font-extrabold text-3xl mb-2 flex items-center gap-2"><Lock className="w-6 h-6 text-brand"/> Admin Access</h1>
          <p className="text-sm text-muted-foreground mb-6">Enter password to view analytics & submissions.</p>
          <input data-testid="admin-pw" type="password" placeholder="Admin password" value={pw} onChange={(e) => setPw(e.target.value)} className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-sm"/>
          <button data-testid="admin-login-btn" className="mt-4 w-full py-3 rounded-md bg-brand text-white font-semibold">Sign in</button>
        </form>
      </div>
    );
  }

  const a = analytics;
  return (
    <div className="min-h-screen bg-background" data-testid="admin-dashboard">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2"><LogoMark className="w-8 h-8"/><span className="font-display font-extrabold text-sm">NEX<span className="text-brand-2">CARE</span> · Admin</span></Link>
          <div className="flex items-center gap-2">
            <button onClick={() => loadAll(token)} data-testid="admin-refresh" className="p-2 rounded-md hover:bg-accent"><RefreshCcw className="w-4 h-4"/></button>
            <button onClick={logout} data-testid="admin-logout" className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent"><LogOut className="w-4 h-4"/> Logout</button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.k} onClick={() => setTab(t.k)} data-testid={`tab-${t.k}`} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.k ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <t.i className="w-4 h-4"/> {t.l}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {tab === "overview" && a && (
          <div data-testid="tab-overview-content">
            <h1 className="font-display font-extrabold text-4xl mb-2">Real-time analytics</h1>
            <p className="text-muted-foreground mb-8">Last 24 hours and lifetime metrics.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Visits (24h)" value={a.totals.visits_24h} sub={`${a.totals.visits} lifetime`}/>
              <StatCard label="Unique visitors" value={a.totals.unique_visitors}/>
              <StatCard label="Avg time / visitor" value={`${Math.floor(a.totals.avg_seconds/60)}m ${a.totals.avg_seconds%60}s`}/>
              <StatCard label="Brochures (24h)" value={a.totals.brochures_24h} sub={`${a.totals.brochures} lifetime`}/>
              <StatCard label="New contacts" value={a.totals.contacts_new} sub={`${a.totals.contacts} total`}/>
              <StatCard label="Quiz submissions" value={a.totals.quizzes}/>
            </div>
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-display font-bold flex items-center gap-2 mb-4"><Eye className="w-4 h-4 text-brand"/> Top pages</h3>
                <Bar data={a.top_pages} max={Math.max(1, ...a.top_pages.map(p=>p.count))}/>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-display font-bold flex items-center gap-2 mb-4"><Smartphone className="w-4 h-4 text-brand"/> Devices</h3>
                <Bar data={a.devices} max={Math.max(1, ...a.devices.map(p=>p.count))}/>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-display font-bold flex items-center gap-2 mb-4"><MapPin className="w-4 h-4 text-brand"/> Top countries</h3>
                <Bar data={a.countries} max={Math.max(1, ...a.countries.map(p=>p.count))}/>
              </div>
            </div>
            <div className="mt-6 p-6 rounded-lg border border-border bg-card">
              <h3 className="font-display font-bold flex items-center gap-2 mb-4"><Clock className="w-4 h-4 text-brand"/> Last 7 days</h3>
              <div className="flex gap-1 items-end h-32">
                {a.series.map((s) => {
                  const max = Math.max(1, ...a.series.map(x=>x.count));
                  return <div key={s.date} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-brand/70 hover:bg-brand rounded-t transition-colors" style={{ height: `${(s.count/max)*100}%` }} title={`${s.date}: ${s.count}`}/>
                    <span className="text-[10px] text-muted-foreground">{s.date.slice(5)}</span>
                  </div>;
                })}
              </div>
            </div>
          </div>
        )}

        {tab === "contacts" && (
          <div data-testid="tab-contacts-content">
            <h1 className="font-display font-extrabold text-4xl mb-6">Contact submissions</h1>
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="relative flex-1"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                <input data-testid="c-search" placeholder="Search…" value={cSearch} onChange={(e) => { setCPage(1); setCSearch(e.target.value); }} className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-md text-sm focus:ring-2 focus:ring-brand focus:outline-none"/>
              </div>
              <select data-testid="c-sort" value={cSort} onChange={(e) => { setCPage(1); setCSort(e.target.value); }} className="px-4 py-2.5 bg-card border border-border rounded-md text-sm">
                <option value="latest">Latest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
            <div className="rounded-lg border border-border bg-card overflow-x-auto">
              <table className="w-full text-sm" data-testid="c-table">
                <thead className="bg-accent/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3 hidden md:table-cell">Email</th><th className="px-4 py-3 hidden lg:table-cell">Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr>
                </thead>
                <tbody>
                  {contacts.items.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No submissions.</td></tr>}
                  {contacts.items.map((c) => (
                    <tr key={c.id} className="border-t border-border hover:bg-accent/30">
                      <td className="px-4 py-3 font-semibold">{c.name}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{c.email}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">{new Date(c.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <select value={c.status} onChange={(e) => markC(c.id, e.target.value)} className="px-2 py-1 text-xs bg-background border border-border rounded">
                          {["new","read","replied","archived"].map(s=><option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <button onClick={() => setSelected(c)} className="px-2 py-1 text-xs rounded border border-border hover:border-brand">View</button>
                          <a href={`mailto:${c.email}`} className="grid place-items-center w-7 h-7 rounded border border-border hover:border-brand"><Mail className="w-3.5 h-3.5"/></a>
                          <button onClick={() => removeC(c.id)} className="grid place-items-center w-7 h-7 rounded border border-border hover:border-red-500 hover:text-red-500"><Trash2 className="w-3.5 h-3.5"/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={cPage} pages={contacts.pages} onChange={setCPage} testid="c-pager"/>
          </div>
        )}

        {tab === "visitors" && (
          <div data-testid="tab-visitors-content">
            <h1 className="font-display font-extrabold text-4xl mb-6">Quiz visitors</h1>
            <div className="rounded-lg border border-border bg-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-accent/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3 hidden md:table-cell">Phone</th><th className="px-4 py-3">Score</th><th className="px-4 py-3 hidden lg:table-cell">Location</th><th className="px-4 py-3 hidden lg:table-cell">Device</th><th className="px-4 py-3 hidden lg:table-cell">Date</th></tr>
                </thead>
                <tbody>
                  {visitors.items.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No quiz submissions yet.</td></tr>}
                  {visitors.items.map((v) => (
                    <tr key={v.id} className="border-t border-border hover:bg-accent/30">
                      <td className="px-4 py-3 font-semibold">{v.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{v.email}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{v.phone}</td>
                      <td className="px-4 py-3 font-bold text-brand">{v.score}/{v.total}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">{v.city}, {v.country}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">{v.device} · {v.browser}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">{new Date(v.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={vPage} pages={visitors.pages} onChange={setVPage} testid="v-pager"/>
          </div>
        )}

        {tab === "brochures" && (
          <div data-testid="tab-brochures-content">
            <h1 className="font-display font-extrabold text-4xl mb-6">Brochure downloads</h1>
            <div className="rounded-lg border border-border bg-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-accent/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr><th className="px-4 py-3">IP</th><th className="px-4 py-3">Location</th><th className="px-4 py-3 hidden md:table-cell">Device</th><th className="px-4 py-3 hidden lg:table-cell">Browser</th><th className="px-4 py-3">Date</th></tr>
                </thead>
                <tbody>
                  {brochures.items.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No downloads yet.</td></tr>}
                  {brochures.items.map((b) => (
                    <tr key={b.id} className="border-t border-border hover:bg-accent/30">
                      <td className="px-4 py-3 font-mono text-xs">{b.ip}</td>
                      <td className="px-4 py-3 text-muted-foreground">{b.city}, {b.country}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{b.device}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{b.browser}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(b.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={bPage} pages={brochures.pages} onChange={setBPage} testid="b-pager"/>
          </div>
        )}
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center px-4" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-card border border-border rounded-lg p-8 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div><p className="text-xs uppercase tracking-wider text-brand-2 font-bold">Submission</p><h3 className="font-display font-extrabold text-3xl mt-1">{selected.name}</h3></div>
              <button onClick={() => setSelected(null)} className="p-2 rounded hover:bg-accent">✕</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
              <div><p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p><a className="text-brand" href={`mailto:${selected.email}`}>{selected.email}</a></div>
              <div><p className="text-xs text-muted-foreground uppercase tracking-wider">Phone</p><p>{selected.phone || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase tracking-wider">Service</p><p>{selected.service || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase tracking-wider">Subject</p><p>{selected.subject || "—"}</p></div>
            </div>
            <div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Message</p>
              <div className="p-4 rounded-md bg-background border border-border whitespace-pre-wrap leading-7 text-sm">{selected.message}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Pager = ({ page, pages, onChange, testid }) => (
  <div className="mt-4 flex items-center justify-between" data-testid={testid}>
    <p className="text-xs text-muted-foreground">Page {page} of {pages}</p>
    <div className="flex gap-2">
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page <= 1} className="px-3 py-1.5 rounded-md border border-border text-sm disabled:opacity-40">Prev</button>
      <button onClick={() => onChange(Math.min(pages, page + 1))} disabled={page >= pages} className="px-3 py-1.5 rounded-md border border-border text-sm disabled:opacity-40">Next</button>
    </div>
  </div>
);

export default Admin;
