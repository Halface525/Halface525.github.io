// ========================================
// 文章加载 & 筛选
// ========================================

// 半文板块文章筛选
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

// 技术博客文章筛选
function filterTechArticles(category) {
    const articles = document.querySelectorAll('#tech-article-list article');
    const filterContainer = document.getElementById('tech-filters');
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
            article.style.transform = 'translateY(10px)';
            setTimeout(() => {
                article.style.display = 'none';
            }, 300);
        }
    });
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

    // 查找对应的卡片标题
    let cardTitle = '';
    const articles = document.querySelectorAll('article[data-category]');
    for (const article of articles) {
        const onclickAttr = article.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(filePath)) {
            const titleElement = article.querySelector('h4') || article.querySelector('h3');
            if (titleElement) {
                cardTitle = titleElement.textContent.trim();
                break;
            }
        }
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
