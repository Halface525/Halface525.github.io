// ========================================
// 全局配置与数据 — 杂志风格
// ========================================

// Giscus 评论系统配置
const GISCUS_CONFIG = {
    repo: 'Halface525/comments', repoId: 'R_kgDORxheUQ',
    category: 'General', categoryId: 'DIC_kwDORxheUc4C5Vdr',
    mapping: 'title', strict: '0', reactionsEnabled: '1',
    emitMetadata: '0', inputPosition: 'bottom',
    theme: 'preferred_color_scheme', lang: 'zh-CN', enabled: true
};

// 项目数据（半趣栏目）
const projectsData = {
    'project2': {
        title: 'Imperium Civitatum', icon: '', description: '一个关于历史/政治/地理的策略游戏。',
        details: '<p class="mb-4">Imperium Civitatum 是一款探索历史文明与政治体系的策略游戏。</p><h4 class="font-bold mb-2">游戏特色</h4><ul class="list-disc list-inside mb-4 space-y-1"><li>历史文明模拟</li><li>政治体系策略</li><li>地理扩张玩法</li></ul>',
        link: 'https://halface525.github.io/imperium-civitatum', github: '#'
    },
    'project3': {
        title: 'Dozu', icon: '', description: 'Something new is coming.',
        details: '<p class="mb-4">开发中……</p>', link: '#', github: '#'
    }
};

// 技术博客文章数据（半学栏目）
const techArticlesData = [
    { file: 'content/study/ml/10-jiangweiyuduliangxuexi.md', category: 'ml', title: '降维与度量学习', date: '2026-01-26', readTime: '14 min', emoji: '', desc: 'k近邻学习、低维嵌入、主成分分析、核化线性降维、流形学习、度量学习...' },
    { file: 'content/study/ml/09-julei.md', category: 'ml', title: '聚类', date: '2026-01-25', readTime: '12 min', emoji: '', desc: '距离计算、原型聚类、密度聚类、层次聚类，无监督学习核心算法...' },
    { file: 'content/study/ml/08-fenleiqi-zongjie.md', category: 'ml', title: '分类器总结', date: '2026-01-24', readTime: '10 min', emoji: '', desc: '各分类器优缺点对比、适用场景分析、实验对比与选择建议...' },
    { file: 'content/study/ml/07-jichengxuexi.md', category: 'ml', title: '集成学习', date: '2026-01-23', readTime: '14 min', emoji: '', desc: 'Boosting、Bagging、随机森林、结合策略、多样性增强，集成学习全景...' },
    { file: 'content/study/ml/06-beiyesifenleiqi.md', category: 'ml', title: '贝叶斯分类器', date: '2026-01-22', readTime: '12 min', emoji: '', desc: '贝叶斯决策论、极大似然估计、朴素贝叶斯分类器、EM算法...' },
    { file: 'content/study/ml/05-zhichixiangliangji.md', category: 'ml', title: '支持向量机', date: '2026-01-21', readTime: '15 min', emoji: '', desc: '间隔与支持向量、对偶问题、核函数、软间隔与正则化，SVM完整推导...' },
    { file: 'content/study/ml/04-shenjingwangluo.md', category: 'ml', title: '神经网络', date: '2026-01-20', readTime: '15 min', emoji: '', desc: '神经元模型、感知机与多层网络、误差逆传播算法、全局最小与局部最小...' },
    { file: 'content/study/ml/03-jueceshu.md', category: 'ml', title: '决策树', date: '2026-01-19', readTime: '12 min', emoji: '', desc: '信息增益、增益率、基尼指数，ID3、C4.5、CART算法原理与实现...' },
    { file: 'content/study/ml/02-xianxingmoxing.md', category: 'ml', title: '线性模型', date: '2026-01-18', readTime: '12 min', emoji: '', desc: '线性回归、对数几率回归、线性判别分析，从基础到应用的完整解析...' },
    { file: 'content/study/ml/01-moxingpingguyuxuanze.md', category: 'ml', title: '模型评估与选择', date: '2026-01-26', readTime: '15 min', emoji: '', desc: '经验误差与过拟合、评估方法、性能度量、比较检验，模型选择的基础工具箱...' },
    { file: 'content/study/ml/00-yixiegainian.md', category: 'ml', title: '一些概念：从挑西瓜说起', date: '2026-01-17', readTime: '10 min', emoji: '', desc: '像人一样学习的机器，通过"挑西瓜"案例解析机器学习基础术语与核心思想...' },
    { file: 'content/study/modeling/01-xianxingguihua.md', category: 'modeling', title: '线性规划', date: '2026-01-05', readTime: '12 min', emoji: '', desc: '线性规划模型建立、单纯形法原理、灵敏度分析、实际应用案例...' },
    { file: 'content/study/modeling/00-shuxuejianmosixiang.md', category: 'modeling', title: '数学建模思想', date: '2026-01-03', readTime: '15 min', emoji: '', desc: '蒙特卡洛法、动态规划、图论模型，数学建模中的四大经典思想解析...' },
    { file: 'content/study/modeling/02-zhengshuguihua.md', category: 'modeling', title: '整数规划', date: '2026-01-07', readTime: '13 min', emoji: '', desc: '整数规划模型、分支定界法、0-1整数规划、指派问题与旅行商问题...' }
];

// 半文文章数据（写作栏目）
const writingArticlesData = [
    { file: 'content/writing/thinking/03-chunfen.md', category: 'thinking', title: '春分', date: '2026-03-22', readTime: '5 min', emoji: '', desc: '有时候乌云占着天空，落下几粒雨水。有时候雨水打湿头发，混了汗或者泪...' },
    { file: 'content/writing/travel/01-manjianghong-siguniangshan.md', category: 'travel', title: '满江红·游四姑娘山', date: '2025-10-03', readTime: '3 min', emoji: '', desc: '万里川西，云翻处、雪山巍峨。清秋至、长空如镜，草色生波...' },
    { file: 'content/writing/thinking/02-meiyouyihan.md', category: 'thinking', title: '没有遗憾', date: '2025-09-21', readTime: '6 min', emoji: '', desc: '成都今天的天气很好，没有下雨。我不是一个矫情的人...' },
    { file: 'content/writing/reading/01-yongyuanshengmeng.md', category: 'reading', title: '永远生猛的黄金时代', date: '2025-04-20', readTime: '15 min', emoji: '', desc: '那一天我二十一岁，在我一生的黄金时代，我有好多奢望。我想爱，想吃...' },
    { file: 'content/writing/travel/02-shuidiaogetou-jianmen.md', category: 'travel', title: '水调歌头·剑门', date: '2025-04-05', readTime: '3 min', emoji: '', desc: '踏裂苍苔去，振袂叩剑门。千峰列阵如卒，云海荡胸宽...' },
    { file: 'content/writing/thinking/01-xiezaimougeye.md', category: 'thinking', title: '写在某个夜晚', date: '2025-02-09', readTime: '5 min', emoji: '', desc: '人在吃饱喝足之后会思考人生的意义，在迷茫仿徨时会想起文字...' }
];

// 学习路径时间线数据
const learningTimeline = [
    { time: '2024.09 - 2025.02', status: '已完成', title: '编程入门', desc: '从零开始学习编程，掌握 Python 基础语法、数据结构和算法，完成多个练手项目。', skills: ['Python', '数据结构', '算法', 'Git'] },
    { time: '2025.02 - 2025.10', status: '已完成', title: '数学建模', desc: '学习线性代数、概率统计、优化理论，参加数学建模竞赛，将数学应用于实际问题求解。', skills: ['MATLAB', '线性代数', '概率统计', '优化算法'] },
    { time: '2025.10 - 2026.01', status: '已完成', title: '机器学习基础', desc: '系统学习监督学习、无监督学习、强化学习基础算法，掌握 Scikit-learn 和基础神经网络。', skills: ['Python', 'Scikit-learn', '回归/分类', '聚类'] },
    { time: '2026.01 - 至今', status: '进行中', title: '深度学习', desc: '深入学习神经网络架构、Transformer、大语言模型，探索深度学习在计算机视觉和自然语言处理中的应用。', skills: ['PyTorch', 'Transformer', 'CNN', 'RNN'] }
];

// 全局搜索索引
const searchIndex = [
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
    { title: '数学建模思想', file: 'content/study/modeling/00-shuxuejianmosixiang.md', category: 'modeling', section: '半学', date: '2026.01.03' },
    { title: '线性规划', file: 'content/study/modeling/01-xianxingguihua.md', category: 'modeling', section: '半学', date: '2026.01.05' },
    { title: '整数规划', file: 'content/study/modeling/02-zhengshuguihua.md', category: 'modeling', section: '半学', date: '2026.01.07' },
    { title: '写在某个夜晚', file: 'content/writing/thinking/01-xiezaimougeye.md', category: 'thinking', section: '半文', date: '2025.02.09' },
    { title: '没有遗憾', file: 'content/writing/thinking/02-meiyouyihan.md', category: 'thinking', section: '半文', date: '2025.09.21' },
    { title: '春分', file: 'content/writing/thinking/03-chunfen.md', category: 'thinking', section: '半文', date: '2026.03.22' },
    { title: '永远生猛的黄金时代', file: 'content/writing/reading/01-yongyuanshengmeng.md', category: 'reading', section: '半文', date: '2025.04.20' },
    { title: '满江红·游四姑娘山', file: 'content/writing/travel/01-manjianghong-siguniangshan.md', category: 'travel', section: '半文', date: '2025.10.03' },
    { title: '水调歌头·剑门', file: 'content/writing/travel/02-shuidiaogetou-jianmen.md', category: 'travel', section: '半文', date: '2025.04.05' }
];
