import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function FacePage() {
  useDocumentTitle("半面 — Halface");
  return (
    <section id="face" className="page active py-16 md:py-24 max-w-6xl mx-auto px-6">
      <div className="grid md:grid-cols-12 gap-12">
        {/* 左侧头像区 */}
        <div className="md:col-span-4">
          <div className="sticky top-28">
            <div className="aspect-[3/4] overflow-hidden mb-6" style={{ border: "1px solid var(--line)" }}>
              <img
                src="/images/avatar.jpg"
                alt="头像"
                className="w-full h-full object-cover md:grayscale md:hover:grayscale-0 transition-all duration-700"
                onError={(e) => {
                  e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4";
                }}
              />
            </div>
            <div className="text-center">
              <span
                className="text-xs tracking-[0.2em] uppercase block mb-1"
                style={{ color: "var(--muted)", fontFamily: "'Inter', sans-serif" }}
              >
                Author
              </span>
              <h3 className="font-display text-xl font-bold">Halface</h3>
            </div>
          </div>
        </div>
        {/* 右侧内容 */}
        <div className="md:col-span-8">
          <span
            className="text-xs tracking-[0.2em] uppercase block mb-4"
            style={{ color: "var(--accent)", fontFamily: "'Inter', sans-serif" }}
          >
            About
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-10">关于我</h1>
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-8 drop-cap" style={{ color: "var(--ink)" }}>
              我是电子科技大学的大三学生，主修电子信息工程和电子商务专业。在代码与电路之间寻找平衡，在技术与商业的交叉点探索可能。
            </p>
            <p className="text-lg leading-relaxed mb-8" style={{ color: "var(--muted)" }}>
              我相信学习是一场漫长的修行，而记录是思考的延伸。这个网站是我思考的痕迹，也是与这个世界对话的方式。在这里，你可以看到我关于机器学习、信号处理的学习笔记，也能读到我在某个夜晚的随笔与旅途中的诗词。
            </p>
            <blockquote
              className="mb-10 px-6 py-5 text-base leading-relaxed"
              style={{
                borderLeft: "3px solid var(--accent)",
                background: "color-mix(in srgb, var(--accent) 5%, transparent)",
                color: "var(--ink)",
              }}
            >
              志向做一个伟大的人，努力做一个真诚的人，一定做一个善良的人，最好做一个死人。
            </blockquote>
            <div className="mag-divider my-10"></div>
            <h3 className="font-display text-2xl font-bold mb-6">标签</h3>
            <div className="flex flex-wrap gap-3">
              {["AI 使用者", "写作者", "终身学习者"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs tracking-wider uppercase"
                  style={{ border: "1px solid var(--line)", fontFamily: "'Inter', sans-serif" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
