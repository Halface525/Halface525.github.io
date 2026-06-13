// ========================================
// 全局搜索
// ========================================

// 切换搜索弹窗
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

    let category = 'thinking';
    if (sectionName === '半学') {
        if (filePath.includes('/ml/')) {
            category = 'ml';
        } else if (filePath.includes('/modeling/')) {
            category = 'modeling';
        }
    } else {
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
