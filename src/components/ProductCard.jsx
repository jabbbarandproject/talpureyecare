import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import StarRating from "./StarRating";
import ProductGlassesImage from "./glasses-svg/ProductGlassesImage";
import { useCartStore } from "../store/useCartStore";
import { useCartDrawerStore } from "../store/useCartDrawerStore";
import { formatPrice } from "../utils/format";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const openDrawerWithItem = useCartDrawerStore((s) => s.openWithItem);

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
    openDrawerWithItem(product.id);
  }

  return (
    <Link to={`/shop/${product.id}`} className={`card ${styles.card}`}>
      <div className={styles.imageWrap}>
        <ProductGlassesImage product={product} size="sm" className={styles.productImage} />
        <span className={styles.categoryTag}>{product.category}</span>
        <button type="button" className={styles.quickAdd} onClick={handleAddToCart} aria-label={`Add ${product.name} to cart`}>
          + Add to Cart
        </button>
      </div>
      <div className={styles.body}>
        <p className={styles.colorway}>{product.colorway}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.ratingRow}>
          <StarRating rating={product.rating} size="sm" />
          <span className={styles.reviewCount}>({product.reviewCount})</span>
        </div>
        <p className={styles.price}>{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
