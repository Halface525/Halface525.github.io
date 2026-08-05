import { Link, useLocation } from "react-router";

const navItems = [
  { id: "home", label: "主页", path: "/" },
  { id: "face", label: "半面", path: "/face" },
  { id: "study", label: "半学", path: "/study" },
  { id: "writing", label: "半文", path: "/writing" },
  { id: "fun", label: "半趣", path: "/fun" },
];

export function Navbar({ isDark, toggleTheme, onToggleSearch, onToggleMusic }) {
  const location = useLocation();
  const currentPage =
    navItems.find((item) => item.path === location.pathname)?.id ||
    (location.pathname.includes("/content/study/")
      ? "study"
      : location.pathname.includes("/content/writing/")
        ? "writing"
        : "home");

  return (
    <nav
      className="site-navbar sticky top-0 z-50 border-b"
      style={{
        borderColor: "var(--line)",
        background: isDark ? "rgba(15,15,15,0.92)" : "rgba(250,249,247,0.92)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="font-display text-3xl font-bold tracking-tight"
          style={{ color: "var(--accent)" }}
        >
          Halface
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-link ${currentPage === item.id ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            className="text-sm hover:opacity-60 transition-opacity"
            onClick={onToggleMusic}
            title="音乐播放器"
          >
            <i className="fas fa-music"></i>
          </button>
          <button
            className="text-sm hover:opacity-60 transition-opacity"
            onClick={onToggleSearch}
            title="搜索"
          >
            <i className="fas fa-search"></i>
          </button>
          <button
            className="text-sm hover:opacity-60 transition-opacity"
            onClick={toggleTheme}
            title="切换主题"
          >
            <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`}></i>
          </button>
        </div>
      </div>

      <div
        className="md:hidden flex justify-center gap-4 pb-3 text-sm"
        style={{ borderTop: "1px solid var(--line)" }}
      >
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`nav-link py-2 ${currentPage === item.id ? "active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
