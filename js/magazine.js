// ========================================
// 杂志风格 — 应用逻辑
// 依赖: config.js, markdown.js
// ========================================

// ==================== 工具函数 ====================
function getCategoryLabel(category) {
    const labels = { 'ml': '机器学习', 'modeling': '数学建模', 'thinking': '半思', 'reading': '半读', 'travel': '半游' };
    return labels[category] || category;
}

// ==================== 主题 ====================
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const icon = document.getElementById('theme-icon');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    document.querySelector('nav').style.background = isDark ? 'rgba(15,15,15,0.92)' : 'rgba(250,249,247,0.92)';
}

function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
        document.getElementById('theme-icon').className = 'fas fa-sun';
        document.querySelector('nav').style.background = 'rgba(15,15,15,0.92)';
    }
}

// ==================== 页面切换 ====================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById('nav-' + pageId);
    const btnM = document.getElementById('nav-' + pageId + '-m');
    if (btn) btn.classList.add('active');
    if (btnM) btnM.classList.add('active');

    const titles = { home: 'Halface', face: '半面 — Halface', study: '半学 — Halface', writing: '半文 — Halface', fun: '半趣 — Halface' };
    document.title = titles[pageId] || 'Halface';
}

// ==================== 卡片文字截取 ====================
function getCardLabel(title) {
    return /^[一-龥]/.test(title) ? title : title.split(' ')[0];
}

// ==================== 渲染函数 ====================
function renderFeatured() {
    const container = document.getElementById('featured-articles');
    if (!container) return;
    const tech = techArticlesData[0];
    const writing = writingArticlesData[0];
    const projectKey = Object.keys(projectsData)[0];
    const project = projectsData[projectKey];
    const featured = [
        { type: 'article', data: tech, label: getCategoryLabel(tech.category) },
        { type: 'article', data: writing, label: getCategoryLabel(writing.category) },
        { type: 'project', data: project, key: projectKey, label: '项目' }
    ];
    container.innerHTML = featured.map((item, i) => {
        if (item.type === 'article') {
            const a = item.data;
            return `<article class="mag-card cursor-pointer group" onclick="showArticleFromFile('${a.file}', '${a.category}')">
                <div class="aspect-[4/3] flex items-center justify-center text-3xl md:text-4xl font-display font-bold opacity-25 group-hover:opacity-60 transition-opacity" style="background: var(--line); color: var(--ink);">
                    ${getCardLabel(a.title)}
                </div>
                <div class="p-6">
                    <span class="text-xs tracking-wider uppercase block mb-2" style="color: var(--accent); font-family: 'Inter', sans-serif;">${item.label}</span>
                    <h3 class="font-display text-xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">${a.title}</h3>
                    <p class="text-sm mb-4 line-clamp-2" style="color: var(--muted);">${a.desc}</p>
                    <div class="flex justify-between items-center text-xs" style="color: var(--muted); font-family: 'Inter', sans-serif;">
                        <span>${a.date}</span>
                        <span>${a.readTime}</span>
                    </div>
                </div>
            </article>`;
        } else {
            const p = item.data;
            return `<article class="mag-card cursor-pointer group" onclick="showProjectDetail('${item.key}')">
                <div class="aspect-[4/3] flex items-center justify-center text-3xl md:text-4xl font-display font-bold opacity-25 group-hover:opacity-60 transition-opacity" style="background: var(--line); color: var(--ink);">
                    ${getCardLabel(p.title)}
                </div>
                <div class="p-6">
                    <span class="text-xs tracking-wider uppercase block mb-2" style="color: var(--accent); font-family: 'Inter', sans-serif;">${item.label}</span>
                    <h3 class="font-display text-xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">${p.title}</h3>
                    <p class="text-sm mb-4 line-clamp-2" style="color: var(--muted);">${p.description}</p>
                    <div class="flex justify-between items-center text-xs" style="color: var(--muted); font-family: 'Inter', sans-serif;">
                        <span>半趣</span>
                        <span>查看详情 &rarr;</span>
                    </div>
                </div>
            </article>`;
        }
    }).join('');
}

function renderTechArticles(filter) {
    const container = document.getElementById('tech-article-list');
    if (!container) return;
    const articles = filter === 'all' ? techArticlesData : techArticlesData.filter(a => a.category === filter);
    container.innerHTML = articles.map(a => `
        <article class="mag-card cursor-pointer group" onclick="showArticleFromFile('${a.file}', '${a.category}')">
            <div class="p-6">
                <span class="text-xs tracking-wider uppercase block mb-2" style="color: var(--accent); font-family: 'Inter', sans-serif;">${getCategoryLabel(a.category)}</span>
                <h3 class="font-display text-lg font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">${a.title}</h3>
                <p class="text-sm mb-4 line-clamp-2" style="color: var(--muted);">${a.desc}</p>
                <div class="flex justify-between items-center text-xs" style="color: var(--muted); font-family: 'Inter', sans-serif;">
                    <span>${a.date}</span>
                    <span>${a.readTime} &rarr;</span>
                </div>
            </div>
        </article>
    `).join('');
    const filterContainer = document.getElementById('tech-filters');
    if (filterContainer) {
        filterContainer.querySelectorAll('.mag-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
    }
}

function filterTechArticles(category) { renderTechArticles(category); }

function renderWritingArticles(filter) {
    const container = document.getElementById('article-list');
    if (!container) return;
    const articles = filter === 'all' ? writingArticlesData : writingArticlesData.filter(a => a.category === filter);
    container.innerHTML = articles.map(a => `
        <article class="mag-card cursor-pointer group" onclick="showArticleFromFile('${a.file}', '${a.category}')">
            <div class="p-6">
                <span class="text-xs tracking-wider uppercase block mb-2" style="color: var(--accent); font-family: 'Inter', sans-serif;">${getCategoryLabel(a.category)}</span>
                <h3 class="font-display text-lg font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">${a.title}</h3>
                <p class="text-sm mb-4 line-clamp-2" style="color: var(--muted);">${a.desc}</p>
                <div class="flex justify-between items-center text-xs" style="color: var(--muted); font-family: 'Inter', sans-serif;">
                    <span>${a.date}</span>
                    <span>${a.readTime} &rarr;</span>
                </div>
            </div>
        </article>
    `).join('');
    const filterContainer = document.getElementById('article-filters');
    if (filterContainer) {
        filterContainer.querySelectorAll('.mag-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
    }
}

function filterWritingArticles(category) { renderWritingArticles(category); }

function renderLearningTimeline() {
    const container = document.getElementById('learning-timeline');
    if (!container) return;
    container.innerHTML = learningTimeline.map((item, index) => `
        <div class="relative pl-8 ${index < learningTimeline.length - 1 ? 'pb-10' : ''}">
            <div class="timeline-line"></div>
            <div class="timeline-dot"></div>
            <div>
                <div class="flex items-center gap-3 mb-1">
                    <span class="text-sm font-semibold" style="color: var(--ink);">${item.time}</span>
                    <span class="status-tag ${item.status === '进行中' ? 'status-ongoing' : 'status-completed'}">${item.status}</span>
                </div>
                <h4 class="font-display text-lg font-bold mb-1" style="color: var(--ink);">${item.title}</h4>
                <p class="text-sm mb-3" style="color: var(--ink); opacity: 0.7;">${item.desc}</p>
                <div class="flex flex-wrap gap-2">
                    ${item.skills.map(s => `<span class="text-[10px] tracking-wider uppercase px-2 py-0.5" style="border: 1px solid var(--ink); opacity: 0.25; font-family: 'Inter', sans-serif; color: var(--ink); opacity: 0.6;">${s}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function renderProjects() {
    const container = document.getElementById('projects-grid');
    if (!container) return;
    container.innerHTML = Object.entries(projectsData).map(([id, p]) => `
        <div class="mag-card cursor-pointer group" onclick="showProjectDetail('${id}')">
            <div class="aspect-[16/10] flex items-center justify-center text-3xl md:text-4xl font-display font-bold opacity-25 group-hover:opacity-60 transition-opacity" style="background: var(--line); color: var(--ink);">
                ${getCardLabel(p.title)}
            </div>
            <div class="p-6">
                <h3 class="font-display text-lg font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">${p.title}</h3>
                <p class="text-sm" style="color: var(--muted);">${p.description}</p>
            </div>
        </div>
    `).join('');
}

function showProjectDetail(projectId) {
    const p = projectsData[projectId];
    if (!p) return;
    const modal = document.createElement('div');
    modal.id = 'project-modal';
    modal.className = 'fixed inset-0 z-[70] flex items-center justify-center p-4';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.innerHTML = `
        <div class="w-full max-w-lg max-h-[80vh] overflow-y-auto p-8 relative" style="background: var(--paper); border: 1px solid var(--line);">
            <button onclick="document.getElementById('project-modal').remove(); document.body.style.overflow = '';" class="absolute top-4 right-4 opacity-40 hover:opacity-100 transition-opacity"><i class="fas fa-times"></i></button>
            <h2 class="font-display text-2xl font-bold mb-4">${p.title}</h2>
            <p class="mb-4" style="color: var(--muted);">${p.description}</p>
            <div class="mb-6">${p.details}</div>
            <div class="flex gap-3">
                ${p.link !== '#' ? `<a href="${p.link}" target="_blank" class="mag-btn accent">查看项目</a>` : ''}
                ${p.github !== '#' ? `<a href="${p.github}" target="_blank" class="mag-btn">GitHub</a>` : ''}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    modal.addEventListener('click', (e) => { if (e.target === modal) { modal.remove(); document.body.style.overflow = ''; } });
}

// ==================== 文章展示 ====================
async function showArticle(articleId, filePath, sectionName, cardTitle) {
    try {
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
        const response = await fetch(baseUrl + filePath);
        if (!response.ok) throw new Error('Failed to load article (status: ' + response.status + ')');
        const mdContent = await response.text();
        const { metadata, html } = parseMarkdown(mdContent);
        const displayTitle = cardTitle || metadata.title || articleId;

        let headerHtml = '<div class="mb-10 pb-6" style="border-bottom: 1px solid var(--line);">';
        headerHtml += `<h1 class="font-display text-3xl md:text-4xl font-bold mb-6">${displayTitle}</h1>`;
        if (metadata.data) {
            headerHtml += `<div class="flex flex-wrap gap-4 text-sm" style="color: var(--muted); font-family: 'Inter', sans-serif;">`;
            headerHtml += `<span>${metadata.data}</span>`;
            if (metadata.auther) headerHtml += `<span>${metadata.auther}</span>`;
            if (metadata.tags && Array.isArray(metadata.tags)) headerHtml += `<span>${metadata.tags.join(' / ')}</span>`;
            headerHtml += `</div>`;
        }
        headerHtml += '</div>';

        const contentContainer = document.getElementById('article-content');
        contentContainer.innerHTML = headerHtml + html;

        if (window.MathJax) {
            MathJax.typesetPromise([contentContainer]).catch(err => console.error('MathJax error:', err));
        }

        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('article-detail').classList.add('active');
        initComments();
        document.title = `${displayTitle} - ${sectionName} - Halface`;
        history.pushState({ page: 'article', section: sectionName, filePath }, displayTitle, `#article-${encodeURIComponent(articleId)}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Error loading article:', error);
        alert('文章加载失败: ' + error.message);
    }
}

async function showArticleFromFile(filePath, category) {
    let sectionName = '半文';
    if (filePath.includes('/study/') || filePath.includes('\\study\\')) sectionName = '半学';
    const allArticles = [...techArticlesData, ...writingArticlesData];
    const found = allArticles.find(a => a.file === filePath);
    await showArticle(filePath, filePath, sectionName, found ? found.title : '');
}

function backToArticles() {
    document.getElementById('article-detail').classList.remove('active');
    const currentTitle = document.title;
    let targetPage = 'writing', pageTitle = '半文';
    if (currentTitle.includes('半学') || currentTitle.includes('机器学习') || currentTitle.includes('数学建模')) {
        targetPage = 'study'; pageTitle = '半学';
    }
    document.getElementById(targetPage).classList.add('active');
    document.title = `${pageTitle} - Halface`;
}

// ==================== 搜索 ====================
function toggleSearch() {
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('search-input');
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        setTimeout(() => input.focus(), 100);
    } else {
        modal.classList.add('hidden');
        input.value = '';
        document.getElementById('search-results').innerHTML = '';
    }
}

function performSearch(query) {
    const resultsContainer = document.getElementById('search-results');
    const hint = document.getElementById('search-hint');
    if (!query.trim()) {
        resultsContainer.innerHTML = '';
        hint.textContent = '输入关键词搜索文章';
        return;
    }
    const q = query.toLowerCase();
    const results = searchIndex.filter(item => item.title.toLowerCase().includes(q) || item.section.toLowerCase().includes(q));
    hint.textContent = `找到 ${results.length} 个结果`;
    resultsContainer.innerHTML = results.map(r => `
        <div class="p-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style="border-bottom: 1px solid var(--line);" onclick="showArticleFromFile('${r.file}', '${r.category}'); toggleSearch();">
            <div class="font-semibold mb-1">${r.title}</div>
            <div class="text-xs" style="color: var(--muted); font-family: 'Inter', sans-serif;">${r.section} / ${r.date}</div>
        </div>
    `).join('');
}

// ==================== 评论 ====================
function initComments() {
    if (!GISCUS_CONFIG.enabled) return;
    const container = document.getElementById('disqus_thread');
    if (!container) return;
    container.innerHTML = '';
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
    container.appendChild(script);
}

// ==================== 聚光灯互动区 ====================
const SPOTLIGHT_WORDS = [
    { text: '半面' }, { text: 'Halface' }, { text: 'ハーフフェイス' },
    { text: 'Demi-face' }, { text: 'Halbgesicht' }, { text: 'Mezza faccia' },
    { text: '반면' }, { text: 'Medio rostro' }, { text: 'Полулицо' },
    { text: 'half' }, { text: 'face' }, { text: 'H' },
    { text: 'halface' }, { text: '半' }, { text: 'HALFACE' },
    { text: '半面半学' }, { text: '半文' }, { text: '半趣' },
    { text: 'Half Face' }, { text: 'demi-visage' }, { text: 'halv ansigt' },
    { text: 'Halv ansikt' }, { text: 'Puolikas' }, { text: 'Halv del' },
    { text: 'Félig arc' }, { text: 'Pół twarzy' }, { text: 'Semi-față' },
    { text: 'Halvt ansikte' }, { text: 'Yarım yüz' }
];

function initSpotlight() {
    const back = document.getElementById('spotlight-back');
    const circle = document.getElementById('spotlight-circle');
    const hero = document.querySelector('.magazine-hero');
    if (!back || !circle || !hero) return;

    const cols = 7, rows = 5;
    const centerColStart = 2, centerColEnd = 5;
    const centerRowStart = 1, centerRowEnd = 4;
    let html = '';
    SPOTLIGHT_WORDS.forEach((w, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols) % rows;
        if (col >= centerColStart && col < centerColEnd && row >= centerRowStart && row < centerRowEnd) return;
        const x = (col / cols) * 100 + (5 + Math.random() * 10);
        const y = (row / rows) * 100 + (5 + Math.random() * 10);
        const size = 0.7 + Math.random() * 1.8;
        html += `<span style="position:absolute; left:${x}%; top:${y}%; font-size:${size}rem; color:var(--muted); opacity:0.18; font-weight:600; white-space:nowrap; font-family:'Playfair Display','Noto Serif SC',serif; user-select:none; pointer-events:none;">${w.text}</span>`;
    });
    back.innerHTML = html;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        circle.style.display = 'block';
        circle.style.left = x + 'px';
        circle.style.top = y + 'px';
    });
    hero.addEventListener('mouseleave', () => {
        circle.style.display = 'none';
    });
}

// ==================== 键盘快捷键 ====================
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('search-modal');
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) toggleSearch();
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault(); toggleSearch();
    }
});

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSpotlight();
    renderFeatured();
    renderTechArticles('all');
    renderWritingArticles('all');
    renderLearningTimeline();
    renderProjects();
    initComments();
    if (typeof MusicPlayer !== 'undefined') MusicPlayer.init();
});
