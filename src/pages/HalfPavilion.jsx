import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useMusicPlayer } from "../hooks/useMusicPlayer";
import { RadioPlayer } from "../components/RadioPlayer";
import { techArticlesData } from "../data/techArticles";
import { writingArticlesData } from "../data/writingArticles";
import { projectsList } from "../data/siteData";
import { GiscusComments } from "../components/GiscusComments";
import { getCategoryLabel, CATEGORY_TONES } from "../utils/helpers";

// 半文 / 半趣的标识色（仅书架内使用）
const OTHER_TONES = {
  thinking: "#8a6d3b",
  reading: "#5c6b8a",
  travel: "#3b7a6a",
  fun: "#8a4f3b",
};
const toneOf = (category) => CATEGORY_TONES[category] || OTHER_TONES[category];

// 书脊厚度按篇数微调，高度统一
function bookThickness(count) {
  return 52 + count * 3;
}

// 书架分层：上层半文 + 半趣，下层半学
const SHELVES = [
  {
    label: "半文",
    height: 240,
    books: [
      { kind: "article", category: "thinking", title: "半思", source: writingArticlesData },
      { kind: "article", category: "reading", title: "半读", source: writingArticlesData },
      { kind: "article", category: "travel", title: "半游", source: writingArticlesData },
      { kind: "project", category: "fun", title: "半趣", source: projectsList },
    ],
  },
  {
    label: "半学",
    height: 300,
    books: [
      { kind: "article", category: "ml", title: "机器学习", source: techArticlesData },
      { kind: "article", category: "modeling", title: "数学建模", source: techArticlesData },
      { kind: "article", category: "convex", title: "凸优化", source: techArticlesData },
      { kind: "article", category: "array", title: "阵列处理", source: techArticlesData },
    ],
  },
];

function bookCount(book) {
  return book.kind === "project"
    ? book.source.length
    : book.source.filter((a) => a.category === book.category).length;
}

// 书里的内容：文章按序号升序；项目原样
function bookItems(book) {
  if (book.kind === "project") {
    return book.source.map((p) => ({
      title: p.title,
      desc: p.description,
      date: "",
      readTime: "查看详情",
      target: `/fun?project=${p.id}`,
    }));
  }
  return book.source
    .filter((a) => a.category === book.category)
    .sort((a, b) => {
      const na = parseInt(a.file.match(/(\d+)-/)?.[1] || 0, 10);
      const nb = parseInt(b.file.match(/(\d+)-/)?.[1] || 0, 10);
      return na - nb;
    })
    .map((a) => ({
      title: a.title,
      desc: a.desc,
      date: a.date,
      readTime: a.readTime,
      target: `/article/${a.file}`,
    }));
}

function findBook(category) {
  for (const shelf of SHELVES) {
    const found = shelf.books.find((b) => b.category === category);
    if (found) return found;
  }
  return null;
}

/** 七段数码管数字：亮段用墨色，灭段用浅底 */
const SEGMENTS = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "g", "e", "d"],
  "3": ["a", "b", "g", "c", "d"],
  "4": ["f", "g", "b", "c"],
  "5": ["a", "f", "g", "c", "d"],
  "6": ["a", "f", "g", "e", "c", "d"],
  "7": ["a", "b", "c"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
  "9": ["a", "b", "c", "d", "f", "g"],
};

/* 标准七段码坐标（viewBox 24×46）：横竖段在转角处互相嵌合，
   保证点亮所有段时形成一个规整的“8”。 */
const SEG_LAYOUT = [
  { key: "a", points: "4,2 20,2 22,4 20,6 4,6 2,4" },
  { key: "b", points: "20,4 22,2 22,20 20,22 18,20 18,6" },
  { key: "c", points: "20,24 22,22 22,40 20,42 18,40 18,26" },
  { key: "d", points: "4,40 20,40 22,42 20,44 4,44 2,42" },
  { key: "e", points: "4,24 6,26 6,40 4,42 2,40 2,22" },
  { key: "f", points: "4,4 6,2 6,20 4,22 2,20 2,2" },
  { key: "g", points: "4,22 20,22 22,24 20,26 4,26 2,24" },
];

function SevenSegmentDigit({ digit }) {
  const on = SEGMENTS[digit] ?? [];
  return (
    <svg className="dc-digit" viewBox="0 0 24 46" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {SEG_LAYOUT.map(({ key, points }) => (
        <polygon
          key={key}
          points={points}
          fill={on.includes(key) ? "var(--ink)" : "color-mix(in srgb, var(--ink) 12%, transparent)"}
        />
      ))}
    </svg>
  );
}

/** 画框里的数码时钟：七段 HH:MM:SS，秒级走时 */
function ClockFace() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(
    now.getDate()
  ).padStart(2, "0")}`;

  return (
    <>
      <div className="digital-clock">
        <SevenSegmentDigit digit={hh[0]} />
        <SevenSegmentDigit digit={hh[1]} />
        <span className="dc-colon" aria-hidden="true" />
        <SevenSegmentDigit digit={mm[0]} />
        <SevenSegmentDigit digit={mm[1]} />
        <span className="dc-colon" aria-hidden="true" />
        <SevenSegmentDigit digit={ss[0]} />
        <SevenSegmentDigit digit={ss[1]} />
      </div>
      <div className="pf-caption">{dateStr}</div>
    </>
  );
}

export function HalfPavilion() {
  useDocumentTitle("半阁 — Halface");
  const navigate = useNavigate();
  const music = useMusicPlayer();
  const timerRef = useRef(null);
  const [selected, setSelected] = useState(null); // category
  const [phase, setPhase] = useState("idle"); // idle → lift → open

  const openBook = (cat) => {
    if (selected === cat && phase === "open") return;
    setSelected(cat);
    setPhase("lift");
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setPhase("open"), 480);
  };

  const closeBook = () => {
    clearTimeout(timerRef.current);
    setSelected(null);
    setPhase("idle");
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const activeBook = selected ? findBook(selected) : null;
  const activeItems = activeBook ? bookItems(activeBook) : [];

  return (
    <section className="page active py-16 md:py-24 max-w-6xl mx-auto px-6">
      {/* 页头 */}
      <div className="mb-12">
        <span
          className="text-xs tracking-[0.2em] uppercase block mb-4"
          style={{ color: "var(--accent)", fontFamily: "'Inter', sans-serif" }}
        >
          A Quiet Corner
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">半阁</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          一架书，一台收音机，一页时钟。收藏着半学、半文、半趣的零碎，适合随手翻翻，或者坐下来听点什么。
        </p>
      </div>

      {/* 左书架 + 右收音机 */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        <div className="bookshelf lg:self-start">
        {SHELVES.map((shelf, index) => (
          <div key={shelf.label} className="shelf-row">
            {index === 0 && <div className="shelf-board"></div>}
            <div className="books">
              {shelf.books.map((b) => {
                const count = bookCount(b);
                const isActive = selected === b.category && phase !== "idle";
                return (
                  <div
                    key={b.category}
                    className={`book ${isActive ? "lift" : ""} ${
                      phase === "open" && selected === b.category ? "open" : ""
                    } ${b.category === "fun" ? "lean" : ""}`}
                    style={{
                      height: shelf.height,
                      width: bookThickness(count),
                    }}
                    onClick={() => openBook(b.category)}
                    title={`${b.title} · ${count} 篇`}
                  >
                    <span className="book-tag" style={{ background: toneOf(b.category) }}></span>
                    <span className="book-title">{b.title}</span>
                    <span className="book-count">{count}</span>
                  </div>
                );
              })}
            </div>
            <div className="shelf-board"></div>
          </div>
        ))}

        {/* 展开的面板：书被"翻开"后的内页 */}
        {selected && phase === "open" && activeBook && (
          <div className="book-panel">
            <button
              className="book-panel-close"
              onClick={closeBook}
              aria-label="合上书本"
            >
              <i className="fas fa-times"></i>
            </button>
            <div className="book-panel-head">
              <span
                className="text-xs tracking-[0.2em] uppercase"
                style={{ color: toneOf(activeBook.category), fontFamily: "'Inter', sans-serif" }}
              >
                {activeBook.kind === "project"
                  ? "半趣 · 项目"
                  : getCategoryLabel(activeBook.category)}
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-bold">
                {activeBook.title}
              </h3>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {activeItems.length} 篇
              </p>
            </div>
            <div className="book-panel-list">
              {activeItems.map((item) => (
                <button
                  key={item.title}
                  className="book-panel-item"
                  onClick={() => navigate(item.target)}
                >
                  <span className="font-display font-bold" style={{ color: "var(--ink)" }}>
                    {item.title}
                  </span>
                  <span className="book-panel-meta">
                    {item.date ? `${item.date} · ${item.readTime}` : item.readTime}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        </div>

        {/* 右栏：画框 + 收音机（播放器拟物化） */}
        <div className="radio-wrap">
          <div className="picture-frame">
            <svg
              className="pf-hanger"
              viewBox="0 0 400 28"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* 挂绳：从画框左右顶边汇聚到上方钉子，与画框边框同色 */}
              <line x1="10" y1="28" x2="200" y2="7" stroke="var(--muted)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <line x1="200" y1="7" x2="390" y2="28" stroke="var(--muted)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              {/* 钉子：圆头中间带十字槽 */}
              <circle cx="200" cy="4" r="4" fill="var(--ink)" />
              <line x1="196.5" y1="4" x2="203.5" y2="4" stroke="var(--paper)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <line x1="200" y1="0.5" x2="200" y2="7.5" stroke="var(--paper)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </svg>
            <span className="pf-label">Clock</span>
            <ClockFace />
            <div className="pf-logo" aria-hidden="true">Halface</div>
          </div>
          <RadioPlayer {...music} />
        </div>
      </div>

      <div className="mt-16 pt-8" style={{ borderTop: "1px solid var(--line)" }}>
        <GiscusComments />
      </div>
    </section>
  );
}
