import { useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { techArticlesData } from "../data/techArticles";
import { writingArticlesData } from "../data/writingArticles";
import { projectsData, updatesData } from "../data/siteData";
import { getCategoryLabel, getCardLabel, sortByDateDesc } from "../utils/helpers";

const SPOTLIGHT_WORDS = [
  { text: "半面" }, { text: "Halface" }, { text: "ハーフフェイス" },
  { text: "Demi-face" }, { text: "Halbgesicht" }, { text: "Mezza faccia" },
  { text: "반면" }, { text: "Medio rostro" }, { text: "Полулицо" },
  { text: "half" }, { text: "face" }, { text: "H" },
  { text: "halface" }, { text: "半" }, { text: "HALFACE" },
  { text: "半面半学" }, { text: "半文" }, { text: "半趣" },
  { text: "Half Face" }, { text: "demi-visage" }, { text: "halv ansigt" },
  { text: "Halv ansikt" }, { text: "Puolikas" }, { text: "Halv del" },
  { text: "Félig arc" }, { text: "Pół twarzy" }, { text: "Semi-față" },
  { text: "Halvt ansikte" }, { text: "Yarım yüz" }
];

function useStableRandom(items) {
  return useMemo(() => {
    const cols = 7, rows = 5;
    const centerColStart = 2, centerColEnd = 5;
    const centerRowStart = 1, centerRowEnd = 4;
    const result = [];
    items.forEach((w, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols) % rows;
      if (col >= centerColStart && col < centerColEnd && row >= centerRowStart && row < centerRowEnd) return;
      const x = (col / cols) * 100 + (5 + Math.random() * 10);
      const y = (row / rows) * 100 + (5 + Math.random() * 10);
      const size = 0.7 + Math.random() * 1.8;
      result.push({ text: w.text, x, y, size });
    });
    return result;
  }, []);
}

export function HomePage() {
  useDocumentTitle("Halface");
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const circleRef = useRef(null);
  const words = useStableRandom(SPOTLIGHT_WORDS);

  useEffect(() => {
    const hero = heroRef.current;
    const circle = circleRef.current;
    if (!hero || !circle) return;

    // 有 hover 能力的设备（桌面/触控笔）：鼠标跟随透镜
    if (window.matchMedia("(hover: hover)").matches) {
      let hideTimer;
      let inside = false;

      const handleMove = (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        clearTimeout(hideTimer);
        if (!inside) {
          // 从外部进入：先就位（44px 透明、无过渡），再平滑放大淡入
          inside = true;
          circle.style.transition = "none";
          circle.style.display = "block";
          circle.style.left = `${x}px`;
          circle.style.top = `${y}px`;
          void circle.offsetWidth; // 强制 reflow 记录当前状态
          circle.style.transition =
            "opacity 0.35s ease, width 0.35s ease, height 0.35s ease";
          circle.style.opacity = "1";
          circle.style.width = "280px";
          circle.style.height = "280px";
          return;
        }
        // 透镜内移动：仅更新位置，不触发过渡
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;
      };
      const handleLeave = () => {
        // 平滑缩小淡出，衔接自定义光标
        inside = false;
        circle.style.transition =
          "opacity 0.35s ease, width 0.35s ease, height 0.35s ease";
        circle.style.opacity = "0";
        circle.style.width = "44px";
        circle.style.height = "44px";
        hideTimer = setTimeout(() => {
          circle.style.display = "none";
        }, 380);
      };

      hero.addEventListener("mousemove", handleMove);
      hero.addEventListener("mouseleave", handleLeave);
      return () => {
        clearTimeout(hideTimer);
        hero.removeEventListener("mousemove", handleMove);
        hero.removeEventListener("mouseleave", handleLeave);
      };
    }

    // 无 hover 设备（移动端）：自动漫游 + 触摸跟随
    circle.style.width = "200px";
    circle.style.height = "200px";
    circle.style.display = "block";

    let raf;
    let t = 0;
    let following = false;
    let tx = 0;
    let ty = 0;

    const tick = () => {
      t += 0.008;
      const rect = hero.getBoundingClientRect();
      let x, y;
      if (following) {
        x = tx;
        y = ty;
      } else {
        // Lissajous 轨迹缓慢游动
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        x = cx + rect.width * 0.42 * Math.sin(t);
        y = cy + rect.height * 0.36 * Math.sin(1.6 * t + 1.2);
      }
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;
      raf = requestAnimationFrame(tick);
    };

    const handleTouchStart = (e) => {
      const rect = hero.getBoundingClientRect();
      const touch = e.touches[0];
      if (!touch) return;
      following = true;
      tx = touch.clientX - rect.left;
      ty = touch.clientY - rect.top;
    };
    const handleTouchMove = (e) => {
      // 阻止页面随手指滚动（不拦截 touchstart，否则按钮点击失效）
      if (e.cancelable) e.preventDefault();
      const rect = hero.getBoundingClientRect();
      const touch = e.touches[0];
      if (!touch) return;
      following = true;
      tx = touch.clientX - rect.left;
      ty = touch.clientY - rect.top;
    };
    const handleTouchEnd = () => {
      following = false;
    };

    raf = requestAnimationFrame(tick);
    hero.addEventListener("touchstart", handleTouchStart, { passive: true });
    hero.addEventListener("touchmove", handleTouchMove, { passive: false });
    hero.addEventListener("touchend", handleTouchEnd);
    hero.addEventListener("touchcancel", handleTouchEnd);
    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("touchstart", handleTouchStart);
      hero.removeEventListener("touchmove", handleTouchMove);
      hero.removeEventListener("touchend", handleTouchEnd);
      hero.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  const latestStudy = sortByDateDesc(techArticlesData)[0];
  const latestWriting = sortByDateDesc(writingArticlesData)[0];
  const projectKey = "project2";
  const project = projectsData[projectKey];

  const goRandomArticle = () => {
    const pool = [...techArticlesData, ...writingArticlesData];
    const pick = pool[Math.floor(Math.random() * pool.length)];
    navigate(`/article/${pick.file}`);
  };

  const featured = [
    { type: "article", data: latestStudy, label: getCategoryLabel(latestStudy.category) },
    { type: "article", data: latestWriting, label: getCategoryLabel(latestWriting.category) },
    { type: "project", data: project, key: projectKey, label: "项目" }
  ];

  return (
    <main className="max-w-6xl mx-auto px-6">
      <section id="home" className="page active">
        {/* 杂志封面 */}
        <div
          ref={heroRef}
          className="py-20 md:py-32 text-center magazine-hero"
          style={{ position: "relative", overflow: "hidden", cursor: "none" }}
        >
          {/* 底层纹理文字 */}
          <div
            style={{ position: "absolute", inset: 0, zIndex: 0 }}
          >
            {words.map((w, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: `${w.x}%`,
                  top: `${w.y}%`,
                  fontSize: `${w.size}rem`,
                  color: "var(--muted)",
                  opacity: 0.18,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  fontFamily: "'Playfair Display','Noto Serif SC',serif",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                {w.text}
              </span>
            ))}
          </div>
          {/* 反色圆形 */}
          <div
            ref={circleRef}
            style={{
              position: "absolute",
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              pointerEvents: "none",
              zIndex: 20,
              backdropFilter: "invert(1)",
              WebkitBackdropFilter: "invert(1)",
              display: "none",
              transform: "translate(-50%, -50%)",
            }}
          ></div>
          {/* 封面内容 */}
          <div className="relative z-10">
            <div className="animate-fade-up delay-100">
              <span
                className="inline-block text-xs tracking-[0.3em] uppercase mb-6"
                style={{ color: "var(--muted)", fontFamily: "'Inter', sans-serif" }}
              >
                Personal Magazine &mdash; 2026
              </span>
            </div>
            <h1
              className="font-display text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.95] mb-8 animate-fade-up delay-200"
              style={{ color: "var(--ink)" }}
            >
              Halface
            </h1>
            <p
              className="text-lg md:text-xl max-w-xl mx-auto leading-relaxed animate-fade-up delay-300"
              style={{ color: "var(--muted)" }}
            >
              赚一点钱，收到一束花，然后自杀。
            </p>
            <div className="mt-12 flex justify-center gap-4 animate-fade-up delay-300">
              <button className="mag-btn accent" onClick={goRandomArticle}>
                随机文章
              </button>
              <button className="mag-btn" onClick={() => navigate("/face")}>
                关于作者
              </button>
            </div>
          </div>
        </div>

        <div className="mag-divider my-16"></div>

        {/* 本期精选 */}
        <div className="mb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span
                className="text-xs tracking-[0.2em] uppercase block mb-2"
                style={{ color: "var(--accent)", fontFamily: "'Inter', sans-serif" }}
              >
                Featured
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold">本期精选</h2>
            </div>
            <Link
              to="/study"
              className="text-sm hover:opacity-60 transition-opacity hidden md:block"
              style={{ color: "var(--muted)", fontFamily: "'Inter', sans-serif" }}
            >
              查看全部 <i className="fas fa-arrow-right ml-1 text-xs"></i>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((item, i) =>
              item.type === "article" ? (
                <FeaturedArticleCard
                  key={i}
                  article={item.data}
                  label={item.label}
                  onClick={() => navigate(`/article/${item.data.file}`)}
                />
              ) : (
                <FeaturedProjectCard
                  key={i}
                  project={item.data}
                  projectKey={item.key}
                  label={item.label}
                />
              )
            )}
          </div>
        </div>

        <div className="mag-divider my-16"></div>

        {/* 最近更新 */}
        <div className="mb-20">
          <span
            className="text-xs tracking-[0.2em] uppercase block mb-2"
            style={{ color: "var(--accent)", fontFamily: "'Inter', sans-serif" }}
          >
            Updates
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-10">最近更新</h2>
          <div className="space-y-6">
            {updatesData.map((update) => (
              <div
                key={update.id}
                className="flex items-start gap-6 py-4 border-b cursor-pointer group"
                style={{ borderColor: "var(--line)" }}
                onClick={() => handleUpdateClick(update.action, navigate)}
              >
                <span className="font-display text-2xl md:text-3xl font-bold opacity-20 group-hover:opacity-40 transition-opacity">
                  {update.id}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-[var(--accent)] transition-colors">
                    {update.title}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    {update.desc}
                  </p>
                </div>
                <span
                  className="text-xs hidden md:block"
                  style={{ color: "var(--muted)", fontFamily: "'Inter', sans-serif" }}
                >
                  {update.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function handleUpdateClick(action, navigate) {
  if (!action) return;
  if (action.type === "article") {
    navigate(`/article/${action.file}`);
  } else if (action.type === "navigate") {
    navigate(action.target);
  } else if (action.type === "toggleMusic") {
    window.dispatchEvent(new CustomEvent("toggle-music-player"));
  } else if (action.type === "toggleSearch") {
    window.dispatchEvent(new CustomEvent("toggle-search-modal"));
  }
}

function FeaturedArticleCard({ article, label, onClick }) {
  return (
    <article className="mag-card cursor-pointer group" onClick={onClick}>
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
          {label}
        </span>
        <h3 className="font-display text-xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">
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
          <span>{article.readTime}</span>
        </div>
      </div>
    </article>
  );
}

function FeaturedProjectCard({ project, projectKey, label }) {
  const navigate = useNavigate();
  return (
    <article
      className="mag-card cursor-pointer group"
      onClick={() => navigate(`/fun?project=${projectKey}`)}
    >
      <div
        className="aspect-[4/3] flex items-center justify-center text-3xl md:text-4xl font-display font-bold opacity-25 group-hover:opacity-60 transition-opacity"
        style={{ background: "var(--line)", color: "var(--ink)" }}
      >
        {getCardLabel(project.title)}
      </div>
      <div className="p-6">
        <span
          className="text-xs tracking-wider uppercase block mb-2"
          style={{ color: "var(--accent)", fontFamily: "'Inter', sans-serif" }}
        >
          {label}
        </span>
        <h3 className="font-display text-xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">
          {project.title}
        </h3>
        <p className="text-sm mb-4 line-clamp-2" style={{ color: "var(--muted)" }}>
          {project.description}
        </p>
        <div
          className="flex justify-between items-center text-xs"
          style={{ color: "var(--muted)", fontFamily: "'Inter', sans-serif" }}
        >
          <span>半趣</span>
          <span>查看详情 &rarr;</span>
        </div>
      </div>
    </article>
  );
}
