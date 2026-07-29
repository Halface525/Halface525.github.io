import { useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkBreaks from "remark-breaks";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useArticle } from "../hooks/useArticle";
import { GiscusComments } from "../components/GiscusComments";
import { searchIndex } from "../data/siteData";
import { getCategoryLabel, formatDate } from "../utils/helpers";

/** 装饰性分隔线，替代默认 <hr> */
function ArticleDivider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        margin: "2rem 0",
      }}
    >
      <div style={{ flex: 1, height: "1px", background: "var(--line)" }} />
      <span style={{ color: "var(--muted)" }}>&#10022;</span>
      <div style={{ flex: 1, height: "1px", background: "var(--line)" }} />
    </div>
  );
}

/** 检测 remark-math 生成的 code 节点并还原为 $...$ / $$...$$，供 MathJax 排版 */
// eslint-disable-next-line react/prop-types
function MathCode({ className, children }) {
  const isBlock = className?.includes("math-display");
  const value = String(children).replace(/\n$/, "");
  if (isBlock) {
    return <div>{`$$${value}$$`}</div>;
  }
  return <span>{`$${value}$`}</span>;
}

export function ArticlePage() {
  const { "*": filePath } = useParams();
  const navigate = useNavigate();
  const articleRef = useRef(null);
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

  // 文章正文渲染完成后触发 MathJax 排版
  useEffect(() => {
    if (!data?.content || !articleRef.current) return;

    let cancelled = false;

    const renderMath = async () => {
      if (!window.MathJax?.typesetPromise) return;
      if (cancelled || !articleRef.current) return;

      try {
        // 等待 MathJax 初始化完成
        if (window.MathJax.startup?.promise) {
          await window.MathJax.startup.promise;
        }
        if (cancelled || !articleRef.current) return;

        // 给 React 一次绘制机会，确保 DOM 稳定
        await new Promise((resolve) => requestAnimationFrame(resolve));
        if (cancelled || !articleRef.current) return;

        window.MathJax.typesetClear?.([articleRef.current]);
        await window.MathJax.typesetPromise([articleRef.current]);
      } catch (err) {
        console.error("MathJax typeset failed:", err);
      }
    };

    renderMath();
    return () => {
      cancelled = true;
    };
  }, [data?.content]);

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

  return (
    <section id="article-detail" className="page active py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="mag-btn text-xs mb-8">
          <i className="fas fa-arrow-left mr-2"></i>返回
        </button>

        <article ref={articleRef} className="article-body">
          <div
            className="mb-10 pb-6"
            style={{ borderBottom: "1px solid var(--line)" }}
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">
              {meta?.title || "无标题"}
            </h1>
            {meta?.date && (
              <div
                className="flex flex-wrap gap-4 text-sm"
                style={{
                  color: "var(--muted)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <span>{formatDate(meta.date)}</span>
                {meta.category && (
                  <span>{getCategoryLabel(meta.category)}</span>
                )}
              </div>
            )}
          </div>

          {data?.content && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
              components={{
                hr: ArticleDivider,
                code: ({ className, children }) => {
                  if (className?.includes("language-math")) {
                    return <MathCode className={className}>{children}</MathCode>;
                  }
                  return <code className={className}>{children}</code>;
                },
                pre: ({ children }) => {
                  // remark-math 的块级公式会包在 <pre><code class="language-math math-display"> 中，
                  // 这里直接透传 MathCode 生成的 div，避免再套一层 pre 样式。
                  if (children?.props?.className?.includes("language-math")) {
                    return children;
                  }
                  return <pre>{children}</pre>;
                },
              }}
            >
              {data.content}
            </ReactMarkdown>
          )}
        </article>

        <div className="mt-16 pt-8" style={{ borderTop: "1px solid var(--line)" }}>
          <GiscusComments />
        </div>
      </div>
    </section>
  );
}
