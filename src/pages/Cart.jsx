import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiShoppingBag, FiCheckCircle } from "react-icons/fi";
import { useCartStore } from "../store/useCartStore";
import { getFrameSvgComponent } from "../components/glasses-svg/shapes";
import { formatPrice } from "../utils/format";
import styles from "./Cart.module.css";

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const applyPromo = useCartStore((s) => s.applyPromo);
  const removePromo = useCartStore((s) => s.removePromo);
  const promoCode = useCartStore((s) => s.promoCode);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDiscount = useCartStore((s) => s.getDiscount);
  const getShipping = useCartStore((s) => s.getShipping);
  const getTotal = useCartStore((s) => s.getTotal);

  const [promoInput, setPromoInput] = useState("");
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const total = getTotal();

  function handleApplyPromo(e) {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const result = applyPromo(promoInput);
    if (result.success) {
      toast.success(`Promo applied: ${Math.round(result.discount * 100)}% off`);
    } else {
      toast.error("Invalid promo code");
    }
    setPromoInput("");
  }

  if (items.length === 0) {
    return (
      <div className="page section">
        <div className="container">
          <div className={`card ${styles.emptyCart}`} style={{ maxWidth: 520, margin: "0 auto" }}>
            <FiShoppingBag aria-hidden="true" className={styles.emptyIcon} />
            <h2>Your cart is empty</h2>
            <p>Browse our collection of prescription glasses, sunglasses, and more.</p>
            <Link to="/shop" className="btn btn-primary">Shop Eyewear</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page section">
      <div className="container">
        <h1 style={{ marginBottom: "var(--sp-6)" }}>Your Cart</h1>
        <div className={styles.layout}>
          <div className={`card ${styles.itemsCard}`}>
            {items.map((item) => {
              const FrameSvg = getFrameSvgComponent(item.frameSvg);
              return (
              <div key={item.id} className={styles.item}>
                <Link to={`/shop/${item.id}`} className={styles.itemImage}>
                  <FrameSvg tint={item.tint} className={styles.itemSvg} sunglasses={item.category === "Sunglasses"} />
                </Link>
                <div className={styles.itemInfo}>
                  <h3>
                    <Link to={`/shop/${item.id}`}>{item.name}</Link>
                  </h3>
                  <p>{item.colorway}</p>
                </div>
                <div className={styles.itemQty}>
                  <button type="button" onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease quantity">−</button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase quantity">+</button>
                </div>
                <div className={styles.itemPriceCol}>
                  <span className={styles.itemPrice}>{formatPrice(item.price * item.qty)}</span>
                  <button type="button" className={styles.removeBtn} onClick={() => removeItem(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
              );
            })}
          </div>

          <aside className={`card ${styles.summaryCard}`}>
            <h3>Order Summary</h3>

            {promoCode ? (
              <div className={styles.promoApplied}>
                <span><FiCheckCircle aria-hidden="true" /> {promoCode} applied</span>
                <button type="button" onClick={removePromo}>Remove</button>
              </div>
            ) : (
              <form className={styles.promoRow} onSubmit={handleApplyPromo}>
                <input
                  type="text"
                  placeholder="Promo code (try EYECARE10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                />
                <button type="submit" className="btn btn-outline btn-sm">Apply</button>
              </form>
            )}

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className={`${styles.summaryRow} ${styles.discount}`}>
                <span>Discount</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button type="button" className="btn btn-accent btn-block" style={{ marginTop: "var(--sp-5)" }} onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
            <Link to="/shop" className="btn btn-outline btn-block" style={{ marginTop: "var(--sp-3)" }}>
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
