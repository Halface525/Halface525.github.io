// ========================================
// 工具函数
// ========================================

// 相对时间计算
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

// 获取分类标签（统一版本）
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
