import { useEffect, useState } from "react";

/**
 * Simulates a brief async data fetch so pages can show a skeleton loader
 * before revealing content, without needing a real backend.
 */
export function useSimulatedLoading(delay = 500) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return loading;
}
