// ========================================
// 全局配置与数据
// ========================================

// Giscus 评论系统配置
// 使用方法：
// 1. 在 GitHub 仓库启用 Discussions
// 2. 安装 Giscus App: https://github.com/apps/giscus
// 3. 访问 https://giscus.app 获取配置参数
// 4. 替换下方的配置信息
// 5. 将 enabled 改为 true
const GISCUS_CONFIG = {
    repo: 'Halface525/comments',
    repoId: 'R_kgDORxheUQ',
    category: 'General',
    categoryId: 'DIC_kwDORxheUc4C5Vdr',
    mapping: 'title',
    strict: '0',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'bottom',
    theme: 'preferred_color_scheme',
    lang: 'zh-CN',
    enabled: true
};

// 项目数据（半趣栏目）
const projectsData = {
    'project1': {
        title: '半面记账',
        icon: '💰',
        description: '个人财务记账系统，帮助管理日常收支。',
        details: `
            <p class="mb-4">一个简洁实用的个人财务管理工具，支持收入支出记录、数据可视化分析。</p>
            <h4 class="font-bold mb-2">主要功能</h4>
            <ul class="list-disc list-inside mb-4 space-y-1">
                <li>收支记录管理</li>
                <li>月度财务报表</li>
                <li>数据可视化图表</li>
                <li>趋势分析</li>
            </ul>
            <h4 class="font-bold mb-2">技术栈</h4>
            <p>React, Tailwind CSS, Vercel</p>
        `,
        link: 'https://finance-app-one-silk.vercel.app/',
        github: '#'
    },
    'project2': {
        title: 'Imperium Civitatum',
        icon: '🎮',
        description: '一个关于历史/政治/地理的策略游戏。',
        details: `
            <p class="mb-4">Imperium Civitatum 是一款探索历史文明与政治体系的策略游戏。</p>
            <h4 class="font-bold mb-2">游戏特色</h4>
            <ul class="list-disc list-inside mb-4 space-y-1">
                <li>历史文明模拟</li>
                <li>政治体系策略</li>
                <li>地理扩张玩法</li>
                <li>交互式决策</li>
            </ul>
        `,
        link: 'https://halface525.github.io/imperium-civitatum',
        github: '#'
    },
    'project3': {
        title: '项目名称 3',
        icon: '📱',
        description: '移动端应用开发项目。',
        details: `
            <p class="mb-4">这是一个移动应用项目...</p>
            <h4 class="font-bold mb-2">应用特色</h4>
            <ul class="list-disc list-inside mb-4 space-y-1">
                <li>跨平台支持</li>
                <li>流畅的用户体验</li>
                <li>精美的界面设计</li>
            </ul>
        `,
        link: '#',
        github: '#'
    }
};

// 全局搜索索引
const searchIndex = [
    // 机器学习文章
    { title: '一些概念：从挑西瓜说起', file: 'content/study/ml/00-yixiegainian.md', category: 'ml', section: '半学', date: '2026.01.17' },
    { title: '模型评估与选择', file: 'content/study/ml/01-moxingpingguyuxuanze.md', category: 'ml', section: '半学', date: '2026.01.17' },
    { title: '线性模型', file: 'content/study/ml/02-xianxingmoxing.md', category: 'ml', section: '半学', date: '2026.01.18' },
    { title: '决策树', file: 'content/study/ml/03-jueceshu.md', category: 'ml', section: '半学', date: '2026.01.19' },
    { title: '神经网络', file: 'content/study/ml/04-shenjingwangluo.md', category: 'ml', section: '半学', date: '2026.01.20' },
    { title: '支持向量机', file: 'content/study/ml/05-zhichixiangliangji.md', category: 'ml', section: '半学', date: '2026.01.21' },
    { title: '贝叶斯分类器', file: 'content/study/ml/06-beiyesifenleiqi.md', category: 'ml', section: '半学', date: '2026.01.22' },
    { title: '集成学习', file: 'content/study/ml/07-jichengxuexi.md', category: 'ml', section: '半学', date: '2026.01.23' },
    { title: '分类器总结', file: 'content/study/ml/08-fenleiqi-zongjie.md', category: 'ml', section: '半学', date: '2026.01.24' },
    { title: '聚类', file: 'content/study/ml/09-julei.md', category: 'ml', section: '半学', date: '2026.01.25' },
    { title: '降维与度量学习', file: 'content/study/ml/10-jiangweiyuduliangxuexi.md', category: 'ml', section: '半学', date: '2026.01.26' },
    // 数学建模文章
    { title: '数学建模思想', file: 'content/study/modeling/00-shuxuejianmosixiang.md', category: 'modeling', section: '半学', date: '2026.01.03' },
    { title: '线性规划', file: 'content/study/modeling/01-xianxingguihua.md', category: 'modeling', section: '半学', date: '2026.01.05' },
    { title: '整数规划', file: 'content/study/modeling/02-zhengshuguihua.md', category: 'modeling', section: '半学', date: '2026.01.07' },
    // 半思文章
    { title: '写在某个夜晚', file: 'content/writing/thinking/01-xiezaimougeye.md', category: 'thinking', section: '半文', date: '2025.02.09' },
    { title: '没有遗憾', file: 'content/writing/thinking/02-meiyouyihan.md', category: 'thinking', section: '半文', date: '2024.03.15' },
    { title: '春分', file: 'content/writing/thinking/03-chunfen.md', category: 'thinking', section: '半文', date: '2024.03.16' },
    // 半读文章
    { title: '永远生猛的黄金时代', file: 'content/writing/reading/01-yongyuanshengmeng.md', category: 'reading', section: '半文', date: '2024.03.20' },
    // 半游文章
    { title: '满江红·游四姑娘山', file: 'content/writing/travel/01-manjianghong-siguniangshan.md', category: 'travel', section: '半文', date: '2025.08.15' },
    { title: '水调歌头·剑门', file: 'content/writing/travel/02-shuidiaogetou-jianmen.md', category: 'travel', section: '半文', date: '2025.08.16' }
];
