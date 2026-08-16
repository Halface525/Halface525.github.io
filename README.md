# Halface 个人主页

> 记录生活的半面，探索知识的半学，书写心灵的半文。

一个杂志排版风格的个人博客网站，记录生活、学习与思考。

🔗 **在线访问**: https://halface525.github.io

---

## 📁 项目结构

```
web/
├── index.html              # React 开发入口 HTML（构建后也是部署主页面）
├── index.dev.html          # 开发专用入口（npm run dev 时自动恢复）
├── build-deploy.ps1        # 一键部署脚本（构建 + 同步到根目录）
├── package.json            # 项目依赖与脚本
├── vite.config.js          # Vite 配置
├── eslint.config.js        # ESLint 配置
├── src/                    # React 源码
│   ├── App.jsx             # 路由配置（HashRouter）
│   ├── main.jsx            # React 挂载入口
│   ├── index.css           # Tailwind 主题 + 杂志风格样式
│   ├── components/         # 复用组件
│   ├── pages/              # 页面组件
│   ├── hooks/              # 自定义 React Hooks
│   ├── data/               # 站点数据、文章索引、播放列表
│   └── utils/              # 工具函数、Markdown 解析器
├── public/                 # 静态资源（构建时原样复制到 dist/）
│   ├── audio/             # 音乐文件（15首 MP3）
│   ├── content/           # Markdown 文章内容
│   │   ├── study/        # 学习笔记
│   │   │   ├── ml/                  # 机器学习系列（11篇）
│   │   │   ├── modeling/            # 数学建模系列（3篇）
│   │   │   └── signal/              # 信号处理
│   │   │       ├── convex-optimization/  # 凸优化系列（1篇，持续更新）
│   │   │       └── array-processing/     # 阵列处理系列（6篇，持续更新）
│   │   └── writing/     # 随笔文章
│   │       ├── thinking/# 半思（5篇）
│   │       ├── reading/ # 半读（1篇）
│   │       ├── travel/  # 半游（2篇）
│   │       └── movie/   # 半影（预留）
│   ├── images/            # 图片资源
│   │   ├── avatar.png     # 头像
│   │   └── wechat-qr.jpg  # 公众号二维码
│   └── pic/               # 文章插图（阵列处理等）
├── assets/                 # React 构建产物（JS/CSS/字体等）
├── pic/                    # 部署后的文章插图（GitHub Pages 读取）
├── legacy/                 # 原静态站点备份（HTML/CSS/JS 三件套）
└── dist/                   # Vite 构建输出目录（.gitignore 忽略）
```

> **说明**：根目录的 `index.html` 和 `assets/` 是 `npm run build` 后的构建产物，已替代原来的静态 HTML/CSS/JS 三件套。原静态站点备份在 `legacy/` 目录中。源码入口是 `src/main.jsx`，静态资源放在 `public/`。开发时使用 `npm run dev`（自动恢复 `index.dev.html` 为开发入口），部署时使用 `npm run build:deploy`（构建产物同步到根目录）。

---

## 🛠 技术栈

- **框架**: React 19
- **构建工具**: Vite 6
- **样式**: Tailwind CSS 4
- **路由**: React Router 7（HashRouter）
- **图标**: Font Awesome 6.5
- **字体**: Playfair Display + Noto Serif SC + Inter
- **数学公式**: MathJax 3
- **音频播放**: Howler.js
- **评论系统**: Giscus
- **部署**: GitHub Pages

---

## 🎨 网站特色

### 杂志排版设计

- Playfair Display + Noto Serif SC 衬线字体，精致排版
- 深红色 (#c41e3a) 强调色，1px 细线边框
- 首字下沉 (drop-cap)、编号列表、细分隔线
- 聚光灯透镜互动效果（鼠标跟随反色圆形）
- 响应式杂志卡片，悬停浮起 + 阴影

### 暗黑/亮色双主题

- 一键切换，支持跟随系统主题
- CSS 变量驱动，所有组件无缝适配
- 暗黑模式保留同等质感

### 四大核心板块

| 板块           | 内容                 | 数量     |
| -------------- | -------------------- | -------- |
| **半面** | 个人介绍、关于我     | -        |
| **半学** | 技术博客、学习路径   | 22篇文章 |
| **半文** | 随笔、读书笔记、游记 | 7篇文章  |
| **半趣** | 项目展示、兴趣爱好   | 3个项目  |

---

## ⚡ 技术特性

- **单页应用 (SPA)**：无刷新页面切换，带有平滑动画
- **Markdown 渲染**：支持 YAML Front Matter、表格、LaTeX 数学公式
- **MathJax 集成**：专业数学公式渲染
- **响应式设计**：完美适配移动端和桌面端
- **本地存储**：主题偏好、音乐音量/播放模式本地保存
- **Giscus 评论系统**：基于 GitHub Discussions 的评论系统
- **全局搜索**：`/` 快捷键唤起，支持文章标题搜索
- **音乐播放器**：支持播放列表、循环模式、进度拖拽、音量控制

---

## 🚀 快速开始

### 安装依赖

```powershell
npm install
```

### 开发预览

```powershell
npm run dev
```

默认访问 `http://localhost:5173/`，修改代码后支持热更新（HMR）。

### 生产构建

```powershell
npm run build
```

构建产物输出到 `dist/` 目录。

### 一键构建并部署（推荐）

```powershell
npm run build:deploy
```

该命令依次完成：恢复开发入口 → `npm run build` 生成 `dist/` → 将 `dist/` 中的 `index.html`、`assets/`、`content/`、`audio/`、`images/`、`pic/`、`vite.svg` 同步到仓库根目录。

### 手动同步（等价操作）

```powershell
npm run build
Copy-Item dist/index.html index.html -Force
Copy-Item dist/assets . -Recurse -Force
Copy-Item dist/audio/* audio/ -Recurse -Force
Copy-Item dist/content/* content/ -Recurse -Force
Copy-Item dist/images/* images/ -Recurse -Force
New-Item -ItemType Directory -Force -Path pic | Out-Null
Copy-Item dist/pic/* pic/ -Recurse -Force
Copy-Item dist/vite.svg vite.svg -Force
```

> 说明：`public/` 中的静态资源会在构建时自动复制到 `dist/`，再同步到根目录用于部署。

### 预览生产构建

```powershell
npm run preview
```

默认访问 `http://localhost:4173/`。

---

## 📦 部署到 GitHub Pages

根目录的 `index.html` 和 `assets/` 已经是构建产物，直接部署仓库根目录即可。

### 手动部署

1. 执行 `npm run build`
2. 将 `dist/` 内容同步到 `web/` 根目录
3. 提交并推送到 GitHub
4. 进入仓库 **Settings** → **Pages**
5. Source 选择 `main` 分支，`/(root)` 目录
6. 访问 `https://yourusername.github.io/repo-name`

### 自动部署（GitHub Actions）

在仓库根目录添加 `.github/workflows/deploy.yml`，配置 Vite 构建并将 `dist/` 自动部署到 GitHub Pages。

### 访问地址

```
https://yourusername.github.io/repo-name
```

---

## 📝 文章管理

### 文章命名规范

文件名格式：`序号-拼音.md`

示例：

```
00-yixiegainian.md              # 机器学习 - 一些概念
01-moxingpingguyuxuanze.md      # 模型评估与选择
01-xiezaimougeye.md             # 写在某个夜晚
04-woxuanzesiwang.md            # 我选择死亡
```

### 文章 Front Matter

```yaml
---
data: 2026-01-17
tags:
  - 机器学习
  - 西瓜书
lastdate: 2026-01-17
auther: 作者名
---
```

### 添加新文章步骤

1. 将 Markdown 文件放入 `public/content/` 下对应分类目录
2. 在 `src/data/techArticles.js` 或 `writingArticles.js` 中添加文章元数据
3. 在 `src/data/siteData.js` 的 `searchIndex` 中添加搜索索引
4. 重新运行 `npm run dev` 或 `npm run build`

---

## 🔧 高级配置

### Giscus 评论系统

Giscus 评论系统已配置完成，使用独立的 `comments` 仓库存储评论数据。

**配置信息**（已内置在 `src/data/siteData.js`）：

```javascript
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
```

**如需自定义评论仓库：**

1. 在 GitHub 新建仓库并启用 Discussions
2. 安装 [Giscus App](https://github.com/apps/giscus)
3. 访问 [giscus.app](https://giscus.app/zh-CN) 获取配置
4. 修改 `src/data/siteData.js` 中的 `GISCUS_CONFIG`

---

## 📌 版本更新日志

### v3.3.0 (2026-08-05)

- **新增彩蛋页**：拟物化展示半学/半文/半趣内容，收音机播放器与时钟画框

---

### v3.2.0 (2026-08-03)

#### 📚 内容更新

- **阵列处理系列更新至 6 篇**：在《阵列与空域滤波器》《线性阵列与孔径的合成》基础上新增 4 篇——《平面阵列与孔径》（矩形/圆阵/圆孔径/六边形/共形阵列）、《空时过程的特性》（快拍模型、频率-波数谱、信号/噪声子空间、AR/ARMA 参数化模型）、《最优波形估计》（SINR 准则、MVDR/MMSE/MPDR、GSC 与宽带波束形成）、《自适应波束形成器》（SMI/RLS/LMS、对角加载、QRD、特征空间与波束空间处理）

#### ✨ 体验优化

- **自定义光标**：桌面端全局光标改为圆环 + 中心点样式，悬停可点击元素时平滑收缩，颜色跟随明暗主题，与封面聚光灯透镜平滑衔接
- **移动端聚光灯**：封面反色透镜在触屏设备上自动漫游游动，触摸时跟手滑动，适配移动端浏览
- **首页随机文章**：主按钮由"浏览文章"改为"随机文章"，点击随机跳转一篇

#### 🛠 修复与优化

- **诗歌换行修复**：引入 `remark-breaks` 插件，段落内单换行自动转为 `<br>`，半思/半文诗歌的逐行排版恢复正常
- **部署脚本完善**：`build-deploy.ps1` 新增 `pic/` 图片目录同步，一键部署覆盖所有静态资源

---

### v3.1.0 (2026-07-25)

#### 🚀 Markdown 渲染升级

- **迁移到 remark 生态**：将手写 Markdown + YAML 解析器替换为 `react-markdown + gray-matter + remark-gfm + remark-math`
- **更可靠的公式渲染**：块级/行内 LaTeX 通过 `remark-math` 解析为独立节点，MathJax 排版时机更稳定
- **GFM 扩展支持**：原生支持表格、删除线、任务列表、自动链接等 GitHub Flavored Markdown
- **移除 DOMPurify 依赖**：`react-markdown` 默认转义 HTML，降低 XSS 风险并减少依赖
- **手写解析器下线**：彻底解决此前标题层级、列表包裹、块引用合并等边界 bug

#### 📚 内容更新

- **新增半学栏目系列**：信号处理中的凸优化（持续更新）

---

### v3.0.0 (2026-07-22)

#### 🚀 技术重构

- **React + Vite + Tailwind CSS 重构**：将原单 HTML 站点重构为现代前端工程化项目，源码位于仓库根目录，构建产物替代原静态站点
- **构建工具迁移到 Vite 6**：利用原生 ESM 实现秒级冷启动与热更新（HMR），生产构建产物位于 `dist/` 并同步到仓库根目录部署
- **样式系统升级到 Tailwind CSS 4**：通过 `@theme` 与 CSS 变量定义杂志风格设计令牌（paper / ink / accent / gold / muted / line）
- **React Router 7 HashRouter**：实现无刷新 SPA 路由，路径包括 `/`, `/face`, `/study`, `/writing`, `/fun`, `/article/*`

#### 🧩 组件化拆分

将原 `index.html` 中的内联逻辑拆分为独立 React 组件：

- **Layout**：全局布局，集成 Navbar、Footer、SearchModal、MusicPlayer
- **Navbar**：粘性导航栏，响应式菜单，主题/搜索/音乐入口
- **HomePage**：杂志封面、聚光灯反色效果、本期精选、最近更新
- **FacePage**：关于我、头像、个人标签
- **StudyPage / WritingPage**：文章列表、分类筛选、学习路径时间线
- **FunPage**：项目展示与项目详情弹窗
- **ArticlePage**：Markdown 文章渲染、MathJax 公式、Giscus 评论
- **ArticleCard / ProjectCard**：杂志风格卡片
- **SearchModal**：全局搜索弹窗，`/` 快捷键唤起，ESC 关闭
- **MusicPlayer**：基于 Howler.js 的音乐播放器，支持列表/单曲/随机模式
- **GiscusComments**：基于 GitHub Discussions 的评论系统

#### ⚛️ Hooks 抽象

- **useTheme**：主题状态管理，支持 localStorage 记忆与系统主题监听
- **useSearch**：搜索状态、`/` 快捷键、结果过滤
- **useMusicPlayer**：Howler 音频实例、播放控制、进度、音量、播放模式
- **useArticle**：异步加载并解析 Markdown 文章
- **useDocumentTitle**：动态修改页面标题

#### 🛡 安全与体验

- **DOMPurify 消毒**：文章 HTML 渲染前进行安全消毒，降低 XSS 风险
- **歌词与数学公式**：保留 MathJax 3 支持，公式渲染后自动触发 `typesetPromise`
- **本地存储增强**：主题、音乐音量、播放模式均持久化到 localStorage

#### 📦 数据与内容管理

- `src/data/siteData.js`：Giscus 配置、搜索索引、学习路径、最近更新、项目数据
- `src/data/techArticles.js`：半学文章元数据
- `src/data/writingArticles.js`：半文文章元数据
- `src/data/musicPlaylist.js`：音乐播放列表
- `public/content/`：Markdown 文章静态资源

---

### v2.0.0 (2026-06-16)

#### 🎨 重大变更

- **杂志排版风格**：手绘风格全面替换为杂志排版设计
- **字体系统**：Playfair Display（标题）+ Noto Serif SC（正文）+ Inter（UI）
- **色彩重构**：深红 (#c41e3a) 强调色，1px 细线边框，精致阴影
- **聚光灯互动**：封面页鼠标跟随反色透镜效果
- **首字下沉**：文章段落 drop-cap 装饰

#### 🔧 项目重构

- **模块化拆分**：内联 CSS/JS 提取为独立文件（CSS 440行 → `magazine.css`，JS 550行 → `config.js` + `markdown.js` + `magazine.js`）
- **HTML 瘦身**：index.html 从 1343 行精简到 345 行（减少 74%）
- **代码质量**：数据、解析、逻辑三层分离，单文件职责清晰

#### 📐 排版细节

- 导航栏下划线跟随动画
- 杂志卡片悬停浮起效果（cubic-bezier 缓动）
- 学习路径时间线垂直布局
- 文章正文精细化排版（h1-h3、blockquote、code、table）
- 分隔线装饰（细线 + 菱形符号）

---

### v1.3.0 (2026-05-17)

#### ✨ 新增功能

- **半趣栏目**：新增项目展示栏目，展示个人项目和兴趣作品
- **项目卡片**：支持项目详情弹窗，包含介绍、技术栈和外部链接

#### 📚 内容更新

- 添加项目：半面记账（个人财务系统）
- 添加项目：Imperium Civitatum（历史策略游戏）

---

### v1.2.1 (2026-04-05)

#### ✨ 新增功能

- **扩充音乐库**：新增 12 首歌曲，播放列表共 15 首
- **音频文件整理**：统一重命名为拼音格式，便于管理

---

### v1.2.0 (2026-04-05)

#### ✨ 新增功能

- **背景音乐播放器**：新增音乐播放器，支持播放列表、循环模式、音量控制
- **导航栏集成**：音乐按钮嵌入导航栏，与搜索、主题切换按钮风格统一
- **自动播放**：页面加载后自动播放音乐
- **静音切换**：点击音量图标快速静音/恢复

#### 🎨 样式改进

- 导航栏新增圆形图标按钮（搜索、音乐）
- 播放器采用手绘风格边框
- 播放器固定在导航栏下方，z-index 优化避免遮挡

#### 📚 内容更新

- 添加 3 首背景音乐

---

### v1.1.0 (2026-03-26)

#### ✨ 新增功能

- **Giscus 评论系统**：接入基于 GitHub Discussions 的评论系统，支持 GitHub 账号登录
- **手绘风格评论框**：为 Giscus 添加手绘风格边框和悬停动画，与网站整体风格统一
- **评论数据独立存储**：使用独立的 `comments` 仓库存储评论，与博客仓库分离

#### 🎨 样式改进

- Giscus 评论框添加手绘不规则圆角边框
- 悬停时边框形状变化动画
- 暗黑/亮色主题自动适配
- 移动端响应式优化

---

### v1.0.0 (2026-03-25)

#### 🐛 问题修复

- **修复 GitHub Pages 文章加载问题**：修正了文件路径解析逻辑，确保在 GitHub Pages 上能正确加载 Markdown 文章
- **文件命名规范化**：将所有中文文件名改为数字序号-拼音格式，解决中文路径导致的加载失败问题

#### ✨ 新增功能

- **Giscus 评论系统预留接口**：在每篇文章底部添加评论区域 UI，预留 Giscus 评论系统配置接口
- **Formspree 订阅表单**：将本地订阅功能替换为 Formspree 表单，支持真正的邮件订阅
- **移动端适配优化**：评论输入框和卡片样式响应式优化，提升移动端浏览体验
- **最新动态展示**：首页新增「最近更新」板块，展示网站最新动态

#### 🎨 界面改进

- 评论区域移动端响应式布局优化
- 文章卡片间距和内边距自适应
- 订阅表单按钮移动端全宽显示

#### 📚 内容更新

- 机器学习系列：11篇文章
- 数学建模系列：3篇文章
- 半思系列：3篇文章
- 半读系列：1篇文章
- 半游系列：2篇文章

---

## 🔮 未来计划

- [X] 文章搜索功能 ✓ (v1.1.0 已完成)
- [X] 背景音乐播放器 ✓ (v1.2.0 已完成)
- [X] 项目展示栏目 ✓ (v1.3.0 已完成)
- [X] React 工程化重构 ✓ (v3.0.0 已完成)
- [ ] 标签/分类筛选
- [ ] RSS 订阅
- [ ] 文章阅读量统计
- [ ] 深色/浅色主题独立配色
- [ ] 文章目录导航
- [ ] 歌词显示功能
- [ ] 音乐播放记忆（记住上次播放位置）

---

## 📜 许可证

MIT License

---

## 👤 关于作者

**Halface**

- 电子科技大学大三学生
- 主修电子信息工程 + 电子商务
- AI 使用者 / 写作者 / 终身学习者

联系方式：panqihao525@163.com

---

*Made with ❤️ and ☕*
*Last updated: 2026-08-05*
