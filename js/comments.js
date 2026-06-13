// ========================================
// Giscus 评论系统
// ========================================

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

    const currentUrl = window.location.href;

    // 如果已经加载过且 URL 没变，不重复加载
    if (giscusContainer.querySelector('.giscus') && currentGiscusTerm === currentUrl) {
        return;
    }

    giscusContainer.innerHTML = '';
    currentGiscusTerm = currentUrl;

    const giscusDiv = document.createElement('div');
    giscusDiv.className = 'giscus';
    giscusContainer.appendChild(giscusDiv);

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

// 评论初始化
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
        alert('评论功能正在开发中，敬请期待！🎉\n\n配置 Giscus 后即可使用。\n\n步骤：\n1. GitHub 仓库启用 Discussions\n2. 安装 Giscus App\n3. 访问 giscus.app 获取 repo-id 和 category-id\n4. 在 js/config.js 中配置 GISCUS_CONFIG');
    }
}
