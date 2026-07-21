import { useState } from "react";
import { useNavigate } from "react-router";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { ArticleCard } from "../components/ArticleCard";
import { writingArticlesData } from "../data/writingArticles";
import { sortByDateDesc } from "../utils/helpers";

const FILTERS = [
  { value: "all", label: "全部" },
  { value: "thinking", label: "半思" },
  { value: "reading", label: "半读" },
  { value: "travel", label: "半游" },
];

export function WritingPage() {
  useDocumentTitle("半文 — Halface");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const articles = sortByDateDesc(writingArticlesData).filter((article) =>
    filter === "all" ? true : article.category === filter
  );

  return (
    <section id="writing" className="page active py-16 md:py-24 max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <span
          className="text-xs tracking-[0.3em] uppercase block mb-4"
          style={{ color: "var(--accent)", fontFamily: "'Inter', sans-serif" }}
        >
          Writing
        </span>
        <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">半文</h1>
        <p className="max-w-md mx-auto" style={{ color: "var(--muted)" }}>
          随笔，思考，创作，以及那些想要与世界分享的文字
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold">文章列表</h2>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`mag-btn text-xs ${filter === f.value ? "active" : ""}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.file}
            article={article}
            onClick={() => navigate(`/article/${article.file}`)}
          />
        ))}
      </div>
    </section>
  );
}
