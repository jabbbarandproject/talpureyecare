import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useProduct, useRelatedProducts } from "../utils/useProducts";
import { useCartStore } from "../store/useCartStore";
import { useCartDrawerStore } from "../store/useCartDrawerStore";
import StarRating from "../components/StarRating";
import ProductCard from "../components/ProductCard";
import ProductGlassesImage from "../components/glasses-svg/ProductGlassesImage";
import { formatPrice } from "../utils/format";
import styles from "./ProductDetail.module.css";
import NotFound from "./NotFound";

// Deterministic mock reviews generated from the product's rating/reviewCount
// so every product shows a believable (if synthetic) review set.
function buildMockReviews(product) {
  const names = ["Jordan M.", "Casey L.", "Taylor R.", "Sam W.", "Riley P."];
  const comments = [
    "Fits perfectly and the quality feels way better than the price suggests.",
    "Exactly as described — ordering was easy and delivery was fast.",
    "Great frame, lightweight, and the color is even nicer in person.",
    "Comfortable for all-day wear. Would buy another pair.",
    "Good value. Lens quality is solid and the case included is a nice touch.",
  ];
  return names.slice(0, 3).map((name, i) => ({
    id: `${product.id}-rev-${i}`,
    name,
    rating: Math.max(3, Math.round(product.rating) - (i === 2 ? 1 : 0)),
    comment: comments[(i + product.id.length) % comments.length],
    date: new Date(Date.now() - (i + 1) * 9 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  }));
}

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { product, loading, notFound, error } = useProduct(productId);
  const addItem = useCartStore((s) => s.addItem);
  const openDrawerWithItem = useCartDrawerStore((s) => s.openWithItem);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  const related = useRelatedProducts(product, 4);
  const reviews = useMemo(() => (product ? buildMockReviews(product) : []), [product]);

  if (notFound) {
    return <NotFound />;
  }

  if (loading) {
    return (
      <div className="page section">
        <div className="container">
          <div className={styles.layout}>
            <div className={`skeleton ${styles.gallery}`} style={{ aspectRatio: "1 / 1" }} />
            <div>
              <div className="skeleton" style={{ width: "40%", height: 14, marginBottom: 12 }} />
              <div className="skeleton" style={{ width: "70%", height: 28, marginBottom: 16 }} />
              <div className="skeleton" style={{ width: "100%", height: 80 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page section">
        <div className="container text-center">
          <h2>Couldn't load this product</h2>
          <p style={{ color: "var(--text-secondary)", margin: "1rem 0" }}>
            {error?.message || "Something went wrong talking to the server."}
          </p>
          <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  function handleAddToCart() {
    addItem(product, qty);
    toast.success(`${qty} × ${product.name} added to cart`);
    openDrawerWithItem(product.id);
  }

  function handleBuyNow() {
    addItem(product, qty);
    navigate("/cart");
  }

  return (
    <div className="page section">
      <div className="container">
        <p className={styles.breadcrumb}>
          <Link to="/shop">Shop</Link> / <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link> / {product.name}
        </p>

        <div className={styles.layout}>
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              <ProductGlassesImage product={product} size="lg" angle={activeImage} />
            </div>
            <div className={styles.thumbRow}>
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.thumb} ${i === activeImage ? styles.active : ""}`}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View angle ${i + 1}`}
                >
                  <ProductGlassesImage product={product} size="thumb" angle={i} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.info}>
            <span className={styles.category}>{product.category}</span>
            <h1 className={styles.name}>{product.name}</h1>
            <div className={styles.ratingRow}>
              <StarRating rating={product.rating} />
              <span>{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
            </div>
            <p className={styles.price}>{formatPrice(product.price)}</p>
            <p className={styles.description}>{product.description}</p>

            <div className={styles.specGrid}>
              <div className={styles.specItem}>
                <span>Material</span>
                <span>{product.material}</span>
              </div>
              <div className={styles.specItem}>
                <span>Lens Type</span>
                <span>{product.lensType}</span>
              </div>
              <div className={styles.specItem}>
                <span>Size</span>
                <span>{product.size}</span>
              </div>
              <div className={styles.specItem}>
                <span>Colorway</span>
                <span>{product.colorway}</span>
              </div>
            </div>

            <div className={styles.purchaseRow}>
              <div className={styles.qtyControl}>
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
              </div>
              <div className={styles.actionBtns}>
                <button type="button" className="btn btn-outline" onClick={handleAddToCart}>
                  Add to Cart
                </button>
                <button type="button" className="btn btn-accent" onClick={handleBuyNow}>
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className={styles.relatedSection}>
            <div className="section-head" style={{ textAlign: "left", margin: "0 0 var(--sp-5)" }}>
              <h2 style={{ fontSize: "var(--fs-xl)" }}>You might also like</h2>
            </div>
            <div className={styles.relatedGrid}>
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        <div className={styles.reviewsSection}>
          <div className="section-head" style={{ textAlign: "left", margin: "0 0 var(--sp-5)" }}>
            <h2 style={{ fontSize: "var(--fs-xl)" }}>Customer Reviews</h2>
          </div>
          <div className={styles.reviewSummary}>
            <span className={styles.reviewScore}>{product.rating.toFixed(1)}</span>
            <div>
              <StarRating rating={product.rating} size="lg" />
              <p style={{ fontSize: "var(--fs-sm)", color: "var(--text-secondary)" }}>
                Based on {product.reviewCount} reviews
              </p>
            </div>
          </div>
          <div className={styles.reviewList}>
            {reviews.map((r) => (
              <div key={r.id} className={`card ${styles.reviewCard}`}>
                <div className={styles.reviewHead}>
                  <span className={styles.reviewAuthor}>{r.name}</span>
                  <span className={styles.reviewDate}>{r.date}</span>
                </div>
                <StarRating rating={r.rating} size="sm" />
                <p className={styles.reviewText}>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
