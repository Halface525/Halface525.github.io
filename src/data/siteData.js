// Giscus 评论系统配置
export const GISCUS_CONFIG = {
  repo: "Halface525/comments",
  repoId: "R_kgDORxheUQ",
  category: "General",
  categoryId: "DIC_kwDORxheUc4C5Vdr",
  mapping: "title",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  theme: "preferred_color_scheme",
  lang: "zh-CN",
  enabled: true,
};

// 项目数据（半趣栏目）
export const projectsData = {
  project2: {
    title: "Imperium Civitatum",
    icon: "",
    description: "一个关于历史/政治/地理的策略游戏。",
    details:
      '<p class="mb-4">Imperium Civitatum 是一款探索历史文明与政治体系的策略游戏。</p><h4 class="font-bold mb-2">游戏特色</h4><ul class="list-disc list-inside mb-4 space-y-1"><li>历史文明模拟</li><li>政治体系策略</li><li>地理扩张玩法</li></ul>',
    link: "https://halface525.github.io/imperium-civitatum",
    github: "#",
  },
  project3: {
    title: "Dozu",
    icon: "",
    description: "Something new is coming.",
    details: '<p class="mb-4">开发中……</p>',
    link: "#",
    github: "#",
  },
};

export const projectsList = [
  { id: "project2", ...projectsData.project2 },
  { id: "project3", ...projectsData.project3 },
];

// 学习路径时间线数据
export const learningTimeline = [
  { time: "2024.09 - 2025.02", status: "已完成", title: "编程入门", desc: "从零开始学习编程，掌握 Python 基础语法、数据结构和算法，完成多个练手项目。", skills: ["Python", "数据结构", "算法", "Git"] },
  { time: "2025.02 - 2025.10", status: "已完成", title: "数学建模", desc: "学习线性代数、概率统计、优化理论，参加数学建模竞赛，将数学应用于实际问题求解。", skills: ["MATLAB", "线性代数", "概率统计", "优化算法"] },
  { time: "2025.10 - 2026.01", status: "已完成", title: "机器学习基础", desc: "系统学习监督学习、无监督学习、强化学习基础算法，掌握 Scikit-learn 和基础神经网络。", skills: ["Python", "Scikit-learn", "回归/分类", "聚类"] },
  { time: "2026.01 - 至今", status: "进行中", title: "深度学习", desc: "深入学习神经网络架构、Transformer、大语言模型，探索深度学习在计算机视觉和自然语言处理中的应用。", skills: ["PyTorch", "Transformer", "CNN", "RNN"] },
  { time: "2026.07 - 至今", status: "进行中", title: "信号处理与凸优化", desc: "学习凸优化理论与算法，理解其在滤波器设计、压缩感知、谱估计等信号处理问题中的应用，并同步深入阵列信号处理。", skills: ["凸优化", "信号处理", "阵列处理", "CVX", "MATLAB"] },
];

// 全局搜索索引
export const searchIndex = [
  { title: "一些概念：从挑西瓜说起", file: "content/study/ml/00-yixiegainian.md", category: "ml", section: "半学", date: "2026.01.17" },
  { title: "模型评估与选择", file: "content/study/ml/01-moxingpingguyuxuanze.md", category: "ml", section: "半学", date: "2026.01.17" },
  { title: "线性模型", file: "content/study/ml/02-xianxingmoxing.md", category: "ml", section: "半学", date: "2026.01.18" },
  { title: "决策树", file: "content/study/ml/03-jueceshu.md", category: "ml", section: "半学", date: "2026.01.19" },
  { title: "神经网络", file: "content/study/ml/04-shenjingwangluo.md", category: "ml", section: "半学", date: "2026.01.20" },
  { title: "支持向量机", file: "content/study/ml/05-zhichixiangliangji.md", category: "ml", section: "半学", date: "2026.01.21" },
  { title: "贝叶斯分类器", file: "content/study/ml/06-beiyesifenleiqi.md", category: "ml", section: "半学", date: "2026.01.22" },
  { title: "集成学习", file: "content/study/ml/07-jichengxuexi.md", category: "ml", section: "半学", date: "2026.01.23" },
  { title: "分类器总结", file: "content/study/ml/08-fenleiqi-zongjie.md", category: "ml", section: "半学", date: "2026.01.24" },
  { title: "聚类", file: "content/study/ml/09-julei.md", category: "ml", section: "半学", date: "2026.01.25" },
  { title: "降维与度量学习", file: "content/study/ml/10-jiangweiyuduliangxuexi.md", category: "ml", section: "半学", date: "2026.01.26" },
  { title: "数学建模思想", file: "content/study/modeling/00-shuxuejianmosixiang.md", category: "modeling", section: "半学", date: "2026.01.03" },
  { title: "线性规划", file: "content/study/modeling/01-xianxingguihua.md", category: "modeling", section: "半学", date: "2026.01.05" },
  { title: "整数规划", file: "content/study/modeling/02-zhengshuguihua.md", category: "modeling", section: "半学", date: "2026.01.07" },
  { title: "引言：信号处理与通信中的凸优化", file: "content/study/signal/convex-optimization/00-yinyan.md", category: "convex", section: "半学", date: "2026.07.23" },
  { title: "数学基础", file: "content/study/signal/convex-optimization/01-shuxuejichu.md", category: "convex", section: "半学", date: "2026.07.25" },
  { title: "阵列与空域滤波器", file: "content/study/signal/array-processing/01-zhenlieyukongyu.md", category: "array", section: "半学", date: "2026.07.30" },
  { title: "写在某个夜晚", file: "content/writing/thinking/01-xiezaimougeye.md", category: "thinking", section: "半文", date: "2025.02.09" },
  { title: "没有遗憾", file: "content/writing/thinking/02-meiyouyihan.md", category: "thinking", section: "半文", date: "2025.09.21" },
  { title: "春分", file: "content/writing/thinking/03-chunfen.md", category: "thinking", section: "半文", date: "2026.03.22" },
  { title: "我选择死亡", file: "content/writing/thinking/04-woxuanzesiwang.md", category: "thinking", section: "半文", date: "2026.06.29" },
  { title: "永远生猛的黄金时代", file: "content/writing/reading/01-yongyuanshengmeng.md", category: "reading", section: "半文", date: "2025.04.20" },
  { title: "满江红·游四姑娘山", file: "content/writing/travel/01-manjianghong-siguniangshan.md", category: "travel", section: "半文", date: "2025.10.03" },
  { title: "水调歌头·剑门", file: "content/writing/travel/02-shuidiaogetou-jianmen.md", category: "travel", section: "半文", date: "2025.04.05" },
];

// 首页最近更新数据（按日期倒序，最多保留 5 条）
export const updatesData = [
  { id: "01", title: "新增《阵列处理》系列", desc: "半学栏目新系列：从阵列与空域滤波器出发，覆盖波束成形、阵列流形、窄带近似等核心基础", date: "2026.07.30", action: { type: "navigate", target: "/study" } },
  { id: "02", title: "Markdown 渲染升级 v3.1.0", desc: "手写解析器 → react-markdown + gray-matter + remark-gfm + remark-math，公式更稳、排版更标准", date: "2026.07.25", action: { type: "navigate", target: "/" } },
  { id: "03", title: "新增《信号处理中的凸优化》系列", desc: "半学栏目新系列：从数学基础出发，探索信号处理与通信中的凸优化问题", date: "2026.07.25", action: { type: "navigate", target: "/study" } },
  { id: "04", title: "博客重构 v3.0.0", desc: "静态 HTML 三件套 → React + Vite + Tailwind CSS，组件化与工程化升级", date: "2026.07.22", action: { type: "navigate", target: "/" } },
  { id: "05", title: "新增《我选择死亡》", desc: "半思栏目新诗：我已经失去了春天，夏天的太阳也变得冰冷...", date: "2026.06.29", action: { type: "article", file: "content/writing/thinking/04-woxuanzesiwang.md", category: "thinking" } },
];
