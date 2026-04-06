# Halface 个人主页

> 用不完美的线条，描绘完美的生活

一个手绘风格的个人博客网站，记录生活、学习与思考。

🔗 **在线访问**: https://halface525.github.io

---

## 📁 项目结构

```
web/
├── index.html              # 主页面（单页应用）
├── css/
│   └── style.css          # 手绘风格样式
├── js/
│   └── main.js            # 交互逻辑
├── images/                # 图片资源
│   ├── avatar.png         # 头像
│   └── wechat-qr.jpg      # 微信公众号二维码
└── content/               # Markdown 文章内容
    ├── study/             # 学习笔记
    │   ├── ml/           # 机器学习系列（11篇）
    │   └── modeling/     # 数学建模系列（3篇）
    └── writing/          # 随笔文章
        ├── thinking/     # 半思（3篇）
        ├── reading/      # 半读（1篇）
        └── travel/       # 半游（2篇）
```

---

## 🎨 网站特色

### 手绘风格设计

- 不规则圆角边框，模拟手绘效果
- 手写体中文字体（ZCOOL KuaiLe、Ma Shan Zheng）
- 点状网格背景
- 涂鸦装饰与浮动动画

### 暗黑/亮色双主题

- 一键切换，支持跟随系统主题
- 暗黑模式带有星空闪烁背景
- 所有颜色使用 CSS 变量，切换流畅

### 三大核心板块

| 板块           | 内容                 | 数量     |
| -------------- | -------------------- | -------- |
| **半面** | 个人介绍、关于我     | -        |
| **半学** | 技术博客、学习路径   | 14篇文章 |
| **半文** | 随笔、读书笔记、游记 | 8篇文章  |

---

## ⚡ 技术特性

- **单页应用 (SPA)**：无刷新页面切换，带有平滑动画
- **Markdown 渲染**：支持 YAML Front Matter、表格、LaTeX 数学公式
- **MathJax 集成**：专业数学公式渲染
- **响应式设计**：完美适配移动端和桌面端
- **本地存储**：主题偏好、订阅邮箱本地保存
- **Giscus 评论系统**：基于 GitHub Discussions 的评论系统，支持手绘风格定制

---

## 🚀 快速开始

### 本地预览

直接用浏览器打开 `index.html` 即可预览。

### 部署到 GitHub Pages

1. Fork 或 Clone 本仓库
2. 进入仓库 **Settings** → **Pages**
3. Source 选择 `main` 分支，`/(root)` 目录
4. 访问 `https://yourusername.github.io/repo-name`

---

## 📝 文章管理

### 文章命名规范

文件名格式：`序号-拼音.md`

示例：

```
00-yixiegainian.md      # 机器学习 - 一些概念
01-moxingpingguyuxuanze.md  # 模型评估与选择
01-xianzaimougeye.md    # 写在某个夜晚
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

---

## 🔧 高级配置

### Giscus 评论系统

Giscus 评论系统已配置完成，使用独立的 `comments` 仓库存储评论数据。

**配置信息**（已内置在 `js/main.js`）：

```javascript
const GISCUS_CONFIG = {
    repo: 'Halface525/comments',
    repoId: 'R_kgDORxheUQ',
    category: 'General',
    categoryId: 'DIC_kwDORxheUc4C5Vdr',
    mapping: 'pathname',
    theme: 'preferred_color_scheme',
    lang: 'zh-CN',
    enabled: true
};
```

**如需自定义评论仓库：**

1. 在 GitHub 新建仓库并启用 Discussions
2. 安装 [Giscus App](https://github.com/apps/giscus)
3. 访问 [giscus.app](https://giscus.app/zh-CN) 获取配置
4. 修改 `js/main.js` 中的 `GISCUS_CONFIG`

### 订阅功能 (Formspree)

1. 注册 [Formspree](https://formspree.io)
2. 创建表单，获取 Form ID
3. 修改 `index.html` 中的表单 action：

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

---

## 📌 版本更新日志

### v1.2.1 (2026-04-05)

#### ✨ 新增功能

- **扩充音乐库**：新增 12 首歌曲，播放列表共 15 首
- **音频文件整理**：统一重命名为拼音格式，便于管理

---

## v1.2.0 (2026-04-05)

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

- 电子科技大学大二学生
- 主修电子信息工程 + 电子商务
- AI 使用者 / 写作者 / 终身学习者

联系方式：panqihao525@163.com

---

*Made with ❤️ and ☕*
*Last updated: 2026-03-29*
