// ========================================
// Markdown 解析器
// ========================================

// 解析 YAML Front Matter
function parseYAMLFrontMatter(md) {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const match = md.match(frontMatterRegex);

    if (!match) {
        return { metadata: {}, content: md };
    }

    const yamlText = match[1];
    const content = md.slice(match[0].length);

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

// Markdown 转 HTML
function parseMarkdown(md) {
    const { metadata, content } = parseYAMLFrontMatter(md);

    let html = content;

    // 标题
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3 opacity-80">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 sketch-underline">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6">$1</h1>');

    // 粗体和斜体
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 引用
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-400 pl-4 my-6 italic opacity-80 text-lg">$1</blockquote>');

    // 代码块
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-6"><code>$2</code></pre>');

    // 行内代码
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">$1</code>');

    // 列表
    html = html.replace(/^\d+\.\s+(.*$)/gim, '<li class="ml-6 mb-2">$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li class="ml-6 mb-2 list-disc">$1</li>');

    // 链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:underline">$1</a>');

    // 表格
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

    // 水平线
    html = html.replace(/^---$/gim, '<div class="my-8 flex items-center gap-4"><div class="flex-1 h-px bg-gray-300"></div><span class="text-gray-400">✦</span><div class="flex-1 h-px bg-gray-300"></div></div>');

    // 段落
    html = html.replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">');

    // 包装
    html = '<p class="mb-4 leading-relaxed">' + html + '</p>';

    // 清理空段落
    html = html.replace(/<p class="mb-4 leading-relaxed"><\/p>/g, '');
    html = html.replace(/<p class="mb-4 leading-relaxed">\s*<\/p>/g, '');

    return { metadata, html };
}
