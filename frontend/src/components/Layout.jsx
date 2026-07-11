import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "./Chatbot";
import CookieBanner from "./CookieBanner";
import BackToTop from "./BackToTop";
import { useVisitTracking } from "../lib/tracking";

const Layout = () => {
  const loc = useLocation();
  useVisitTracking(loc.pathname);

  // Footer/nav links should scroll to top automatically on navigation
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [loc.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
      <Chatbot />
      <CookieBanner />
      <BackToTop />
    </div>
  );
};

export default Layout;
