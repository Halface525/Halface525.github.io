import { useState, useEffect } from "react";
import { parseMarkdown } from "../utils/markdown";

export function useArticle(filePath) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!filePath) return;
    setLoading(true);
    setError(null);
    fetch(`/${filePath}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load article");
        return res.text();
      })
      .then((md) => {
        const { metadata, content } = parseMarkdown(md);
        setData({ metadata, content });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filePath]);

  return { data, loading, error };
}
