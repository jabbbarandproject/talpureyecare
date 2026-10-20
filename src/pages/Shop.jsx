import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiAlertTriangle, FiSearch as FiSearchIcon } from "react-icons/fi";
import { CATEGORIES, FRAME_SHAPES, GENDERS } from "../data/products";
import { useProducts } from "../utils/useProducts";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import StyleFilterBar from "../components/StyleFilterBar";
import { formatPrice } from "../utils/format";
import styles from "./Shop.module.css";

const MAX_PRICE = 250;

const SORT_OPTIONS = [
  { value: "popularity", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  const [categories, setCategories] = useState(initialCategory ? [initialCategory] : []);
  const [shapes, setShapes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [sortBy, setSortBy] = useState("popularity");
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  // Server-side filters — the backend does the filtering/sorting via query
  // params, so Products flow through the real API instead of static JSON.
  const apiFilters = useMemo(
    () => ({
      search: query || undefined,
      category: categories,
      frameShape: shapes,
      gender: genders,
      priceMax: maxPrice < MAX_PRICE ? maxPrice : undefined,
      sort: sortBy,
    }),
    [query, categories, shapes, genders, maxPrice, sortBy]
  );

  const { products: filtered, loading, error } = useProducts(apiFilters);

  function toggleValue(list, setList, value) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function clearFilters() {
    setCategories([]);
    setShapes([]);
    setGenders([]);
    setMaxPrice(MAX_PRICE);
    setSearchInput("");
    setSearchParams({});
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) params.set("q", searchInput.trim());
    else params.delete("q");
    setSearchParams(params);
  }

  return (
    <div className="page">
      <section className={styles.pageHero}>
        <div className="container">
          <h1>Shop Eyewear</h1>
          <p>Prescription glasses, sunglasses, contact lenses, and accessories — fitted for every lifestyle.</p>
          <form onSubmit={handleSearchSubmit} style={{ marginTop: "1.25rem", display: "flex", gap: "0.5rem", maxWidth: 420 }}>
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by product name…"
              style={{ flex: 1, padding: "0.65rem 1rem", borderRadius: "999px", border: "none" }}
            />
            <button type="submit" className="btn btn-accent btn-sm">Search</button>
          </form>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "var(--sp-6)", paddingBottom: 0 }}>
        <div className="container">
          <StyleFilterBar
            activeShapes={shapes}
            activeCategories={categories}
            onToggleShape={(s) => toggleValue(shapes, setShapes, s)}
            onToggleCategory={(c) => toggleValue(categories, setCategories, c)}
            onClear={clearFilters}
          />
        </div>
      </section>

      <section className="section" style={{ paddingTop: "var(--sp-6)" }}>
        <div className="container">
          <button
            type="button"
            className={`btn btn-outline btn-sm ${styles.mobileFilterToggle}`}
            onClick={() => setFilterPanelOpen((v) => !v)}
            style={{ marginBottom: "var(--sp-4)" }}
          >
            {filterPanelOpen ? "Hide Filters" : "Show Filters"}
          </button>

          <div className={styles.layout}>
            <aside className={`card ${styles.filterPanel} ${filterPanelOpen ? styles.open : ""}`}>
              <div className={styles.filterGroup}>
                <h4>Category</h4>
                {CATEGORIES.map((c) => (
                  <label key={c} className={styles.checkRow}>
                    <input
                      type="checkbox"
                      checked={categories.includes(c)}
                      onChange={() => toggleValue(categories, setCategories, c)}
                    />
                    {c}
                  </label>
                ))}
              </div>

              <div className={styles.filterGroup}>
                <h4>Frame Shape</h4>
                {FRAME_SHAPES.map((s) => (
                  <label key={s} className={styles.checkRow}>
                    <input
                      type="checkbox"
                      checked={shapes.includes(s)}
                      onChange={() => toggleValue(shapes, setShapes, s)}
                    />
                    {s}
                  </label>
                ))}
              </div>

              <div className={styles.filterGroup}>
                <h4>Gender</h4>
                {GENDERS.map((g) => (
                  <label key={g} className={styles.checkRow}>
                    <input
                      type="checkbox"
                      checked={genders.includes(g)}
                      onChange={() => toggleValue(genders, setGenders, g)}
                    />
                    {g}
                  </label>
                ))}
              </div>

              <div className={styles.filterGroup}>
                <h4>Max Price</h4>
                <div className={styles.priceRange}>
                  <input
                    type="range"
                    min={0}
                    max={MAX_PRICE}
                    step={5}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                  />
                  <span className={styles.priceLabel}>Up to {formatPrice(maxPrice)}</span>
                </div>
              </div>

              <button type="button" className={styles.clearBtn} onClick={clearFilters}>
                Clear all filters
              </button>
            </aside>

            <div>
              <div className={styles.toolbar}>
                <span className={styles.resultCount}>
                  {loading ? "Loading…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
                  {query && !loading ? ` for "${query}"` : ""}
                </span>
                <select
                  className={styles.sortSelect}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {error ? (
                <div className={`card ${styles.emptyState}`}>
                  <FiAlertTriangle aria-hidden="true" className={styles.emptyStateIcon} />
                  <h3>Couldn't load products</h3>
                  <p>{error.message}</p>
                  <button type="button" className="btn btn-outline btn-sm" style={{ marginTop: "1rem" }} onClick={() => setSortBy((s) => s)}>
                    Try Again
                  </button>
                </div>
              ) : loading ? (
                <div className={styles.grid}>
                  {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              ) : filtered.length > 0 ? (
                <div className={styles.grid}>
                  {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              ) : (
                <div className={`card ${styles.emptyState}`}>
                  <FiSearchIcon aria-hidden="true" className={styles.emptyStateIcon} />
                  <h3>No products match your filters</h3>
                  <p>Try adjusting your filters or clearing your search.</p>
                  <button type="button" className="btn btn-outline btn-sm" style={{ marginTop: "1rem" }} onClick={clearFilters}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
