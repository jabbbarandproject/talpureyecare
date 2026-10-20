import { useEffect, useRef, useState } from "react";
import { fetchProducts, fetchProductById } from "./api";

/**
 * Fetches the product list from the backend whenever `filters` changes.
 * Returns { products, loading, error }. `filters` should be a stable
 * primitive-friendly object (we JSON.stringify it for the effect dependency
 * since filter objects are often re-created each render).
 */
export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProducts(JSON.parse(filtersKey))
      .then((data) => {
        if (cancelled) return;
        setProducts(data.products || []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  return { products, loading, error };
}

/** Fetches a single product by id. Returns { product, loading, error, notFound }. */
export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setNotFound(false);

    fetchProductById(id)
      .then((data) => {
        if (cancelled) return;
        setProduct(data.product || null);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 404) setNotFound(true);
        else setError(err);
        setProduct(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, loading, error, notFound };
}

/** Fetches a handful of related products (same category, excluding itself). */
export function useRelatedProducts(product, limit = 4) {
  const [related, setRelated] = useState([]);
  const lastKey = useRef(null);

  useEffect(() => {
    if (!product) {
      setRelated([]);
      return;
    }
    const key = `${product.id}:${product.category}`;
    if (lastKey.current === key) return;
    lastKey.current = key;

    let cancelled = false;
    fetchProducts({ category: product.category })
      .then((data) => {
        if (cancelled) return;
        const list = (data.products || []).filter((p) => p.id !== product.id).slice(0, limit);
        setRelated(list);
      })
      .catch(() => {
        if (!cancelled) setRelated([]);
      });

    return () => {
      cancelled = true;
    };
  }, [product, limit]);

  return related;
}
