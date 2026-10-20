import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scrolls to top on every route change for a cleaner page-transition feel. */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname]);
  return null;
}
