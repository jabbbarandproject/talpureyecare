import { useState } from "react";
import toast from "react-hot-toast";
import { FiMapPin, FiPhone, FiMail, FiClock, FiMap, FiCheckCircle } from "react-icons/fi";
import { submitContactMessage } from "../utils/api";
import styles from "./Contact.module.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.message.trim() || form.message.trim().length < 10) errs.message = "Message should be at least 10 characters.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setSubmitting(true);
    try {
      // Contact form now flows through the real backend (POST /api/contact).
      await submitContactMessage(form);
      setSent(true);
      toast.success("Message sent! We'll be in touch soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(err.message || "Couldn't send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page section">
      <div className="container">
        <div className="section-head" style={{ marginBottom: "var(--sp-7)" }}>
          <span className="eyebrow">Get in Touch</span>
          <h1 style={{ fontSize: "var(--fs-2xl)" }}>Contact Talpur Eye Care</h1>
          <p>Questions about an appointment, an order, or insurance? We're happy to help.</p>
        </div>

        <div className={styles.layout}>
          <div>
            <div className={`card ${styles.infoCard}`}>
              <div className={styles.infoRow}>
                <FiMapPin className={styles.infoIcon} aria-hidden="true" />
                <div>
                  <h4>Address</h4>
                  <p>128 Harbor View Avenue, Suite 300<br />Seacliff, CA 94920</p>
                </div>
              </div>
              <div className={styles.infoRow}>
                <FiPhone className={styles.infoIcon} aria-hidden="true" />
                <div>
                  <h4>Phone</h4>
                  <a href="tel:+18885551234">(888) 555-1234</a>
                </div>
              </div>
              <div className={styles.infoRow}>
                <FiMail className={styles.infoIcon} aria-hidden="true" />
                <div>
                  <h4>Email</h4>
                  <a href="mailto:hello@talpureyecare.example">hello@talpureyecare.example</a>
                </div>
              </div>
              <div className={styles.infoRow}>
                <FiClock className={styles.infoIcon} aria-hidden="true" />
                <div>
                  <h4>Hours</h4>
                  <p>Mon–Fri: 8am – 6pm<br />Sat: 9am – 3pm · Sun: Closed</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: "var(--sp-5)" }}>
              <div className={styles.mapPlaceholder}>
                <FiMap aria-hidden="true" className={styles.mapIcon} />
                <span>Map preview unavailable in demo<br />128 Harbor View Avenue, Seacliff, CA</span>
              </div>
            </div>
          </div>

          <form className={`card ${styles.formCard}`} onSubmit={handleSubmit} noValidate>
            {sent && (
              <div style={{ background: "var(--color-teal-100)", padding: "var(--sp-4)", borderRadius: "var(--radius-sm)", marginBottom: "var(--sp-5)", fontSize: "var(--fs-sm)", fontWeight: 600, color: "var(--color-navy-800)" }}>
                <FiCheckCircle aria-hidden="true" style={{ verticalAlign: "-2px", marginRight: "0.4rem" }} />
                Thanks for reaching out — our team typically replies within one business day.
              </div>
            )}
            <div className="field">
              <label htmlFor="name">Your Name *</label>
              <input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} className={errors.name ? "has-error" : ""} />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>
            <div className="field">
              <label htmlFor="email">Email Address *</label>
              <input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={errors.email ? "has-error" : ""} />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>
            <div className="field">
              <label htmlFor="message">Message *</label>
              <textarea id="message" rows={6} value={form.message} onChange={(e) => update("message", e.target.value)} className={errors.message ? "has-error" : ""} placeholder="How can we help?" />
              {errors.message && <p className="field-error">{errors.message}</p>}
            </div>
            <button type="submit" className="btn btn-accent btn-block" disabled={submitting}>
              {submitting ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
