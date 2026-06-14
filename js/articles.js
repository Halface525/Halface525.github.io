// ========================================
// 文章加载 & 筛选
// ========================================

// 渲染技术博客文章卡片（半学）
function renderTechArticles(filter) {
    const container = document.getElementById('tech-article-list');
    if (!container) return;

    const articles = filter === 'all'
        ? techArticlesData
        : techArticlesData.filter(a => a.category === filter);

    container.innerHTML = articles.map(a => `
        <article class="sketch-border overflow-hidden group cursor-pointer" data-category="${a.category}" onclick="showArticleFromFile('${a.file}', '${a.category}')">
            <div class="h-40 bg-gradient-to-br ${a.gradient} relative overflow-hidden transition-colors duration-500">
                <div class="absolute inset-0 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500">${a.emoji}</div>
                <div class="absolute top-3 right-3 sketch-tag text-xs">${getCategoryLabel(a.category)}</div>
            </div>
            <div class="p-5">
                <h4 class="text-lg font-bold mb-2 group-hover:text-${a.colorKey}-600 dark:group-hover:text-${a.colorKey}-400 transition-colors">${a.title}</h4>
                <p class="text-sm mb-3 line-clamp-2" style="color: var(--ink-color); opacity: 0.7;">${a.desc}</p>
                <div class="flex justify-between items-center text-xs opacity-50">
                    <span>${a.date}</span>
                    <span>阅读 ${a.readTime} →</span>
                </div>
            </div>
        </article>
    `).join('');

    // 更新筛选按钮激活状态
    const filterContainer = document.getElementById('tech-filters');
    if (filterContainer) {
        filterContainer.querySelectorAll('.sketch-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
    }
}

// 渲染半文文章卡片
function renderWritingArticles(filter) {
    const container = document.getElementById('article-list');
    if (!container) return;

    const articles = filter === 'all'
        ? writingArticlesData
        : writingArticlesData.filter(a => a.category === filter);

    container.innerHTML = articles.map(a => `
        <article class="sketch-border overflow-hidden group cursor-pointer" data-category="${a.category}" onclick="showArticleFromFile('${a.file}', '${a.category}')">
            <div class="h-48 bg-gradient-to-br ${a.gradient} relative overflow-hidden transition-colors duration-500">
                <div class="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">${a.emoji}</div>
                <div class="absolute top-4 right-4 sketch-tag">${getCategoryLabel(a.category)}</div>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold mb-3 group-hover:text-${a.colorKey}-600 dark:group-hover:text-${a.colorKey}-400 transition-colors">${a.title}</h3>
                <p class="mb-4 line-clamp-2" style="color: var(--ink-color); opacity: 0.7;">${a.desc}</p>
                <div class="flex justify-between items-center text-sm opacity-50">
                    <span>${a.date}</span>
                    <span>阅读 ${a.readTime} →</span>
                </div>
            </div>
        </article>
    `).join('');

    // 更新筛选按钮激活状态
    const filterContainer = document.getElementById('article-filters');
    if (filterContainer) {
        filterContainer.querySelectorAll('.sketch-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
    }
}

// 半文板块文章筛选（触发重新渲染）
function filterArticles(category) {
    renderWritingArticles(category);
}

// 技术博客文章筛选（触发重新渲染）
function filterTechArticles(category) {
    renderTechArticles(category);
}

// 显示文章详情（通用）
async function showArticle(articleId, filePath, sectionName, cardTitle) {
    try {
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
        const fullUrl = baseUrl + filePath;
        console.log('Full URL:', fullUrl);

        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error('Failed to load article (status: ' + response.status + ')');
        const mdContent = await response.text();

        const { metadata, html } = parseMarkdown(mdContent);

        const displayTitle = cardTitle || metadata.title || articleId;

        // 文章头部
        let headerHtml = '<div class="mb-8 pb-8 border-b-2 border-gray-200">';
        headerHtml += `<h1 class="text-3xl md:text-4xl font-bold mb-6 text-center" style="font-family: 'ZCOOL KuaiLe', cursive;">${displayTitle}</h1>`;

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

        // 触发 MathJax 渲染
        if (window.MathJax) {
            MathJax.typesetPromise([contentContainer]).catch((err) => {
                console.error('MathJax rendering error:', err);
            });
        }

        // 显示文章详情页
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        setTimeout(() => {
            document.getElementById('article-detail').classList.add('active');
            initComments();
        }, 50);

        const title = displayTitle;
        document.title = `${title} - ${sectionName} - Halface`;

        history.pushState({ page: 'article', section: sectionName, filePath: filePath }, title, `#article-${encodeURIComponent(articleId)}`);

        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Error loading article:', error);
        console.error('File path:', filePath);
        alert('文章加载失败: ' + error.message + '\n路径: ' + filePath);
    }
}

// 从文件路径显示文章
async function showArticleFromFile(filePath, category) {
    let sectionName = '半文';
    if (filePath.includes('/study/') || filePath.includes('\\study\\')) {
        sectionName = '半学';
    }

    // 从数据数组中查找文章标题
    let cardTitle = '';
    const allArticles = [...techArticlesData, ...writingArticlesData];
    const found = allArticles.find(a => a.file === filePath);
    if (found) {
        cardTitle = found.title;
    }

    await showArticle(filePath, filePath, sectionName, cardTitle);
}

// 返回文章列表
function backToArticles() {
    document.getElementById('article-detail').classList.remove('active');

    const currentTitle = document.title;
    let targetPage = 'writing';
    let targetBtn = 'btn-writing';
    let pageTitle = '半文';

    if (currentTitle.includes('半学') || currentTitle.includes('机器学习') || currentTitle.includes('数学建模')) {
        targetPage = 'study';
        targetBtn = 'btn-study';
        pageTitle = '半学';
    }

    setTimeout(() => {
        document.getElementById(targetPage).classList.add('active');
    }, 50);

    document.title = `${pageTitle} - Halface`;

    document.querySelectorAll('.sketch-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(targetBtn).classList.add('active');
}

// ========================================
// 动态渲染（在页面加载时调用）
// ========================================

// 渲染学习路径时间线
function renderLearningTimeline() {
    const container = document.getElementById('learning-timeline');
    if (!container) return;

    container.innerHTML = learningTimeline.map((item, index) => `
        <div class="relative pl-16 ${index < learningTimeline.length - 1 ? 'pb-8' : ''} group">
            <div class="absolute left-3 top-1 w-6 h-6 ${item.dotColor} rounded-full border-4 border-white dark:border-gray-800 group-hover:scale-125 transition-transform"></div>
            <div class="sketch-border p-5 hover:shadow-lg transition-all">
                <div class="flex items-center gap-2 mb-2">
                    <span class="text-sm font-bold ${item.timeColor}">${item.time}</span>
                    <span class="sketch-tag text-xs ${item.statusClass}">${item.status}</span>
                </div>
                <h4 class="font-bold text-lg mb-2">${item.title}</h4>
                <p class="text-sm mb-3" style="color: var(--ink-color); opacity: 0.7;">${item.desc}</p>
                <div class="flex flex-wrap gap-2">
                    ${item.skills.map(s => '<span class="text-xs sketch-tag">' + s + '</span>').join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// 初始化所有动态渲染的内容
function initArticlesDisplay() {
    renderTechArticles('all');
    renderWritingArticles('all');
    renderLearningTimeline();
}
