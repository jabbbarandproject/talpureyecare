import { JSONFilePreset } from "lowdb/node";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SEED_PRODUCTS } from "./data/seed-products.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "data", "db.json");

const defaultData = {
  products: SEED_PRODUCTS,
  orders: [],
  appointments: [],
  contactMessages: [],
};

export async function getDb() {
  const db = await JSONFilePreset(DB_FILE, defaultData);

  // Re-seed products if the file predates the current catalog (e.g. first
  // run after upgrading from an older/empty seed) — never clobber orders,
  // appointments, or contact messages that have already been saved.
  if (!Array.isArray(db.data.products) || db.data.products.length < SEED_PRODUCTS.length) {
    db.data.products = SEED_PRODUCTS;
    await db.write();
  }

  return db;
}
