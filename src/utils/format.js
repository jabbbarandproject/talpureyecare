export function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

export function generateOrderId() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `TLP-${stamp}${rand}`;
}

export function generateAppointmentId() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-4);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `APT-${stamp}${rand}`;
}

export function estimatedDeliveryRange(daysMin = 3, daysMax = 5) {
  const now = new Date();
  const min = new Date(now);
  min.setDate(now.getDate() + daysMin);
  const max = new Date(now);
  max.setDate(now.getDate() + daysMax);
  const opts = { month: "short", day: "numeric" };
  return `${min.toLocaleDateString("en-US", opts)} – ${max.toLocaleDateString("en-US", opts)}`;
}
