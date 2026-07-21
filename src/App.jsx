import { HashRouter, Routes, Route } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { FacePage } from "./pages/FacePage";
import { StudyPage } from "./pages/StudyPage";
import { WritingPage } from "./pages/WritingPage";
import { FunPage } from "./pages/FunPage";
import { ArticlePage } from "./pages/ArticlePage";

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/face" element={<FacePage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/fun" element={<FunPage />} />
          <Route path="/article/*" element={<ArticlePage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
