import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiStar, FiTruck } from "react-icons/fi";
import { SERVICES } from "../data/services";
import { TESTIMONIALS, TRUST_BADGES } from "../data/testimonials";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import StarRating from "../components/StarRating";
import { useProducts } from "../utils/useProducts";
import styles from "./Home.module.css";

export default function Home() {
  // Featured products are fetched from the real backend (sorted by
  // popularity), not a static mock-data import.
  const featuredFilters = useMemo(() => ({ sort: "popularity" }), []);
  const { products, loading } = useProducts(featuredFilters);
  const featured = products.slice(0, 4);
  const [email, setEmail] = useState("");

  function handleNewsletterSubmit(e) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("You're subscribed! Welcome to Talpur Eye Care.");
    setEmail("");
  }

  return (
    <div className="page">
      {/* ---------------- HERO ---------------- */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div>
            <span className={styles.heroEyebrow}>Board-Certified Eye Care · Est. 2010</span>
            <h1 className={styles.heroTitle}>
              See the world in <em>crystal clarity</em>
            </h1>
            <p className={styles.heroSubtitle}>
              From comprehensive eye exams to designer prescription eyewear — Talpur Eye Care
              combines clinical expertise with a shopping experience that actually feels good.
            </p>
            <div className={styles.heroActions}>
              <Link to="/book-appointment" className="btn btn-accent">
                Book an Eye Exam
              </Link>
              <Link to="/shop" className="btn btn-outline-light">
                Shop Eyewear
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroImageCard}>
              <img src="https://picsum.photos/seed/talpur-hero/800/1000" alt="Patient smiling after an eye exam at Talpur Eye Care" />
            </div>
            <div className={`${styles.floatBadge} ${styles.floatBadgeTop}`}>
              <FiStar aria-hidden="true" fill="currentColor" />
              <span>4.9/5 from 1,200+ patients</span>
            </div>
            <div className={`${styles.floatBadge} ${styles.floatBadgeBottom}`}>
              <FiTruck aria-hidden="true" />
              <span>Free delivery on eyewear</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TRUST BADGES ---------------- */}
      <section className={styles.trustBar}>
        <div className={`container ${styles.trustGrid}`}>
          {TRUST_BADGES.map((b) => (
            <div key={b.id} className={styles.trustItem}>
              <b.icon aria-hidden="true" />
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- FEATURED PRODUCTS ---------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Featured Eyewear</span>
            <h2>Best-selling frames this season</h2>
            <p>Hand-picked prescription glasses and sunglasses, fitted and shipped to your door.</p>
          </div>
          <div className={styles.productGrid}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className={styles.viewAllWrap}>
            <Link to="/shop" className="btn btn-primary">
              View Full Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- SERVICES OVERVIEW ---------------- */}
      <section className={`section ${styles.servicesStrip}`}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Our Services</span>
            <h2>Comprehensive eye care, all in one place</h2>
            <p>From routine exams to surgical care, our ophthalmologists support every stage of your vision.</p>
          </div>
          <div className={styles.serviceMiniGrid}>
            {SERVICES.slice(0, 5).map((s) => (
              <Link to="/services" key={s.id} className={styles.serviceMini}>
                <span className={styles.serviceMiniIcon} aria-hidden="true"><s.icon /></span>
                <h3>{s.name}</h3>
                <p>{s.shortBlurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA BANNER ---------------- */}
      <section className="section">
        <div className="container">
          <div className={styles.ctaBanner}>
            <div>
              <h2>Not sure what your eyes need?</h2>
              <p>Book a comprehensive eye exam and our ophthalmologists will map out a care plan tailored to you.</p>
            </div>
            <Link to="/book-appointment" className="btn btn-primary">
              Book an Eye Exam
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Patient Stories</span>
            <h2>Loved by patients and shoppers alike</h2>
          </div>
          <div className={styles.testimonialGrid}>
            {TESTIMONIALS.slice(0, 4).map((t) => (
              <div key={t.id} className={styles.testimonialCard}>
                <StarRating rating={t.rating} />
                <p className={styles.testimonialQuote}>&ldquo;{t.quote}&rdquo;</p>
                <p className={styles.testimonialAuthor}>{t.name}</p>
                <p className={styles.testimonialContext}>{t.context}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- NEWSLETTER ---------------- */}
      <section className="section">
        <div className="container">
          <div className={styles.newsletter}>
            <h2>Stay in focus</h2>
            <p>Get eye-health tips, new frame drops, and exclusive subscriber discounts.</p>
            <form className={styles.newsletterForm} onSubmit={handleNewsletterSubmit}>
              <label htmlFor="newsletter-email" className="visually-hidden">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-accent">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
