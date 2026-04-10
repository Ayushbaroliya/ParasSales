import { useState, useEffect } from "react";
import { fetchCategories } from "../services/api";

// Shared hook — fetches all categories once, caches in module scope.
let _cache = null;

export function useCategories() {
  const [data, setData] = useState(_cache);
  const [loading, setLoading] = useState(!_cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (_cache) { setData(_cache); setLoading(false); return; }
    setLoading(true);
    fetchCategories()
      .then((d) => { _cache = d; setData(d); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
