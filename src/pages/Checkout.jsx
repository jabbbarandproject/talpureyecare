import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiCreditCard, FiDollarSign } from "react-icons/fi";
import { useCartStore } from "../store/useCartStore";
import { useOrdersStore } from "../store/useOrdersStore";
import { getFrameSvgComponent } from "../components/glasses-svg/shapes";
import { createOrder } from "../utils/api";
import { formatPrice } from "../utils/format";
import styles from "./Checkout.module.css";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  zip: "",
  country: "United States",
  paymentMethod: "card",
  cardNumber: "",
  cardName: "",
  expiry: "",
  cvv: "",
};

export default function Checkout() {
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDiscount = useCartStore((s) => s.getDiscount);
  const getShipping = useCartStore((s) => s.getShipping);
  const getTotal = useCartStore((s) => s.getTotal);
  const promoCode = useCartStore((s) => s.promoCode);
  const clearCart = useCartStore((s) => s.clearCart);
  const addOrder = useOrdersStore((s) => s.addOrder);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="page section">
        <div className="container">
          <div className="card" style={{ maxWidth: 480, margin: "0 auto", padding: "var(--sp-8)", textAlign: "center" }}>
            <h2 style={{ marginBottom: "var(--sp-3)" }}>Nothing to check out</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "var(--sp-5)" }}>Your cart is empty.</p>
            <Link to="/shop" className="btn btn-primary">Shop Eyewear</Link>
          </div>
        </div>
      </div>
    );
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }));
  }

  function formatCardNumberInput(value) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiryInput(value) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  function validate() {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address.";
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (!phoneDigits || phoneDigits.length < 10) errs.phone = "Enter a valid phone number.";
    if (!form.address.trim()) errs.address = "Shipping address is required.";
    if (!form.city.trim()) errs.city = "City is required.";
    if (!/^\d{4,6}$/.test(form.zip.trim())) errs.zip = "Enter a valid ZIP/postal code.";

    if (form.paymentMethod === "card") {
      const cardDigits = form.cardNumber.replace(/\D/g, "");
      if (cardDigits.length !== 16) errs.cardNumber = "Card number must be 16 digits.";
      if (!form.cardName.trim()) errs.cardName = "Name on card is required.";
      if (!/^\d{2}\/\d{2}$/.test(form.expiry.trim())) {
        errs.expiry = "Use MM/YY format.";
      } else {
        const [mm, yy] = form.expiry.split("/").map(Number);
        if (mm < 1 || mm > 12) errs.expiry = "Enter a valid month (01–12).";
        else {
          const now = new Date();
          const currentYY = now.getFullYear() % 100;
          const currentMM = now.getMonth() + 1;
          if (yy < currentYY || (yy === currentYY && mm < currentMM)) {
            errs.expiry = "Card has expired.";
          }
        }
      }
      if (!/^\d{3,4}$/.test(form.cvv.trim())) errs.cvv = "CVV must be 3–4 digits.";
    }

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

    const shippingAddress = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      zip: form.zip,
      country: form.country,
    };

    let order;
    try {
      // Orders now flow through the real backend (POST /api/orders), which
      // validates the payload, generates the canonical order id, and persists it.
      const { order: serverOrder } = await createOrder({
        items,
        shippingAddress,
        paymentMethod: form.paymentMethod,
        discount: getDiscount(),
        shipping: getShipping(),
        promoCode,
      });
      order = {
        ...serverOrder,
        shipping_address: serverOrder.shippingAddress,
      };
      // Keep a local copy too, so Order Confirmation / order history still
      // work instantly from localStorage without an extra round trip.
      addOrder(order);
    } catch (err) {
      setSubmitting(false);
      toast.error(err.message || "Couldn't place order. Please try again.");
      return;
    }

    clearCart();
    setSubmitting(false);
    toast.success("Order placed successfully!");
    navigate("/order-confirmation", { state: { orderId: order.id } });
  }

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shippingCost = getShipping();
  const total = getTotal();

  return (
    <div className="page section">
      <div className="container">
        <h1 style={{ marginBottom: "var(--sp-6)" }}>Checkout</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.layout}>
            <div>
              <div className={`card ${styles.formSection}`}>
                <h3><span className={styles.stepBadge}>1</span> Shipping &amp; Contact</h3>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="fullName">Full Name *</label>
                    <input id="fullName" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className={errors.fullName ? "has-error" : ""} />
                    {errors.fullName && <p className="field-error">{errors.fullName}</p>}
                  </div>
                  <div className="field">
                    <label htmlFor="phone">Phone *</label>
                    <input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={errors.phone ? "has-error" : ""} placeholder="(555) 123-4567" />
                    {errors.phone && <p className="field-error">{errors.phone}</p>}
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="email">Email *</label>
                  <input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={errors.email ? "has-error" : ""} />
                  {errors.email && <p className="field-error">{errors.email}</p>}
                </div>
                <div className="field">
                  <label htmlFor="address">Shipping Address *</label>
                  <input id="address" value={form.address} onChange={(e) => update("address", e.target.value)} className={errors.address ? "has-error" : ""} placeholder="123 Main St, Apt 4B" />
                  {errors.address && <p className="field-error">{errors.address}</p>}
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="city">City *</label>
                    <input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} className={errors.city ? "has-error" : ""} />
                    {errors.city && <p className="field-error">{errors.city}</p>}
                  </div>
                  <div className="field">
                    <label htmlFor="zip">ZIP / Postal Code *</label>
                    <input id="zip" value={form.zip} onChange={(e) => update("zip", e.target.value)} className={errors.zip ? "has-error" : ""} placeholder="94920" />
                    {errors.zip && <p className="field-error">{errors.zip}</p>}
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="country">Country</label>
                  <select id="country" value={form.country} onChange={(e) => update("country", e.target.value)}>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>

              <div className={`card ${styles.formSection}`}>
                <h3><span className={styles.stepBadge}>2</span> Payment Method</h3>
                <div className={styles.paymentOptions}>
                  <label className={`${styles.paymentOption} ${form.paymentMethod === "card" ? styles.active : ""}`}>
                    <input type="radio" name="paymentMethod" value="card" checked={form.paymentMethod === "card"} onChange={() => update("paymentMethod", "card")} />
                    <span><FiCreditCard aria-hidden="true" /> Credit / Debit Card</span>
                  </label>
                  <label className={`${styles.paymentOption} ${form.paymentMethod === "cod" ? styles.active : ""}`}>
                    <input type="radio" name="paymentMethod" value="cod" checked={form.paymentMethod === "cod"} onChange={() => update("paymentMethod", "cod")} />
                    <span><FiDollarSign aria-hidden="true" /> Cash on Delivery</span>
                  </label>
                </div>

                {form.paymentMethod === "card" ? (
                  <>
                    <div className="field">
                      <label htmlFor="cardName">Name on Card *</label>
                      <input id="cardName" value={form.cardName} onChange={(e) => update("cardName", e.target.value)} className={errors.cardName ? "has-error" : ""} />
                      {errors.cardName && <p className="field-error">{errors.cardName}</p>}
                    </div>
                    <div className="field">
                      <label htmlFor="cardNumber">Card Number *</label>
                      <input
                        id="cardNumber"
                        value={form.cardNumber}
                        onChange={(e) => update("cardNumber", formatCardNumberInput(e.target.value))}
                        className={errors.cardNumber ? "has-error" : ""}
                        placeholder="1234 5678 9012 3456"
                        inputMode="numeric"
                      />
                      {errors.cardNumber && <p className="field-error">{errors.cardNumber}</p>}
                    </div>
                    <div className={styles.cardFieldsRow}>
                      <div className="field">
                        <label htmlFor="expiry">Expiry (MM/YY) *</label>
                        <input
                          id="expiry"
                          value={form.expiry}
                          onChange={(e) => update("expiry", formatExpiryInput(e.target.value))}
                          className={errors.expiry ? "has-error" : ""}
                          placeholder="08/27"
                          inputMode="numeric"
                        />
                        {errors.expiry && <p className="field-error">{errors.expiry}</p>}
                      </div>
                      <div className="field">
                        <label htmlFor="cvv">CVV *</label>
                        <input
                          id="cvv"
                          value={form.cvv}
                          onChange={(e) => update("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                          className={errors.cvv ? "has-error" : ""}
                          placeholder="123"
                          inputMode="numeric"
                        />
                        {errors.cvv && <p className="field-error">{errors.cvv}</p>}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className={styles.codNote}>
                    <FiDollarSign aria-hidden="true" /> Pay with cash when your order arrives. Please have the exact amount ready: <strong>{formatPrice(total)}</strong>.
                  </p>
                )}
              </div>
            </div>

            <aside className={`card ${styles.summaryCard}`}>
              <h3>Order Summary</h3>
              {items.map((item) => {
                const FrameSvg = getFrameSvgComponent(item.frameSvg);
                return (
                <div key={item.id} className={styles.miniItem}>
                  <div className={styles.miniItemImage}>
                    <FrameSvg tint={item.tint} className={styles.miniItemSvg} sunglasses={item.category === "Sunglasses"} />
                  </div>
                  <div>
                    {item.name}
                    <div className={styles.qty}>Qty {item.qty}</div>
                  </div>
                  <span>{formatPrice(item.price * item.qty)}</span>
                </div>
                );
              })}
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className={styles.summaryRow}>
                  <span>Discount ({promoCode})</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button type="submit" className="btn btn-accent btn-block" style={{ marginTop: "var(--sp-5)" }} disabled={submitting}>
                {submitting ? "Processing…" : "Place Order"}
              </button>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}
