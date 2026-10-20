/**
 * Product catalog metadata + helpers.
 *
 * NOTE: the actual product list now lives in the backend (server/data/seed-products.js)
 * and is fetched at runtime via src/utils/api.js (fetchProducts / fetchProductById).
 * This module only keeps the filter-option constants (kept in sync with the
 * backend categories) and small pure helpers that operate on an already-
 * fetched product array, so existing pages that filter/relate products
 * client-side don't need to change their call signatures.
 */

export const CATEGORIES = ["Prescription Glasses", "Sunglasses", "Contact Lenses", "Accessories"];
export const FRAME_SHAPES = ["Round", "Rectangle", "Cat-Eye", "Aviator", "Square", "Sport Wrap", "Rimless"];
export const GENDERS = ["Unisex", "Women", "Men", "Kids"];

export function findProductById(products, id) {
  return products.find((p) => p.id === id);
}

export function getRelatedProducts(products, product, limit = 4) {
  if (!product) return [];
  return products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, limit);
}
