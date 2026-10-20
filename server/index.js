import express from "express";
import cors from "cors";
import morgan from "morgan";
import { getDb } from "./db.js";

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

function generateOrderId() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `TLP-${stamp}${rand}`;
}

function generateAppointmentId() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-4);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `APT-${stamp}${rand}`;
}

function estimatedDeliveryRange(daysMin = 3, daysMax = 5) {
  const now = new Date();
  const min = new Date(now);
  min.setDate(now.getDate() + daysMin);
  const max = new Date(now);
  max.setDate(now.getDate() + daysMax);
  const opts = { month: "short", day: "numeric" };
  return `${min.toLocaleDateString("en-US", opts)} – ${max.toLocaleDateString("en-US", opts)}`;
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "talpur-eyecare-server", time: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
app.get("/api/products", async (req, res) => {
  try {
    const db = await getDb();
    let list = [...db.data.products];

    const { category, frameShape, gender, priceMin, priceMax, search, sort } = req.query;

    if (category) {
      const cats = String(category).split(",").map((c) => c.trim().toLowerCase());
      list = list.filter((p) => cats.includes(p.category.toLowerCase()));
    }
    if (frameShape) {
      const shapes = String(frameShape).split(",").map((s) => s.trim().toLowerCase());
      list = list.filter((p) => shapes.includes(p.frameShape.toLowerCase()));
    }
    if (gender) {
      const genders = String(gender).split(",").map((g) => g.trim().toLowerCase());
      list = list.filter((p) => genders.includes(p.gender.toLowerCase()));
    }
    if (priceMin) {
      const min = Number(priceMin);
      if (!Number.isNaN(min)) list = list.filter((p) => p.price >= min);
    }
    if (priceMax) {
      const max = Number(priceMax);
      if (!Number.isNaN(max)) list = list.filter((p) => p.price <= max);
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.colorway.toLowerCase().includes(q) ||
          (p.styleInspiration || "").toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "popularity":
      default:
        list.sort((a, b) => b.popularity - a.popularity);
    }

    res.json({ products: list, total: list.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load products." });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const db = await getDb();
    const product = db.data.products.find((p) => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found." });
    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load product." });
  }
});

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------
app.post("/api/orders", async (req, res) => {
  try {
    const body = req.body || {};
    const { items, shippingAddress, paymentMethod } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must include at least one item." });
    }
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.email || !shippingAddress.address) {
      return res.status(400).json({ error: "Shipping address is incomplete." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
      return res.status(400).json({ error: "Invalid email address." });
    }
    if (!["card", "cod"].includes(paymentMethod)) {
      return res.status(400).json({ error: "Invalid payment method." });
    }

    const subtotal = items.reduce((sum, i) => sum + Number(i.price) * Number(i.qty), 0);
    const discount = Number(body.discount) || 0;
    const shipping = Number(body.shipping) || 0;
    const total = Math.max(subtotal - discount + shipping, 0);

    const order = {
      id: generateOrderId(),
      items,
      subtotal,
      discount,
      shipping,
      total,
      promoCode: body.promoCode || null,
      paymentMethod,
      shippingAddress,
      estimatedDelivery: estimatedDeliveryRange(),
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    const db = await getDb();
    db.data.orders.unshift(order);
    await db.write();

    res.status(201).json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order." });
  }
});

app.get("/api/orders/:id", async (req, res) => {
  try {
    const db = await getDb();
    const order = db.data.orders.find((o) => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load order." });
  }
});

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------
app.post("/api/appointments", async (req, res) => {
  try {
    const body = req.body || {};
    const required = ["fullName", "phone", "email", "date", "time", "serviceId"];
    const missing = required.filter((field) => !body[field] || String(body[field]).trim() === "");
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    const appointment = {
      id: generateAppointmentId(),
      fullName: body.fullName,
      phone: body.phone,
      email: body.email,
      date: body.date,
      time: body.time,
      serviceId: body.serviceId,
      serviceName: body.serviceName || "General Consultation",
      doctorId: body.doctorId || "doc-any",
      doctorName: body.doctorName || "Earliest available",
      reason: body.reason || "Routine check-up",
      notes: body.notes || "",
      status: "pending-confirmation",
      createdAt: new Date().toISOString(),
    };

    const db = await getDb();
    db.data.appointments.unshift(appointment);
    await db.write();

    res.status(201).json({ appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create appointment." });
  }
});

app.get("/api/appointments", async (req, res) => {
  try {
    const db = await getDb();
    res.json({ appointments: db.data.appointments, total: db.data.appointments.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load appointments." });
  }
});

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address." });
    }
    if (String(message).trim().length < 10) {
      return res.status(400).json({ error: "Message should be at least 10 characters." });
    }

    const entry = {
      id: `MSG-${Date.now().toString(36).toUpperCase()}`,
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    };

    const db = await getDb();
    db.data.contactMessages.unshift(entry);
    await db.write();

    res.status(201).json({ message: entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit message." });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found." });
});

app.listen(PORT, () => {
  console.log(`🧿 Talpur Eye Care API listening on http://localhost:${PORT}`);
});
