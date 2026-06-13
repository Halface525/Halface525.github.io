// ========================================
// 主题切换 & 星星背景
// ========================================

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

// 主题切换
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');

    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    updateThemeStatus();

    // 切换动画
    document.body.style.transform = 'scale(0.98)';
    setTimeout(() => {
        document.body.style.transform = 'scale(1)';
    }, 200);
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
