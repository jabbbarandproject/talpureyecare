import { getFrameSvgComponent } from "./shapes";
import styles from "./ProductGlassesImage.module.css";

/**
 * Renders a product's SVG glasses illustration with a soft studio-style
 * backdrop so it reads like a real product photo card. Used in grid cards,
 * cart/checkout thumbnails, and the product detail gallery (via the `size`
 * prop for sizing presets).
 */
export default function ProductGlassesImage({ product, size = "md", angle = 0, className = "" }) {
  if (!product) return null;
  const FrameSvg = getFrameSvgComponent(product.frameSvg);
  const kidsVariant = product.gender === "Kids" && product.frameSvg === "round";
  const Component = kidsVariant ? getFrameSvgComponent("kidsRound") : FrameSvg;
  const isSunglasses = product.category === "Sunglasses";

  // Slight zoom/rotation per "angle" gives the detail-page thumbnail row a
  // sense of multiple product photos without needing extra artwork.
  const angleStyle =
    angle === 0
      ? {}
      : angle === 1
      ? { transform: "scale(1.18)" }
      : { transform: "scale(1.05) rotate(-3deg)" };

  return (
    <div className={`${styles.wrap} ${styles[size] || ""} ${className}`}>
      <Component tint={product.tint} className={styles.svg} style={angleStyle} sunglasses={isSunglasses} />
    </div>
  );
}
