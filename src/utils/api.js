/**
 * Thin fetch wrapper around the Talpur Eye Care backend (server/).
 * Base URL defaults to localhost:3001 in dev; override with VITE_API_URL
 * if the backend runs elsewhere.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });
  } catch {
    throw new ApiError(
      "Can't reach the Talpur Eye Care server. Make sure the backend is running (npm run server).",
      0
    );
  }

  let body = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  if (!res.ok) {
    throw new ApiError(body?.error || `Request failed with status ${res.status}`, res.status);
  }

  return body;
}

export function fetchProducts(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      if (value.length) params.set(key, value.join(","));
    } else {
      params.set(key, value);
    }
  });
  const qs = params.toString();
  return request(`/api/products${qs ? `?${qs}` : ""}`);
}

export function fetchProductById(id) {
  return request(`/api/products/${encodeURIComponent(id)}`);
}

export function createOrder(payload) {
  return request("/api/orders", { method: "POST", body: JSON.stringify(payload) });
}

export function fetchOrderById(id) {
  return request(`/api/orders/${encodeURIComponent(id)}`);
}

export function createAppointment(payload) {
  return request("/api/appointments", { method: "POST", body: JSON.stringify(payload) });
}

export function submitContactMessage(payload) {
  return request("/api/contact", { method: "POST", body: JSON.stringify(payload) });
}

export { ApiError };
