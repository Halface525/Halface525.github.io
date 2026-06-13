// ========================================
// SPA 页面路由
// ========================================

// 页面切换
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
