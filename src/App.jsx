import { HashRouter, Routes, Route, useLocation } from "react-router";
import { useEffect, useRef } from "react";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { FacePage } from "./pages/FacePage";
import { StudyPage } from "./pages/StudyPage";
import { WritingPage } from "./pages/WritingPage";
import { FunPage } from "./pages/FunPage";
import { ArticlePage } from "./pages/ArticlePage";
import { HalfPavilion } from "./pages/HalfPavilion";

/** 拉取不蒜子当前页面统计并回填到对应的 span */
function refreshBusuanzi() {
  const src = document.querySelector('script[src*="busuanzi"]')?.src;
  if (!src) return;
  const u = new URL(src);
  fetch(`${u.protocol}//${u.host}/api.php`, {
    method: "POST",
    body: JSON.stringify({ url: window.location.href, referrer: document.referrer }),
  })
    .then((r) => r.json())
    .then((r) => {
      for (const k in r) {
        document.querySelectorAll(`#${k}`).forEach((e) => (e.innerText = r[k]));
      }
    })
    .catch(() => {});
}

function AppRoutes() {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // 整页加载时脚本已为当前 URL 请求过，跳过避免重复计数；
    // 仅 SPA 路由切换后重新拉取统计。
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    refreshBusuanzi();
  }, [location.key]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/face" element={<FacePage />} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/writing" element={<WritingPage />} />
        <Route path="/fun" element={<FunPage />} />
        <Route path="/article/*" element={<ArticlePage />} />
        <Route path="/bookshelf" element={<HalfPavilion />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}

export default App;
