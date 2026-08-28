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
  project4: {
    title: "SkillNexus",
    icon: "",
    description: "统一管理多 Agent 技能库的跨平台桌面工具：一套技能库，接入所有 Agent。",
    details:
      '<p class="mb-4">统一管理 AI 编码 Agent（Claude Code、Codex、Gemini CLI、DeepSeek Harness、Cursor、Cline……）技能库的跨平台桌面工具。一个 <code>~/.agents/skills</code> 目录作为权威源，通过 junction / symlink 映射到各 Agent 的技能目录。</p><h4 class="font-bold mb-2">功能特性</h4><ul class="list-disc list-inside mb-4 space-y-1"><li>统一技能库：一处管理，多处生效</li><li>一键同步：自动为 junction 类 Agent 创建链接</li><li>扫描检测：检测本机 Agent 及技能目录同步状态</li><li>SKILL.md 渲染：详情面板完整渲染 Markdown</li><li>亮 / 暗 / 跟随系统三种主题，中英双语</li></ul>',
    link: "#",
    github: "https://github.com/Halface525/skill-nexus",
  },
};

export const projectsList = [
  { id: "project2", ...projectsData.project2 },
  { id: "project3", ...projectsData.project3 },
  { id: "project4", ...projectsData.project4 },
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
  { title: "线性模型", file: "content/study/ml/01-xianxingmoxing.md", category: "ml", section: "半学", date: "2026.01.18" },
  { title: "决策树", file: "content/study/ml/02-jueceshu.md", category: "ml", section: "半学", date: "2026.01.19" },
  { title: "神经网络", file: "content/study/ml/03-shenjingwangluo.md", category: "ml", section: "半学", date: "2026.01.20" },
  { title: "支持向量机", file: "content/study/ml/04-zhichixiangliangji.md", category: "ml", section: "半学", date: "2026.01.21" },
  { title: "贝叶斯分类器", file: "content/study/ml/05-beiyesifenleiqi.md", category: "ml", section: "半学", date: "2026.01.22" },
  { title: "集成学习", file: "content/study/ml/06-jichengxuexi.md", category: "ml", section: "半学", date: "2026.01.23" },
  { title: "分类器总结", file: "content/study/ml/07-fenleiqi-zongjie.md", category: "ml", section: "半学", date: "2026.01.24" },
  { title: "聚类", file: "content/study/ml/08-julei.md", category: "ml", section: "半学", date: "2026.01.25" },
  { title: "模型评估与选择", file: "content/study/ml/09-moxingpingguyuxuanze.md", category: "ml", section: "半学", date: "2026.01.26" },
  { title: "降维与度量学习", file: "content/study/ml/10-jiangweiyuduliangxuexi.md", category: "ml", section: "半学", date: "2026.01.26" },
  { title: "数学建模思想", file: "content/study/modeling/00-shuxuejianmosixiang.md", category: "modeling", section: "半学", date: "2026.01.03" },
  { title: "线性规划", file: "content/study/modeling/01-xianxingguihua.md", category: "modeling", section: "半学", date: "2026.01.05" },
  { title: "整数规划", file: "content/study/modeling/02-zhengshuguihua.md", category: "modeling", section: "半学", date: "2026.01.07" },
  { title: "引言：信号处理与通信中的凸优化", file: "content/study/signal/convex-optimization/00-yinyan.md", category: "convex", section: "半学", date: "2026.07.23" },
  { title: "数学基础", file: "content/study/signal/convex-optimization/01-shuxuejichu.md", category: "convex", section: "半学", date: "2026.07.25" },
  { title: "阵列与空域滤波器", file: "content/study/signal/array-processing/01-zhenlieyukongyu.md", category: "array", section: "半学", date: "2026.07.30" },
  { title: "线性阵列与孔径的合成", file: "content/study/signal/array-processing/02-hecheng.md", category: "array", section: "半学", date: "2026.08.02" },
  { title: "平面阵列与孔径", file: "content/study/signal/array-processing/03-pingmianzhenlieyukongjing.md", category: "array", section: "半学", date: "2026.08.03" },
  { title: "空时过程的特性", file: "content/study/signal/array-processing/04-kongshiguochengdetexing.md", category: "array", section: "半学", date: "2026.08.03" },
  { title: "最优波形估计", file: "content/study/signal/array-processing/05-zuiyouboxingguji.md", category: "array", section: "半学", date: "2026.08.03" },
  { title: "自适应波束形成器", file: "content/study/signal/array-processing/06-zishiyingboshuxingchengqi.md", category: "array", section: "半学", date: "2026.08.03" },
  { title: "参数估计（I）：最大似然估计", file: "content/study/signal/array-processing/07-canliangguji.md", category: "array", section: "半学", date: "2026.08.17" },
  { title: "参数估计（II）：实用算法", file: "content/study/signal/array-processing/08-shiyongsuanfa.md", category: "array", section: "半学", date: "2026.08.28" },
  { title: "写在某个夜晚", file: "content/writing/thinking/01-xiezaimougeye.md", category: "thinking", section: "半文", date: "2025.02.09" },
  { title: "没有遗憾", file: "content/writing/thinking/02-meiyouyihan.md", category: "thinking", section: "半文", date: "2025.09.21" },
  { title: "春分", file: "content/writing/thinking/03-chunfen.md", category: "thinking", section: "半文", date: "2026.03.22" },
  { title: "我选择死亡", file: "content/writing/thinking/04-woxuanzesiwang.md", category: "thinking", section: "半文", date: "2026.06.29" },
  { title: "最后的话260731（一）", file: "content/writing/thinking/05-zuihoudehua-1.md", category: "thinking", section: "半文", date: "2026.07.31" },
  { title: "八月二十七日胡言乱语", file: "content/writing/thinking/06-huyanluanyu.md", category: "thinking", section: "半文", date: "2026.08.27" },
  { title: "永远生猛的黄金时代", file: "content/writing/reading/01-yongyuanshengmeng.md", category: "reading", section: "半文", date: "2025.04.20" },
  { title: "满江红·游四姑娘山", file: "content/writing/travel/01-manjianghong-siguniangshan.md", category: "travel", section: "半文", date: "2025.10.03" },
  { title: "水调歌头·剑门", file: "content/writing/travel/02-shuidiaogetou-jianmen.md", category: "travel", section: "半文", date: "2025.04.05" },
];

// 首页最近更新数据（按日期倒序，最多保留 5 条）
export const updatesData = [
  { id: "01", title: "阵列处理系列更新至 8 篇", desc: "新增《参数估计（II）：实用算法》：Bartlett/MVDR、MUSIC/求根MUSIC、LS 与 TLS-ESPRIT、空间平滑去相干、波束空间与二维 DOA 估计，DOA 估计的实用算法工具箱", date: "2026.08.28", action: { type: "navigate", target: "/study" } },
  { id: "02", title: "新增《八月二十七日胡言乱语》", desc: "半思栏目新文：一场天地颠倒的梦，黑白面具的你与海天一色的红。中元节的雨，最后一次拥抱", date: "2026.08.27", action: { type: "article", file: "content/writing/thinking/06-huyanluanyu.md", category: "thinking" } },
  { id: "03", title: "新增项目 SkillNexus", desc: "半趣栏目新项目：统一管理多 Agent 技能库的跨平台桌面工具（Tauri），一套技能库接入所有 Agent", date: "2026.08.05", action: { type: "navigate", target: "/fun" } },
  { id: "04", title: "新增《最后的话 260731（一）》", desc: "半思栏目新文：一份写给将来的遗书。生活无非是痛苦和美丽…", date: "2026.07.31", action: { type: "article", file: "content/writing/thinking/05-zuihoudehua-1.md", category: "thinking" } },
  { id: "05", title: "Markdown 渲染升级 v3.1.0", desc: "手写解析器 → react-markdown + gray-matter + remark-gfm + remark-math，公式更稳、排版更标准", date: "2026.07.25", action: { type: "navigate", target: "/" } },
];
