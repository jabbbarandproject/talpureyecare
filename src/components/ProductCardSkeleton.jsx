import styles from "./ProductCard.module.css";

/** Loading placeholder that mirrors ProductCard's layout dimensions. */
export default function ProductCardSkeleton() {
  return (
    <div className={`card ${styles.card}`}>
      <div className={`skeleton ${styles.imageWrap}`} style={{ borderRadius: 0 }} />
      <div className={styles.body}>
        <div className="skeleton" style={{ width: "40%", height: 10 }} />
        <div className="skeleton" style={{ width: "80%", height: 16, marginTop: 8 }} />
        <div className="skeleton" style={{ width: "50%", height: 10, marginTop: 8 }} />
        <div className="skeleton" style={{ width: "30%", height: 16, marginTop: 10 }} />
      </div>
    </div>
  );
}
