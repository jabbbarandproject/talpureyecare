import {
  FiSend,
  FiCircle,
  FiTriangle,
  FiSquare,
  FiMinus,
  FiActivity,
  FiFeather,
  FiEye,
  FiTool,
  FiX,
} from "react-icons/fi";
import styles from "./StyleFilterBar.module.css";

/**
 * Quick-access chip row above the Shop grid — lets shoppers jump straight to
 * a frame STYLE (Aviator, Cat-Eye, Sport Wrap…) or a top-level category
 * (Contact Lenses, Accessories) without opening the full filter sidebar.
 * Mirrors the "shop by brand" chip-bar pattern from reference sites like
 * glassizmart.pk, but organized by original style names since this catalog
 * uses generic/fictional style descriptors rather than real brand names.
 */
const STYLE_CHIPS = [
  { label: "Aviator", type: "shape", value: "Aviator", Icon: FiSend },
  { label: "Round", type: "shape", value: "Round", Icon: FiCircle },
  { label: "Cat-Eye", type: "shape", value: "Cat-Eye", Icon: FiTriangle },
  { label: "Square", type: "shape", value: "Square", Icon: FiSquare },
  { label: "Rectangle", type: "shape", value: "Rectangle", Icon: FiMinus },
  { label: "Sport Wrap", type: "shape", value: "Sport Wrap", Icon: FiActivity },
  { label: "Rimless", type: "shape", value: "Rimless", Icon: FiFeather },
  { label: "Contact Lenses", type: "category", value: "Contact Lenses", Icon: FiEye },
  { label: "Accessories", type: "category", value: "Accessories", Icon: FiTool },
];

export default function StyleFilterBar({ activeShapes, activeCategories, onToggleShape, onToggleCategory, onClear }) {
  const hasActive = activeShapes.length > 0 || activeCategories.length > 0;

  function isActive(chip) {
    return chip.type === "shape" ? activeShapes.includes(chip.value) : activeCategories.includes(chip.value);
  }

  function handleClick(chip) {
    if (chip.type === "shape") onToggleShape(chip.value);
    else onToggleCategory(chip.value);
  }

  return (
    <div className={styles.bar}>
      <span className={styles.label}>Shop by style:</span>
      <div className={styles.chips}>
        {STYLE_CHIPS.map((chip) => (
          <button
            key={chip.label}
            type="button"
            className={`${styles.chip} ${isActive(chip) ? styles.active : ""}`}
            onClick={() => handleClick(chip)}
            aria-pressed={isActive(chip)}
          >
            <chip.Icon aria-hidden="true" /> {chip.label}
          </button>
        ))}
        {hasActive && (
          <button type="button" className={styles.clearChip} onClick={onClear}>
            <FiX aria-hidden="true" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
