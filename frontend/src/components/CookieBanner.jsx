import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";

const KEY = "nexcare-cookies";

const CookieBanner = () => {
  const [show, setShow] = useState(false);
  useEffect(() => { if (!localStorage.getItem(KEY)) setShow(true); }, []);
  const decide = (val) => { localStorage.setItem(KEY, val); setShow(false); window.location.reload(); };
  if (!show) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-[60] p-5 rounded-lg border border-border bg-card shadow-2xl backdrop-blur" data-testid="cookie-banner">
      <div className="flex items-start gap-3">
        <Cookie className="w-6 h-6 text-brand-2 shrink-0 mt-0.5"/>
        <div className="flex-1">
          <h4 className="font-display font-bold text-sm mb-1">Essential cookies</h4>
          <p className="text-xs text-muted-foreground leading-5">
            We use essential cookies for site functionality and anonymous analytics to improve NEXCARE. See our privacy policy for details.
          </p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => decide("accepted")} data-testid="cookie-accept" className="px-4 py-2 bg-brand text-white rounded-md text-xs font-semibold hover:opacity-90">Accept</button>
            <button onClick={() => decide("declined")} data-testid="cookie-decline" className="px-4 py-2 border border-border rounded-md text-xs font-semibold hover:border-brand">Decline</button>
          </div>
        </div>
        <button onClick={() => decide("declined")} className="p-1 rounded hover:bg-accent"><X className="w-4 h-4"/></button>
      </div>
    </div>
  );
};

export default CookieBanner;
