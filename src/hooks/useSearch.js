import { useState, useEffect, useMemo, useCallback } from "react";
import { searchIndex } from "../data/siteData";
import { getCategoryLabel } from "../utils/helpers";

export function useSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  const results = useMemo(() => {
    if (!keyword.trim()) return [];
    const lower = keyword.toLowerCase();
    return searchIndex.filter((item) =>
      item.title.toLowerCase().includes(lower)
    );
  }, [keyword]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setKeyword("");
  }, []);
  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) setKeyword("");
      return !prev;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        close();
      }
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        open();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close, open]);

  return {
    isOpen,
    keyword,
    setKeyword,
    results,
    open,
    close,
    toggle,
    getCategoryLabel,
  };
}
