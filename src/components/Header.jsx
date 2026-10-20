import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiSearch, FiX, FiShoppingBag } from "react-icons/fi";
import Logo from "./Logo";
import { useCartStore } from "../store/useCartStore";
import { useCartDrawerStore } from "../store/useCartDrawerStore";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const itemCount = useCartStore((s) => s.getItemCount());
  const toggleCartDrawer = useCartDrawerStore((s) => s.toggle);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
    setSearchOpen(false);
    setMenuOpen(false);
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <Logo />

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/book-appointment" className={styles.navCta} onClick={() => setMenuOpen(false)}>
            Book an Eye Exam
          </NavLink>
        </nav>

        <div className={styles.actions}>
          <form
            className={`${styles.searchForm} ${searchOpen ? styles.searchOpen : ""}`}
            onSubmit={handleSearchSubmit}
            role="search"
          >
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search glasses, sunglasses…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
          </form>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Toggle search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            {searchOpen ? <FiX aria-hidden="true" /> : <FiSearch aria-hidden="true" />}
          </button>

          <button
            type="button"
            className={styles.cartBtn}
            aria-label={`Cart, ${itemCount} items`}
            onClick={toggleCartDrawer}
          >
            <FiShoppingBag aria-hidden="true" />
            {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
          </button>

          <button
            type="button"
            className={styles.menuToggle}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
