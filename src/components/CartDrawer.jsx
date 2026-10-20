import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiX, FiShoppingBag, FiCheckCircle } from "react-icons/fi";
import { useCartStore } from "../store/useCartStore";
import { useCartDrawerStore } from "../store/useCartDrawerStore";
import { getFrameSvgComponent } from "./glasses-svg/shapes";
import { formatPrice } from "../utils/format";
import styles from "./CartDrawer.module.css";

/**
 * Slide-out cart panel — opens from the right over a backdrop, works from
 * any page without navigating away. Triggered by the header cart icon and
 * auto-opened after "Add to Cart" anywhere in the app (grid card or product
 * detail). Closes via backdrop click, the X button, or Escape.
 */
export default function CartDrawer() {
  const isOpen = useCartDrawerStore((s) => s.isOpen);
  const close = useCartDrawerStore((s) => s.close);
  const lastAddedId = useCartDrawerStore((s) => s.lastAddedId);

  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const applyPromo = useCartStore((s) => s.applyPromo);
  const removePromo = useCartStore((s) => s.removePromo);
  const promoCode = useCartStore((s) => s.promoCode);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  const [promoInput, setPromoInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

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

  function goToCart() {
    close();
    navigate("/cart");
  }

  function goToCheckout() {
    close();
    navigate("/checkout");
  }

  const subtotal = getSubtotal();

  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ""}`}
        onClick={close}
        aria-hidden="true"
      />
      <aside
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className={styles.header}>
          <h3>Your Cart ({items.reduce((s, i) => s + i.qty, 0)})</h3>
          <button type="button" className={styles.closeBtn} onClick={close} aria-label="Close cart">
            <FiX aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <FiShoppingBag aria-hidden="true" className={styles.emptyIcon} />
            <p>Your cart is empty.</p>
            <button type="button" className="btn btn-primary" onClick={() => { close(); navigate("/shop"); }}>
              Shop Eyewear
            </button>
          </div>
        ) : (
          <>
            <div className={styles.itemsList}>
              {items.map((item) => {
                const FrameSvg = getFrameSvgComponent(item.frameSvg);
                return (
                  <div
                    key={item.id}
                    className={`${styles.item} ${item.id === lastAddedId ? styles.justAdded : ""}`}
                  >
                    <div className={styles.itemImage}>
                      <FrameSvg tint={item.tint} className={styles.itemSvg} sunglasses={item.category === "Sunglasses"} />
                    </div>
                    <div className={styles.itemInfo}>
                      <h4>{item.name}</h4>
                      <p>{item.colorway}</p>
                      <div className={styles.itemQty}>
                        <button type="button" onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease quantity">−</button>
                        <span>{item.qty}</span>
                        <button type="button" onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase quantity">+</button>
                      </div>
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

            <div className={styles.footer}>
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

              <div className={styles.subtotalRow}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className={styles.shippingNote}>Shipping &amp; discounts calculated at checkout.</p>

              <div className={styles.actions}>
                <button type="button" className="btn btn-outline btn-block" onClick={goToCart}>
                  View Full Cart
                </button>
                <button type="button" className="btn btn-accent btn-block" onClick={goToCheckout}>
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
