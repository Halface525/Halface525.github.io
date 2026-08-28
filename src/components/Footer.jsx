import { useEffect, useRef, useState } from "react";

export function Footer() {
  const [showQr, setShowQr] = useState(false);
  const qrRef = useRef(null);

  // 点击二维码区域外部时关闭（移动端无 hover，靠点击切换）
  useEffect(() => {
    const onDocClick = (e) => {
      if (qrRef.current && !qrRef.current.contains(e.target)) setShowQr(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <footer className="border-t mt-24 py-16" style={{ borderColor: "var(--line)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="font-display text-2xl font-bold mb-2" style={{ color: "var(--accent)" }}>
              Halface
            </div>
            <div className="text-sm" style={{ color: "var(--muted)" }}>
              志向做一个伟大的人，努力做一个真诚的人，一定做一个善良的人，最好做一个死人
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href="mailto:panqihao525@163.com"
              className="w-11 h-11 flex items-center justify-center transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
              style={{ border: "1px solid var(--line)", color: "var(--muted)" }}
              title="邮箱"
            >
              <i className="fas fa-envelope"></i>
            </a>
            <a
              href="https://github.com/Halface525"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 flex items-center justify-center transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
              style={{ border: "1px solid var(--line)", color: "var(--muted)" }}
              title="GitHub"
            >
              <i className="fab fa-github"></i>
            </a>
            <div
              ref={qrRef}
              className="relative group w-11 h-11 flex items-center justify-center transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer"
              style={{ border: "1px solid var(--line)", color: "var(--muted)" }}
              onClick={() => setShowQr((v) => !v)}
            >
              <i className="fab fa-weixin"></i>
              <div
                className={`absolute p-3 rounded-lg shadow-xl z-50 ${
                  showQr ? "block" : "hidden md:group-hover:block"
                }`}
                style={{
                  bottom: "calc(100% + 12px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  width: "140px",
                }}
              >
                <img
                  src="/images/wechat-qr.jpg"
                  alt="公众号二维码"
                  style={{
                    width: "116px",
                    height: "116px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    display: "block",
                  }}
                  onError={(e) => (e.target.style.display = "none")}
                />
                <div
                  className="text-center text-xs mt-2"
                  style={{ color: "var(--muted)" }}
                >
                  公众号
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="text-center mt-12 text-xs tracking-wider"
          style={{ color: "var(--muted)", fontFamily: "'Inter', sans-serif" }}
        >
          &copy; 2026 Made by Halface | v3.3.0 |{" "}
          <i className="fas fa-eye mr-1"></i>总访问量{" "}
          <span id="busuanzi_value_site_pv"></span> 人次 ·{" "}
          <i className="fas fa-user mr-1"></i>访客{" "}
          <span id="busuanzi_value_site_uv"></span> 人
        </div>
      </div>
    </footer>
  );
}
