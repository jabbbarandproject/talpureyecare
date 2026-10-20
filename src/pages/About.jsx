import { FiStar } from "react-icons/fi";
import { DOCTORS } from "../data/doctors";
import styles from "./About.module.css";

export default function About() {
  return (
    <div className="page">
      <section className="section">
        <div className="container">
          <div className={styles.hero}>
            <div className={styles.heroText}>
              <span className="eyebrow">Our Story</span>
              <h1>Clear vision has been our mission since 2010</h1>
              <p>
                Talpur Eye Care began as a single exam room with one ophthalmologist and a simple
                belief: eye care should feel personal, modern, and genuinely caring — not clinical
                and cold. Fifteen years later, we've grown into a full-service clinic offering
                everything from routine exams to advanced surgical care, alongside a curated optical
                shop so patients never have to choose between great care and great style.
              </p>
              <p>
                Today, our team of board-certified ophthalmologists and optometrists has cared for
                over 40,000 patients, performed thousands of successful procedures, and shipped
                designer eyewear to customers across the country — all without losing the
                neighborhood-clinic warmth we started with.
              </p>
              <div className={styles.statsRow}>
                <div className={styles.stat}>
                  <span className={styles.statNum}>40k+</span>
                  <span className={styles.statLabel}>Patients Cared For</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNum}>15</span>
                  <span className={styles.statLabel}>Years in Practice</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNum}>
                    4.9 <FiStar aria-hidden="true" className={styles.statStar} fill="currentColor" />
                  </span>
                  <span className={styles.statLabel}>Average Rating</span>
                </div>
              </div>
            </div>
            <div className={styles.heroImage}>
              <img src="https://picsum.photos/seed/talpur-clinic/700/560" alt="Talpur Eye Care clinic interior" />
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--color-teal-100)" }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Meet the Team</span>
            <h2>Our Ophthalmologists &amp; Optometrists</h2>
            <p>Fellowship-trained specialists dedicated to protecting and restoring your vision.</p>
          </div>
          <div className={styles.doctorsGrid}>
            {DOCTORS.map((doc) => (
              <article key={doc.id} className={`card ${styles.doctorCard}`}>
                <div className={styles.doctorPhoto}>
                  <img src={doc.photo} alt={doc.name} />
                </div>
                <div className={styles.doctorBody}>
                  <h3>{doc.name}</h3>
                  <p className={styles.doctorTitle}>{doc.title}</p>
                  <div className={styles.specialtyTags}>
                    {doc.specialties.map((s) => <span key={s}>{s}</span>)}
                  </div>
                  <p className={styles.credentials}>{doc.credentials}</p>
                  <p className={styles.bio}>{doc.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
