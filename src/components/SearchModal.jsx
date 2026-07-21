import { useEffect, useRef } from "react";
import { Link } from "react-router";

export function SearchModal({
  isOpen,
  keyword,
  setKeyword,
  results,
  close,
  getCategoryLabel,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const buildTo = (item) => {
    return `/article/${item.file}`;
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center pt-[15vh] px-4"
      style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)" }}
      onClick={close}
    >
      <div
        className="w-full max-w-2xl mag-card overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b" style={{ borderColor: "var(--line)" }}>
          <div className="flex items-center gap-3">
            <i className="fas fa-search" style={{ color: "var(--muted)" }}></i>
            <input
              ref={inputRef}
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索文章、标题..."
              className="flex-1 bg-transparent outline-none text-lg"
              style={{ color: "var(--ink)" }}
            />
            <button
              onClick={close}
              className="text-xs px-2 py-1"
              style={{ border: "1px solid var(--line)", color: "var(--muted)" }}
            >
              ESC
            </button>
          </div>
        </div>

        <div
          className="max-h-[50vh] overflow-y-auto p-2"
          style={{ background: "var(--paper)" }}
        >
          {results.length === 0 && keyword.trim() && (
            <div className="p-8 text-center" style={{ color: "var(--muted)" }}>
              未找到与 "{keyword}" 相关的文章
            </div>
          )}

          {results.length === 0 && !keyword.trim() && (
            <div className="p-8 text-center text-sm" style={{ color: "var(--muted)" }}>
              输入关键词开始搜索，按 / 打开搜索，Esc 关闭
            </div>
          )}

          {results.map((item, idx) => (
            <Link
              key={idx}
              to={buildTo(item)}
              onClick={close}
              className="block p-4 hover:bg-[var(--line)] hover:bg-opacity-30 transition-colors border-b last:border-b-0"
              style={{ borderColor: "var(--line)" }}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-xs tracking-wider"
                  style={{ color: "var(--accent)", fontFamily: "'Inter', sans-serif" }}
                >
                  {item.section} · {getCategoryLabel(item.category)}
                </span>
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {item.date}
                </span>
              </div>
              <h4 className="font-display text-base font-semibold">{item.title}</h4>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
