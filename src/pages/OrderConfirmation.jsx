import { useLocation, Link, Navigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { useOrdersStore } from "../store/useOrdersStore";
import { getFrameSvgComponent } from "../components/glasses-svg/shapes";
import { formatPrice } from "../utils/format";
import styles from "./OrderConfirmation.module.css";

export default function OrderConfirmation() {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const getOrderById = useOrdersStore((s) => s.getOrderById);
  const order = orderId ? getOrderById(orderId) : null;

  // If someone lands here directly (refresh with no state, or stale link),
  // send them to the shop rather than showing a broken confirmation page.
  if (!order) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <div className="page section">
      <div className="container">
        <div className={`card ${styles.wrap}`}>
          <FiCheckCircle className={styles.icon} aria-hidden="true" />
          <h1>Order Placed Successfully!</h1>
          <span className={styles.orderId}>Order #{order.id}</span>

          <div className={styles.deliveryBox}>
            <p><strong>Estimated Delivery:</strong> {order.estimatedDelivery}</p>
            <p><strong>Shipping To:</strong> {order.shipping_address.address}, {order.shipping_address.city} {order.shipping_address.zip}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod === "card" ? "Credit/Debit Card" : "Cash on Delivery"}</p>
          </div>

          <div className={styles.itemsList}>
            {order.items.map((item) => {
              const FrameSvg = getFrameSvgComponent(item.frameSvg);
              return (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemImage}>
                  <FrameSvg tint={item.tint} className={styles.itemSvg} sunglasses={item.category === "Sunglasses"} />
                </div>
                <div>
                  {item.name} <span style={{ color: "var(--text-secondary)" }}>× {item.qty}</span>
                </div>
                <span>{formatPrice(item.price * item.qty)}</span>
              </div>
              );
            })}
          </div>

          <div className={styles.totalsBox}>
            <div className={styles.totalsRow}>
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className={styles.totalsRow}>
                <span>Discount</span>
                <span>−{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className={styles.totalsRow}>
              <span>Shipping</span>
              <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
            </div>
            <div className={`${styles.totalsRow} ${styles.grand}`}>
              <span>Total Paid</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Link to="/shop" className="btn btn-accent">Continue Shopping</Link>
            <Link to="/" className="btn btn-outline">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
