import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import DOMPurify from "dompurify";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useArticle } from "../hooks/useArticle";
import { GiscusComments } from "../components/GiscusComments";
import { searchIndex } from "../data/siteData";
import { getCategoryLabel, formatDate } from "../utils/helpers";

export function ArticlePage() {
  const { "*": filePath } = useParams();
  const navigate = useNavigate();
  const decodedPath = filePath ? decodeURIComponent(filePath) : "";
  const { data, loading, error } = useArticle(decodedPath);

  const meta = useMemo(() => {
    const found = searchIndex.find((item) => item.file === decodedPath);
    if (found) return found;
    if (data?.metadata) {
      return {
        title: data.metadata.title || "文章",
        category: data.metadata.category || "",
        date: data.metadata.date || "",
      };
    }
    return null;
  }, [decodedPath, data]);

  useDocumentTitle(meta?.title ? `${meta.title} — Halface` : "文章 — Halface");

  const safeHtml = useMemo(() => {
    if (!data?.html) return "";
    return DOMPurify.sanitize(data.html);
  }, [data]);

  useEffect(() => {
    if (!safeHtml) return;
    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }, [safeHtml]);

  const section = decodedPath.startsWith("content/study") ? "半学" : "半文";

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center" style={{ color: "var(--muted)" }}>
        <i className="fas fa-circle-notch fa-spin mr-2"></i>
        正在加载文章…
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="mb-4" style={{ color: "var(--muted)" }}>
          文章加载失败：{error}
        </p>
        <button onClick={() => navigate("/")} className="mag-btn">
          返回首页
        </button>
      </div>
    );
  }

  const headerHtml = `
    <div class="mb-10 pb-6" style="border-bottom: 1px solid var(--line);">
      <h1 class="font-display text-3xl md:text-4xl font-bold mb-6">${meta?.title || "无标题"}</h1>
      ${
        meta?.date
          ? `<div class="flex flex-wrap gap-4 text-sm" style="color: var(--muted); font-family: 'Inter', sans-serif;">
               <span>${formatDate(meta.date)}</span>
               ${meta.category ? `<span>${getCategoryLabel(meta.category)}</span>` : ""}
             </div>`
          : ""
      }
    </div>
  `;

  return (
    <section id="article-detail" className="page active py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="mag-btn text-xs mb-8">
          <i className="fas fa-arrow-left mr-2"></i>返回
        </button>
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(headerHtml + safeHtml) }}
        />
        <div className="mt-16 pt-8" style={{ borderTop: "1px solid var(--line)" }}>
          <GiscusComments />
        </div>
      </div>
    </section>
  );
}
