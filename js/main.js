// 相对时间计算函数
function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 60) return '刚刚';
    if (diffMin < 60) return `${diffMin}分钟前`;
    if (diffHour < 24) return `${diffHour}小时前`;
    if (diffDay < 7) return `${diffDay}天前`;
    if (diffWeek < 4) return `${diffWeek}周前`;
    if (diffMonth < 12) return `${diffMonth}个月前`;
    return `${diffYear}年前`;
}

// 更新所有相对时间
function updateRelativeTimes() {
    document.querySelectorAll('[data-time]').forEach(el => {
        const timeStr = el.getAttribute('data-time');
        if (timeStr) {
            el.textContent = getRelativeTime(timeStr);
        }
    });
}

// 初始化星星背景
function createStars() {
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        starsContainer.appendChild(star);
    }
}

// 更新主题状态显示
function updateThemeStatus() {
    const isDark = document.documentElement.classList.contains('dark');
    const themeStatus = document.getElementById('theme-status');
    if (themeStatus) {
        themeStatus.textContent = isDark ? '当前：暗黑模式' : '当前：亮色模式';
    }
}

// 主题切换功能
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    
    // 保存到本地存储
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    updateThemeStatus();
    
    // 添加切换动画效果
    document.body.style.transform = 'scale(0.98)';
    setTimeout(() => {
        document.body.style.transform = 'scale(1)';
    }, 200);
}

// 页面切换功能
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    setTimeout(() => {
        const targetPage = document.getElementById(pageName);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }, 50);
    
    document.querySelectorAll('.sketch-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const targetBtn = document.getElementById('btn-' + pageName);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
    
    // 根据页面更新标题
    const titles = {
        'home': 'Halface主页',
        'face': '半面 - Halface',
        'study': '半学 - Halface',
        'writing': '半文 - Halface'
    };
    document.title = titles[pageName] || 'Halface主页';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 文章筛选功能
function filterArticles(category) {
    const articles = document.querySelectorAll('#article-list article');
    const buttons = document.querySelectorAll('#writing .sketch-btn');
    
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes(category === 'all' ? '全部' : 
            category === 'tech' ? '技术' : 
            category === 'life' ? '生活' : '思考')) {
            btn.classList.add('active');
        }
    });
    
    articles.forEach(article => {
        if (category === 'all' || article.dataset.category === category) {
            article.style.display = 'block';
            setTimeout(() => {
                article.style.opacity = '1';
                article.style.transform = 'translateY(0)';
            }, 50);
        } else {
            article.style.opacity = '0';
            article.style.transform = 'translateY(20px)';
            setTimeout(() => {
                article.style.display = 'none';
            }, 300);
        }
    });
}

// 初始化卡片旋转效果
function initCards() {
    document.querySelectorAll('.sketch-card').forEach((card) => {
        const randomRotate = (Math.random() - 0.5) * 4;
        card.style.transform = `rotate(${randomRotate}deg)`;
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'rotate(0deg) translateY(-5px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotate(${randomRotate}deg)`;
        });
    });
}

// 鼠标轨迹效果
function initMouseTrail() {
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.9) {
            const dot = document.createElement('div');
            const isDark = document.documentElement.classList.contains('dark');
            dot.style.position = 'fixed';
            dot.style.left = e.clientX + 'px';
            dot.style.top = e.clientY + 'px';
            dot.style.width = '8px';
            dot.style.height = '8px';
            dot.style.background = isDark ? 'rgba(255, 133, 133, 0.4)' : 'rgba(255, 107, 107, 0.3)';
            dot.style.borderRadius = '50%';
            dot.style.pointerEvents = 'none';
            dot.style.zIndex = '9999';
            dot.style.transition = 'all 1s ease-out';
            document.body.appendChild(dot);
            
            setTimeout(() => {
                dot.style.transform = 'scale(0)';
                dot.style.opacity = '0';
            }, 10);
            
            setTimeout(() => {
                dot.remove();
            }, 1000);
        }
    });
}

// 监听系统主题变化
function initThemeListener() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            updateThemeStatus();
        }
    });
}

// 文章数据
const articlesData = {
    'handwritten-design': {
        title: '手绘风格的设计哲学',
        date: '2024.03.20',
        category: '技术',
        readTime: '5 分钟',
        file: 'content/posts/handwritten-design.md'
    },
    'coffee-inspiration': {
        title: '周末的咖啡馆与灵感',
        date: '2024.03.18',
        category: '生活',
        readTime: '3 分钟',
        file: 'content/posts/coffee-inspiration.md'
    },
    'imperfection-manifesto': {
        title: '不完美主义宣言',
        date: '2024.03.15',
        category: '思考',
        readTime: '8 分钟',
        file: 'content/posts/imperfection-manifesto.md'
    }
};

// 简单的 Markdown 解析器
function parseMarkdown(md) {
    // 移除 YAML 前置数据（如果有）
    md = md.replace(/^---[\s\S]*?---/, '');
    
    // 转换标题
    md = md.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-8 mb-4">$1</h3>');
    md = md.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-10 mb-6 sketch-underline">$1</h2>');
    md = md.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mb-8">$1</h1>');
    
    // 转换粗体和斜体
    md = md.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    md = md.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    md = md.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 转换引用
    md = md.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-400 pl-4 my-6 italic opacity-80">$1</blockquote>');
    
    // 转换代码块
    md = md.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-6"><code>$2</code></pre>');
    
    // 转换行内代码
    md = md.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">$1</code>');
    
    // 转换列表
    md = md.replace(/^\d+\.\s+(.*$)/gim, '<li class="ml-6 mb-2">$1</li>');
    md = md.replace(/^- (.*$)/gim, '<li class="ml-6 mb-2 list-disc">$1</li>');
    
    // 转换链接
    md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:underline">$1</a>');
    
    // 转换水平线
    md = md.replace(/^---$/gim, '<hr class="my-8 border-t-2 border-gray-300">');
    
    // 转换段落（需要在其他转换之后）
    md = md.replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">');
    
    // 包装整个内容
    md = '<p class="mb-4 leading-relaxed">' + md + '</p>';
    
    // 清理多余的空段落
    md = md.replace(/<p class="mb-4 leading-relaxed"><\/p>/g, '');
    md = md.replace(/<p class="mb-4 leading-relaxed">\s*<\/p>/g, '');
    
    return md;
}

// 显示文章详情
async function showArticle(articleId) {
    const article = articlesData[articleId];
    if (!article) return;
    
    try {
        // 获取 Markdown 文件内容
        const response = await fetch(article.file);
        if (!response.ok) throw new Error('Failed to load article');
        const mdContent = await response.text();
        
        // 解析 Markdown
        const htmlContent = parseMarkdown(mdContent);
        
        // 构建文章头部信息
        const headerHtml = `
            <div class="mb-8 pb-8 border-b-2 border-gray-200">
                <div class="flex flex-wrap gap-4 mb-4 text-sm opacity-60">
                    <span>📅 ${article.date}</span>
                    <span>🏷️ ${article.category}</span>
                    <span>⏱️ ${article.readTime}</span>
                </div>
            </div>
        `;
        
        // 更新文章内容
        const contentContainer = document.getElementById('article-content');
        contentContainer.innerHTML = headerHtml + htmlContent;
        
        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // 显示文章详情页
        setTimeout(() => {
            document.getElementById('article-detail').classList.add('active');
        }, 50);
        
        // 更新标题
        document.title = `${article.title} - 半文 - Halface`;
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error loading article:', error);
        alert('文章加载失败，请稍后重试');
    }
}

// 返回文章列表
function backToArticles() {
    // 隐藏文章详情页
    document.getElementById('article-detail').classList.remove('active');
    
    // 显示半文页面
    setTimeout(() => {
        document.getElementById('writing').classList.add('active');
    }, 50);
    
    // 更新标题
    document.title = '半文 - Halface';
    
    // 更新导航按钮状态
    document.querySelectorAll('.sketch-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('btn-writing').classList.add('active');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 创建星星背景
    createStars();
    
    // 检查本地存储的主题设置
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        updateThemeStatus();
    }
    
    // 初始化卡片效果
    initCards();
    
    // 初始化鼠标轨迹
    initMouseTrail();
    
    // 初始化主题监听
    initThemeListener();
    
    // 初始化相对时间显示
    updateRelativeTimes();
    // 每分钟更新一次时间
    setInterval(updateRelativeTimes, 60000);
});
