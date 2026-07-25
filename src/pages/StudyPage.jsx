import { useState } from "react";
import { useNavigate } from "react-router";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { ArticleCard } from "../components/ArticleCard";
import { TimelineItem } from "../components/TimelineItem";
import { MagButton } from "../components/MagButton";
import { techArticlesData } from "../data/techArticles";
import { learningTimeline } from "../data/siteData";
import { sortByDateDesc } from "../utils/helpers";

const FILTERS = [
  { value: "all", label: "全部" },
  { value: "ml", label: "机器学习" },
  { value: "modeling", label: "数学建模" },
  { value: "convex", label: "凸优化" },
];

export function StudyPage() {
  useDocumentTitle("半学 — Halface");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const articles = sortByDateDesc(
    filter === "all" ? techArticlesData : techArticlesData.filter((a) => a.category === filter)
  );

  return (
    <section id="study" className="page active py-16 md:py-24 max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <span
          className="text-xs tracking-[0.3em] uppercase block mb-4"
          style={{ color: "var(--accent)", fontFamily: "'Inter', sans-serif" }}
        >
          Study Notes
        </span>
        <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">半学</h1>
        <p className="max-w-md mx-auto" style={{ color: "var(--muted)" }}>
          路漫漫其修远兮，吾将上下而求索
        </p>
      </div>

      {/* 学习路径 */}
      <div className="mb-20 max-w-3xl mx-auto">
        <h2 className="font-display text-2xl font-bold mb-8 text-center">学习路径</h2>
        <div className="relative pl-8">
          {learningTimeline.map((item, index) => (
            <TimelineItem key={index} item={item} isLast={index === learningTimeline.length - 1} />
          ))}
        </div>
      </div>

      <div className="mag-divider mb-16"></div>

      {/* 技术博客 */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold">技术博客</h2>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <MagButton
              key={f.value}
              active={filter === f.value}
              onClick={() => setFilter(f.value)}
              className="text-xs"
            >
              {f.label}
            </MagButton>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <ArticleCard
            key={a.file}
            article={a}
            showSequence={true}
            onClick={() => navigate(`/article/${a.file}`)}
          />
        ))}
      </div>
    </section>
  );
}
