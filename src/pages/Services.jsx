import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import { SERVICES } from "../data/services";
import { formatPrice } from "../utils/format";
import styles from "./Services.module.css";

export default function Services() {
  return (
    <div className="page">
      <section className={styles.pageHero}>
        <div className="container">
          <h1>Our Ophthalmology Services</h1>
          <p>
            Full-spectrum eye care delivered by board-certified ophthalmologists and optometrists —
            from routine exams to specialized surgical treatment.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {SERVICES.map((svc) => (
              <article key={svc.id} className={`card ${styles.card}`}>
                <div className={styles.iconWrap} aria-hidden="true"><svc.icon /></div>
                <h3>{svc.name}</h3>
                <p>{svc.description}</p>
                <div className={styles.meta}>
                  <span><FiClock aria-hidden="true" /> {svc.duration}</span>
                  <span>From {formatPrice(svc.priceFrom)}</span>
                </div>
                <div className={styles.cardFooter}>
                  <Link to={`/book-appointment?service=${encodeURIComponent(svc.id)}`} className="btn btn-primary btn-sm">
                    Book Appointment
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
