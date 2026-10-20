import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiCheckCircle, FiMail, FiCreditCard, FiEye, FiClock } from "react-icons/fi";
import { SERVICES, DOCTORS_FOR_BOOKING } from "../data/services";
import { useAppointmentsStore } from "../store/useAppointmentsStore";
import { createAppointment } from "../utils/api";
import styles from "./BookAppointment.module.css";

const REASONS = [
  "Routine check-up",
  "Blurry or changing vision",
  "Eye pain or discomfort",
  "Follow-up on existing treatment",
  "New patient / first visit",
  "Other",
];

function getTodayPlusDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function BookAppointment() {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get("service") || "";
  const addAppointment = useAppointmentsStore((s) => s.addAppointment);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    serviceId: preselectedService,
    doctorId: "doc-any",
    reason: REASONS[0],
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }));
  }

  function validate() {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required.";
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (!phoneDigits) errs.phone = "Phone number is required.";
    else if (phoneDigits.length < 10) errs.phone = "Enter a valid phone number (at least 10 digits).";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.date) errs.date = "Please select a preferred date.";
    if (!form.time) errs.time = "Please select a preferred time.";
    if (!form.serviceId) errs.serviceId = "Please select a service.";
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

    const service = SERVICES.find((s) => s.id === form.serviceId);
    const doctor = DOCTORS_FOR_BOOKING.find((d) => d.id === form.doctorId);

    setSubmitting(true);
    try {
      // Appointment booking now flows through the real backend (POST /api/appointments).
      const { appointment } = await createAppointment({
        ...form,
        serviceName: service?.name || "General Consultation",
        doctorName: doctor?.name || "Earliest available",
      });
      addAppointment(appointment);
      setConfirmed(appointment);
      toast.success("Appointment request received!");
    } catch (err) {
      toast.error(err.message || "Couldn't submit your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <div className="page">
        <section className="section">
          <div className="container">
            <div className={`card ${styles.successWrap}`} style={{ maxWidth: 560, margin: "0 auto" }}>
              <FiCheckCircle className={styles.successIcon} aria-hidden="true" />
              <h2>Appointment Request Received</h2>
              <p>We've saved your request and a care coordinator will confirm your exact slot shortly.</p>
              <div className={styles.detailBox}>
                <p><strong>Confirmation #:</strong> {confirmed.id}</p>
                <p><strong>Patient:</strong> {confirmed.fullName}</p>
                <p><strong>Service:</strong> {confirmed.serviceName}</p>
                <p><strong>Doctor:</strong> {confirmed.doctorName}</p>
                <p><strong>Preferred date/time:</strong> {confirmed.date} at {confirmed.time}</p>
              </div>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <Link to="/" className="btn btn-outline">Back to Home</Link>
                <Link to="/shop" className="btn btn-primary">Browse Eyewear</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className={styles.pageHero}>
        <div className="container">
          <h1>Book an Eye Exam</h1>
          <p>Tell us a bit about what you need and we'll match you with the right doctor and time slot.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.layout}>
            <form className={`card ${styles.formCard}`} onSubmit={handleSubmit} noValidate>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    id="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    className={errors.fullName ? "has-error" : ""}
                    placeholder="Jane Doe"
                  />
                  {errors.fullName && <p className="field-error">{errors.fullName}</p>}
                </div>
                <div className="field">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className={errors.phone ? "has-error" : ""}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && <p className="field-error">{errors.phone}</p>}
                </div>
              </div>

              <div className="field">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={errors.email ? "has-error" : ""}
                  placeholder="jane@example.com"
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="date">Preferred Date *</label>
                  <input
                    id="date"
                    type="date"
                    min={getTodayPlusDays(0)}
                    max={getTodayPlusDays(90)}
                    value={form.date}
                    onChange={(e) => update("date", e.target.value)}
                    className={errors.date ? "has-error" : ""}
                  />
                  {errors.date && <p className="field-error">{errors.date}</p>}
                </div>
                <div className="field">
                  <label htmlFor="time">Preferred Time *</label>
                  <input
                    id="time"
                    type="time"
                    value={form.time}
                    onChange={(e) => update("time", e.target.value)}
                    className={errors.time ? "has-error" : ""}
                  />
                  {errors.time && <p className="field-error">{errors.time}</p>}
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="serviceId">Service *</label>
                  <select
                    id="serviceId"
                    value={form.serviceId}
                    onChange={(e) => update("serviceId", e.target.value)}
                    className={errors.serviceId ? "has-error" : ""}
                  >
                    <option value="">Select a service…</option>
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  {errors.serviceId && <p className="field-error">{errors.serviceId}</p>}
                </div>
                <div className="field">
                  <label htmlFor="doctorId">Preferred Doctor</label>
                  <select id="doctorId" value={form.doctorId} onChange={(e) => update("doctorId", e.target.value)}>
                    {DOCTORS_FOR_BOOKING.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="reason">Reason for Visit</label>
                <select id="reason" value={form.reason} onChange={(e) => update("reason", e.target.value)}>
                  {REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  rows={4}
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Anything else we should know before your visit?"
                />
              </div>

              <button type="submit" className="btn btn-accent btn-block" disabled={submitting}>
                {submitting ? "Submitting…" : "Request Appointment"}
              </button>
            </form>

            <aside className={`card ${styles.sidebar}`}>
              <h3>What to expect</h3>
              <ul>
                <li><FiMail aria-hidden="true" /> A care coordinator confirms your exact slot within 1 business day.</li>
                <li><FiCreditCard aria-hidden="true" /> Bring a photo ID and your insurance card (if applicable).</li>
                <li><FiEye aria-hidden="true" /> Bring your current glasses or contact lens prescription, if any.</li>
                <li><FiClock aria-hidden="true" /> Most exams take 30–60 minutes depending on the service.</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
