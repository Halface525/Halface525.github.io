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
    const filterContainer = document.getElementById('article-filters');
    if (!filterContainer) return;
    
    const buttons = filterContainer.querySelectorAll('.sketch-btn');
    
    buttons.forEach(btn => {
        const filterValue = btn.dataset.filter;
        if (filterValue === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
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

// 解析 YAML Front Matter
function parseYAMLFrontMatter(md) {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const match = md.match(frontMatterRegex);
    
    if (!match) {
        return { metadata: {}, content: md };
    }
    
    const yamlText = match[1];
    const content = md.slice(match[0].length);
    
    // 简单的 YAML 解析
    const metadata = {};
    const lines = yamlText.split('\n');
    let currentKey = null;
    let currentList = null;
    
    for (const line of lines) {
        const trimmed = line.trim();
        
        // 列表项
        if (trimmed.startsWith('- ')) {
            if (currentList) {
                currentList.push(trimmed.slice(2).trim());
            }
            continue;
        }
        
        // 键值对
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex > 0) {
            const key = trimmed.slice(0, colonIndex).trim();
            let value = trimmed.slice(colonIndex + 1).trim();
            
            // 如果值是空的，可能是列表的开始
            if (value === '') {
                currentList = [];
                metadata[key] = currentList;
            } else {
                // 移除引号
                if ((value.startsWith('"') && value.endsWith('"')) || 
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                metadata[key] = value;
                currentList = null;
            }
            currentKey = key;
        }
    }
    
    return { metadata, content };
}

// 改进的 Markdown 解析器
function parseMarkdown(md) {
    const { metadata, content } = parseYAMLFrontMatter(md);
    
    let html = content;
    
    // 转换标题（日记风格的日期标题特殊处理）
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3 opacity-80">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 sketch-underline">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6">$1</h1>');
    
    // 转换粗体和斜体
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 转换引用
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-400 pl-4 my-6 italic opacity-80 text-lg">$1</blockquote>');
    
    // 转换代码块
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-6"><code>$2</code></pre>');
    
    // 转换行内代码
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">$1</code>');
    
    // 保留数学公式标记，让 MathJax 处理
    // 块级公式 $$...$$ 和 \[...\] 保持原样
    // 行内公式 $...$ 和 \(...\) 保持原样
    
    // 转换列表
    html = html.replace(/^\d+\.\s+(.*$)/gim, '<li class="ml-6 mb-2">$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li class="ml-6 mb-2 list-disc">$1</li>');
    
    // 转换链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:underline">$1</a>');
    
    // 转换表格
    html = html.replace(/\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g, function(match, header, rows) {
        const headers = header.split('|').map(h => h.trim()).filter(h => h);
        const rowData = rows.trim().split('\n').map(row => {
            return row.split('|').map(cell => cell.trim()).filter(cell => cell);
        });
        
        let tableHtml = '<table class="w-full border-collapse my-6">';
        tableHtml += '<thead><tr>';
        headers.forEach(h => {
            tableHtml += `<th class="border-2 border-gray-300 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-bold">${h}</th>`;
        });
        tableHtml += '</tr></thead><tbody>';
        
        rowData.forEach(row => {
            tableHtml += '<tr>';
            row.forEach(cell => {
                tableHtml += `<td class="border-2 border-gray-300 px-4 py-2">${cell}</td>`;
            });
            tableHtml += '</tr>';
        });
        tableHtml += '</tbody></table>';
        return tableHtml;
    });
    
    // 转换水平线
    html = html.replace(/^---$/gim, '<div class="my-8 flex items-center gap-4"><div class="flex-1 h-px bg-gray-300"></div><span class="text-gray-400">✦</span><div class="flex-1 h-px bg-gray-300"></div></div>');
    
    // 转换段落（需要在其他转换之后）
    html = html.replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">');
    
    // 包装整个内容
    html = '<p class="mb-4 leading-relaxed">' + html + '</p>';
    
    // 清理多余的空段落
    html = html.replace(/<p class="mb-4 leading-relaxed"><\/p>/g, '');
    html = html.replace(/<p class="mb-4 leading-relaxed">\s*<\/p>/g, '');
    
    return { metadata, html };
}

// 显示文章详情（支持 YAML Front Matter）
async function showArticle(articleId, filePath, sectionName = '半文', cardTitle = '') {
    try {
        // 获取 Markdown 文件内容
        // 构建完整 URL（处理相对路径）
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
        // 使用字符串拼接而不是 URL 构造函数，避免自动编码
        const fullUrl = baseUrl + filePath;
        console.log('Full URL:', fullUrl);
        
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error('Failed to load article (status: ' + response.status + ')');
        const mdContent = await response.text();
        
        // 解析 Markdown（包含 YAML Front Matter）
        const { metadata, html } = parseMarkdown(mdContent);
        
        // 优先使用卡片标题，其次使用 metadata 中的标题
        const displayTitle = cardTitle || metadata.title || articleId;
        
        // 构建文章头部信息
        let headerHtml = '<div class="mb-8 pb-8 border-b-2 border-gray-200">';
        
        // 显示文章标题（使用卡片上的标题，字体与卡片一致）
        headerHtml += `<h1 class="text-3xl md:text-4xl font-bold mb-6 text-center" style="font-family: 'ZCOOL KuaiLe', cursive;">${displayTitle}</h1>`;
        
        // 如果有元数据，显示它
        if (metadata.data) {
            headerHtml += `<div class="flex flex-wrap gap-4 justify-center text-sm opacity-60">`;
            headerHtml += `<span>📅 ${metadata.data}</span>`;
            
            if (metadata.auther) {
                headerHtml += `<span>✍️ ${metadata.auther}</span>`;
            }
            
            if (metadata.tags && Array.isArray(metadata.tags)) {
                headerHtml += `<span>🏷️ ${metadata.tags.join(' · ')}</span>`;
            }
            
            if (metadata.lastdate && metadata.lastdate !== metadata.data) {
                headerHtml += `<span>📝 更新于 ${metadata.lastdate}</span>`;
            }
            
            headerHtml += `</div>`;
        }
        
        headerHtml += '</div>';
        
        // 更新文章内容
        const contentContainer = document.getElementById('article-content');
        contentContainer.innerHTML = headerHtml + html;
        
        // 触发 MathJax 渲染公式
        if (window.MathJax) {
            MathJax.typesetPromise([contentContainer]).catch((err) => {
                console.error('MathJax rendering error:', err);
            });
        }
        
        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // 显示文章详情页
        setTimeout(() => {
            document.getElementById('article-detail').classList.add('active');
            // 文章加载后初始化评论系统
            initComments();
        }, 50);
        
        // 更新标题
        const title = displayTitle;
        document.title = `${title} - ${sectionName} - Halface`;
        
        // 添加浏览器历史记录，使返回键可用
        history.pushState({ page: 'article', section: sectionName, filePath: filePath }, title, `#article-${encodeURIComponent(articleId)}`);
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error loading article:', error);
        console.error('File path:', filePath);
        alert('文章加载失败: ' + error.message + '\n路径: ' + filePath);
    }
}

// 从文件路径显示文章（用于新格式的文章）
async function showArticleFromFile(filePath, category) {
    // 根据文件路径判断所属板块
    let sectionName = '半文';
    if (filePath.includes('/study/') || filePath.includes('\\study\\')) {
        sectionName = '半学';
    }
    
    // 通过文件路径查找对应的卡片标题（支持 h3 和 h4 标题）
    let cardTitle = '';
    const articles = document.querySelectorAll('article[data-category]');
    for (const article of articles) {
        const onclickAttr = article.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(filePath)) {
            // 先尝试查找 h4，如果没有则查找 h3
            const titleElement = article.querySelector('h4') || article.querySelector('h3');
            if (titleElement) {
                cardTitle = titleElement.textContent.trim();
                break;
            }
        }
    }
    
    await showArticle(filePath, filePath, sectionName, cardTitle);
}

// 返回文章列表（根据来源页面返回对应板块）
function backToArticles() {
    // 隐藏文章详情页
    document.getElementById('article-detail').classList.remove('active');
    
    // 根据当前标题判断返回哪个页面
    const currentTitle = document.title;
    let targetPage = 'writing';
    let targetBtn = 'btn-writing';
    let pageTitle = '半文';
    
    if (currentTitle.includes('半学') || currentTitle.includes('机器学习') || currentTitle.includes('数学建模')) {
        targetPage = 'study';
        targetBtn = 'btn-study';
        pageTitle = '半学';
    }
    
    // 显示对应页面
    setTimeout(() => {
        document.getElementById(targetPage).classList.add('active');
    }, 50);
    
    // 更新标题
    document.title = `${pageTitle} - Halface`;
    
    // 更新导航按钮状态
    document.querySelectorAll('.sketch-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(targetBtn).classList.add('active');
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
    
    // 初始化订阅表单
    initSubscribeForm();
    
    // 初始化评论系统（Disqus 或自定义）
    initComments();
    
    // 监听浏览器返回键
    window.addEventListener('popstate', (event) => {
        // 如果当前在文章详情页，返回到文章列表
        if (document.getElementById('article-detail').classList.contains('active')) {
            backToArticles();
        }
    });
    
    // 初始化鼠标跟随倾斜效果
    initTiltEffect();
});

// 订阅表单处理
function initSubscribeForm() {
    const form = document.getElementById('subscribe-form');
    const message = document.getElementById('subscribe-message');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('subscribe-email').value;
            
            // 获取已有的订阅列表
            let subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
            
            // 检查是否已订阅
            if (subscribers.includes(email)) {
                message.textContent = '该邮箱已订阅过了！';
                message.className = 'mt-4 text-sm relative z-10 text-yellow-600';
            } else {
                // 添加新订阅
                subscribers.push(email);
                localStorage.setItem('subscribers', JSON.stringify(subscribers));
                
                message.textContent = '订阅成功！感谢你的关注 ✨';
                message.className = 'mt-4 text-sm relative z-10 text-green-600';
                
                // 清空输入框
                document.getElementById('subscribe-email').value = '';
            }
            
            message.classList.remove('hidden');
            
            // 3秒后隐藏消息
            setTimeout(() => {
                message.classList.add('hidden');
            }, 3000);
        });
    }
}

// ========================================
// Giscus 评论系统配置
// ========================================
// 使用方法：
// 1. 在 GitHub 仓库启用 Discussions
// 2. 安装 Giscus App: https://github.com/apps/giscus
// 3. 访问 https://giscus.app 获取配置参数
// 4. 替换下方的配置信息
// 5. 将 GISCUS_CONFIG.enabled 改为 true

const GISCUS_CONFIG = {
    repo: 'Halface525/comments',                    // 仓库地址
    repoId: 'R_kgDORxheUQ',                        // 从 giscus.app 获取
    category: 'General',                            // 讨论分类名称
    categoryId: 'DIC_kwDORxheUc4C5Vdr',            // 从 giscus.app 获取
    mapping: 'title',                               // 映射方式: title (使用文章标题区分)
    strict: '0',
    reactionsEnabled: '1',                          // 启用表情反应
    emitMetadata: '0',
    inputPosition: 'bottom',                        // 输入框位置: top, bottom
    theme: 'preferred_color_scheme',               // 主题跟随网站
    lang: 'zh-CN',                                 // 语言
    enabled: true                                  // 启用 Giscus
};

// 存储当前 Giscus 会话的 term，用于检测是否需要重新加载
let currentGiscusTerm = '';

function loadGiscus() {
    if (!GISCUS_CONFIG.enabled) return;
    
    const giscusContainer = document.getElementById('disqus_thread');
    const commentsSection = document.getElementById('comments-section');
    
    if (!giscusContainer) return;
    
    // 隐藏自定义评论区域
    if (commentsSection) {
        commentsSection.style.display = 'none';
    }
    
    // 获取当前页面的唯一标识（使用完整 URL）
    const currentUrl = window.location.href;
    
    // 如果已经加载过且 URL 没有变化，不需要重新加载
    if (giscusContainer.querySelector('.giscus') && currentGiscusTerm === currentUrl) {
        return;
    }
    
    // 清除旧的 Giscus 实例
    giscusContainer.innerHTML = '';
    currentGiscusTerm = currentUrl;
    
    // 创建 Giscus 容器
    const giscusDiv = document.createElement('div');
    giscusDiv.className = 'giscus';
    giscusContainer.appendChild(giscusDiv);
    
    // 创建 Giscus 脚本
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', GISCUS_CONFIG.repo);
    script.setAttribute('data-repo-id', GISCUS_CONFIG.repoId);
    script.setAttribute('data-category', GISCUS_CONFIG.category);
    script.setAttribute('data-category-id', GISCUS_CONFIG.categoryId);
    script.setAttribute('data-mapping', GISCUS_CONFIG.mapping);
    script.setAttribute('data-strict', GISCUS_CONFIG.strict);
    script.setAttribute('data-reactions-enabled', GISCUS_CONFIG.reactionsEnabled);
    script.setAttribute('data-emit-metadata', GISCUS_CONFIG.emitMetadata);
    script.setAttribute('data-input-position', GISCUS_CONFIG.inputPosition);
    script.setAttribute('data-theme', GISCUS_CONFIG.theme);
    script.setAttribute('data-lang', GISCUS_CONFIG.lang);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    
    giscusDiv.appendChild(script);
    console.log('Giscus loaded for:', currentUrl);
}

// 评论功能初始化
function initComments() {
    if (GISCUS_CONFIG.enabled) {
        loadGiscus();
    } else {
        console.log('Giscus 未启用，使用自定义评论 UI');
    }
}

// 提交评论（自定义模式）
function submitComment() {
    const name = document.getElementById('comment-name')?.value;
    const email = document.getElementById('comment-email')?.value;
    const content = document.getElementById('comment-content')?.value;
    
    if (!name || !email || !content) {
        alert('请填写完整信息');
        return;
    }
    
    if (GISCUS_CONFIG.enabled) {
        alert('已启用 Giscus 评论系统，请使用上方的评论框');
    } else {
        alert('评论功能正在开发中，敬请期待！🎉\n\n配置 Giscus 后即可使用。\n\n步骤：\n1. GitHub 仓库启用 Discussions\n2. 安装 Giscus App\n3. 访问 giscus.app 获取 repo-id 和 category-id\n4. 在 main.js 中配置 GISCUS_CONFIG');
    }
}

// 技术博客文章筛选
function filterTechArticles(category) {
    const articles = document.querySelectorAll('#tech-article-list article');
    const filterContainer = document.getElementById('tech-filters');
    if (!filterContainer) return;
    
    const buttons = filterContainer.querySelectorAll('.sketch-btn');
    
    // 更新按钮状态
    buttons.forEach(btn => {
        const filterValue = btn.dataset.filter;
        if (filterValue === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 筛选文章
    articles.forEach(article => {
        if (category === 'all' || article.dataset.category === category) {
            article.style.display = 'block';
            setTimeout(() => {
                article.style.opacity = '1';
                article.style.transform = 'translateY(0)';
            }, 50);
        } else {
            article.style.opacity = '0';
            article.style.transform = 'translateY(10px)';
            setTimeout(() => {
                article.style.display = 'none';
            }, 300);
        }
    });
}

// 获取分类标签
function getCategoryLabel(category) {
    const labels = {
        'all': '全部',
        'frontend': '前端',
        'backend': '后端',
        'ai': 'AI'
    };
    return labels[category] || '全部';
}

// 显示技术博客文章详情
function showTechArticle(articleId) {
    // 暂时显示提示，后续可以添加详细文章页面
    const messages = {
        'react-hooks-guide': 'React Hooks 文章详情页面即将上线！',
        'css-performance': 'CSS 性能优化文章详情页面即将上线！',
        'nodejs-microservices': 'Node.js 微服务文章详情页面即将上线！',
        'llm-fine-tuning': '大模型微调文章详情页面即将上线！'
    };
    alert(messages[articleId] || '文章详情即将上线！');
}

// 鼠标跟随倾斜效果 - 鼠标放在哪边哪边就低
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('.sketch-border');
    
    tiltElements.forEach(element => {
        // 跳过音乐播放器及其子元素
        if (element.id === 'music-player' || element.closest('#music-player')) {
            return;
        }
        
        // 跳过播放器内部的按钮和卡片
        if (element.classList.contains('music-control-btn') || 
            element.classList.contains('music-play-btn') ||
            element.classList.contains('music-mode-btn') ||
            element.classList.contains('music-item') ||
            element.closest('.music-controls') ||
            element.closest('.music-playlist')) {
            return;
        }
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const mouseX = e.clientX;
            
            // 计算鼠标相对于元素中心的位置 (-1 到 1)
            const percentX = (mouseX - centerX) / (rect.width / 2);
            
            // 鼠标在左边时左边低(正旋转)，在右边时右边低(负旋转)
            // 最大旋转角度为 3 度
            const rotation = percentX * 3;
            
            element.style.transform = `rotate(${rotation}deg)`;
        });
        
        element.addEventListener('mouseleave', () => {
            // 鼠标离开时恢复原状
            element.style.transform = '';
        });
    });
}

// ========================================
// 全局搜索功能
// ========================================

// 文章索引数据（用于搜索）
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

// 切换搜索弹窗显示/隐藏
function toggleSearch() {
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('search-input');
    
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        input.focus();
    } else {
        modal.classList.add('hidden');
        input.value = '';
        document.getElementById('search-results').innerHTML = '';
        document.getElementById('search-hint').style.display = 'block';
    }
}

// 执行搜索
function performSearch(keyword) {
    const resultsContainer = document.getElementById('search-results');
    const hint = document.getElementById('search-hint');
    
    if (!keyword.trim()) {
        resultsContainer.innerHTML = '';
        hint.style.display = 'block';
        return;
    }
    
    hint.style.display = 'none';
    
    const lowerKeyword = keyword.toLowerCase();
    const results = searchIndex.filter(item => 
        item.title.toLowerCase().includes(lowerKeyword)
    );
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="text-center py-8">
                <div class="text-4xl mb-2">🔍</div>
                <p class="opacity-50">未找到相关内容</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = results.map(item => `
        <div class="sketch-border p-4 cursor-pointer hover:shadow-lg transition-all" onclick="openSearchResult('${item.file}', '${item.section}')">
            <div class="flex items-center justify-between mb-2">
                <h4 class="font-bold text-lg">${item.title}</h4>
                <span class="sketch-tag text-xs">${item.section}</span>
            </div>
            <div class="flex items-center gap-2 text-sm opacity-50">
                <span>${item.date}</span>
                <span>·</span>
                <span>${getCategoryLabel(item.category)}</span>
            </div>
        </div>
    `).join('');
}

// 打开搜索结果
function openSearchResult(filePath, sectionName) {
    toggleSearch();
    // 根据文件路径判断分类
    let category = 'thinking';
    if (sectionName === '半学') {
        if (filePath.includes('/ml/')) {
            category = 'ml';
        } else if (filePath.includes('/modeling/')) {
            category = 'modeling';
        }
    } else {
        // 半文板块
        if (filePath.includes('/thinking/')) {
            category = 'thinking';
        } else if (filePath.includes('/reading/')) {
            category = 'reading';
        } else if (filePath.includes('/travel/')) {
            category = 'travel';
        }
    }
    showArticleFromFile(filePath, category);
}

// 获取分类标签
function getCategoryLabel(category) {
    const labels = {
        'ml': '机器学习',
        'modeling': '数学建模',
        'thinking': '半思',
        'reading': '半读',
        'travel': '半游'
    };
    return labels[category] || category;
}

// 键盘快捷键：ESC 关闭搜索，/ 打开搜索
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('search-modal');
    
    // ESC 关闭搜索
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        toggleSearch();
    }
    
    // / 打开搜索（不在输入框时）
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        toggleSearch();
    }
});
