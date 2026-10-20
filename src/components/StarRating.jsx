import { FiStar } from "react-icons/fi";
import styles from "./StarRating.module.css";

/** Simple 5-star display rating (non-interactive), rounded to nearest half. */
export default function StarRating({ rating = 0, size = "md" }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const diff = rating - i + 1;
    const isFilled = diff >= 0.5;
    stars.push(
      <FiStar
        key={i}
        aria-hidden="true"
        className={isFilled ? styles.filled : styles.empty}
        fill={isFilled ? "currentColor" : "none"}
      />
    );
  }
  return (
    <span className={`${styles.stars} ${styles[size]}`} aria-label={`Rated ${rating} out of 5`}>
      {stars}
    </span>
  );
}
