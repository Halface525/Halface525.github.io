// ========================================
// 应用入口 — 初始化 & 键盘快捷键
// ========================================

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 星星背景
    createStars();

    // 主题初始化
    if (localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        updateThemeStatus();
    }

    // 视觉效果
    initCards();
    initMouseTrail();
    initTiltEffect();

    // 主题监听
    initThemeListener();

    // 相对时间
    updateRelativeTimes();
    setInterval(updateRelativeTimes, 60000);

    // 订阅表单
    initSubscribeForm();

    // 评论系统
    initComments();

    // 浏览器返回键
    window.addEventListener('popstate', (event) => {
        if (document.getElementById('article-detail').classList.contains('active')) {
            backToArticles();
        }
    });
});

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('search-modal');

    // ESC 关闭搜索
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
        toggleSearch();
    }

    // / 打开搜索（不在输入框时）
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        toggleSearch();
    }
});
