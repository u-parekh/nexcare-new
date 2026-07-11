import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { api } from "./api";

const KEY = "nexcare-visitor";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL?.replace(/\/+$/, "") || (process.env.NODE_ENV === "development" ? "http://localhost:8000" : "");

const getId = () => {
  if (typeof window === "undefined") return "anon";
  let id = localStorage.getItem(KEY);
  if (!id) { id = uuidv4(); localStorage.setItem(KEY, id); }
  return id;
};

export const useVisitTracking = (path) => {
  const startRef = useRef(Date.now());
  const [enabled] = useState(() => typeof window !== "undefined" && localStorage.getItem("nexcare-cookies") === "accepted");

  useEffect(() => {
    if (!enabled) return;
    const visitorId = getId();
    api.post("/track/visit", { visitor_id: visitorId, path, referrer: document.referrer, user_agent: navigator.userAgent }).catch(() => {});
    startRef.current = Date.now();
    const interval = setInterval(() => {
      const sec = Math.round((Date.now() - startRef.current) / 1000);
      if (sec > 0) {
        api.post("/track/heartbeat", { visitor_id: visitorId, path, seconds: sec }).catch(() => {});
        startRef.current = Date.now();
      }
    }, 15000);
    const onUnload = () => {
      const sec = Math.round((Date.now() - startRef.current) / 1000);
      if (sec > 0) navigator.sendBeacon && navigator.sendBeacon(
        `${BACKEND_URL || ""}/track/heartbeat`,
        new Blob([JSON.stringify({ visitor_id: visitorId, path, seconds: sec })], { type: "application/json" }),
      );
    };
    window.addEventListener("beforeunload", onUnload);
    return () => { clearInterval(interval); window.removeEventListener("beforeunload", onUnload); onUnload(); };
  }, [path, enabled]);
};

export const trackBrochure = () => api.post("/track/brochure").catch(() => {});
