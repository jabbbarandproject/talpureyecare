import { Link } from "react-router-dom";
import logoImg from "../assets/brand/talpur-eyecare-logo.jpg";
import styles from "./Logo.module.css";

/**
 * Talpur Eye Care wordmark — the brand's actual logo artwork (dark-navy
 * badge with a teal/purple gradient eye-and-wave icon above the "TALPUR
 * EYE CARE" wordmark). Used in the header navbar and footer.
 */
export default function Logo({ variant = "dark" }) {
  return (
    <Link to="/" className={`${styles.logo} ${variant === "light" ? styles.light : ""}`} aria-label="Talpur Eye Care — Home">
      <img src={logoImg} alt="Talpur Eye Care logo" className={styles.mark} />
      <span className={styles.wordmark}>
        Talpur <em>Eye Care</em>
      </span>
    </Link>
  );
}
