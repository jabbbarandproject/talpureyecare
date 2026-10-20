import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className="page">
      <div className={styles.wrap}>
        <span className={styles.code} aria-hidden="true">404</span>
        <h1>We couldn't find that page</h1>
        <p>The page you're looking for may have moved, or the link might be outdated.</p>
        <div className={styles.actions}>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
          <Link to="/shop" className="btn btn-outline">Shop Eyewear</Link>
        </div>
      </div>
    </div>
  );
}
