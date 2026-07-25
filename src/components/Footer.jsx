export function Footer() {
  return (
    <footer className="border-t mt-24 py-16" style={{ borderColor: "var(--line)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="font-display text-2xl font-bold mb-2" style={{ color: "var(--accent)" }}>
              Halface
            </div>
            <div className="text-sm" style={{ color: "var(--muted)" }}>
              志向做一个伟大的人，努力做一个真诚的人，一定做一个善良的人
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
              className="relative group w-11 h-11 flex items-center justify-center transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer"
              style={{ border: "1px solid var(--line)", color: "var(--muted)" }}
            >
              <i className="fab fa-weixin"></i>
              <div
                className="absolute hidden group-hover:block p-3 rounded-lg shadow-xl z-50"
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
          &copy; 2026 Made by Halface | v3.1.0
        </div>
      </div>
    </footer>
  );
}
