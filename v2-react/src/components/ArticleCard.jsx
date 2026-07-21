import { getCategoryLabel, getCardLabel } from "../utils/helpers";

export function ArticleCard({ article, onClick }) {
  return (
    <article
      className="mag-card cursor-pointer group"
      onClick={onClick}
    >
      <div
        className="aspect-[4/3] flex items-center justify-center text-3xl md:text-4xl font-display font-bold opacity-25 group-hover:opacity-60 transition-opacity"
        style={{ background: "var(--line)", color: "var(--ink)" }}
      >
        {getCardLabel(article.title)}
      </div>
      <div className="p-6">
        <span
          className="text-xs tracking-wider uppercase block mb-2"
          style={{ color: "var(--accent)", fontFamily: "'Inter', sans-serif" }}
        >
          {getCategoryLabel(article.category)}
        </span>
        <h3 className="font-display text-lg font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">
          {article.title}
        </h3>
        <p className="text-sm mb-4 line-clamp-2" style={{ color: "var(--muted)" }}>
          {article.desc}
        </p>
        <div
          className="flex justify-between items-center text-xs"
          style={{ color: "var(--muted)", fontFamily: "'Inter', sans-serif" }}
        >
          <span>{article.date}</span>
          <span>{article.readTime} &rarr;</span>
        </div>
      </div>
    </article>
  );
}
