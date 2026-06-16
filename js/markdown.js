// ========================================
// Markdown 解析器 — 杂志风格版本
// ========================================

// 解析 YAML Front Matter
function parseYAMLFrontMatter(md) {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const match = md.match(frontMatterRegex);
    if (!match) return { metadata: {}, content: md };
    const yamlText = match[1];
    const content = md.slice(match[0].length);
    const metadata = {};
    const lines = yamlText.split('\n');
    let currentKey = null, currentList = null;
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ')) {
            if (currentList) currentList.push(trimmed.slice(2).trim());
            continue;
        }
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex > 0) {
            const key = trimmed.slice(0, colonIndex).trim();
            let value = trimmed.slice(colonIndex + 1).trim();
            if (value === '') { currentList = []; metadata[key] = currentList; }
            else {
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
                metadata[key] = value;
                currentList = null;
            }
            currentKey = key;
        }
    }
    return { metadata, content };
}

// Markdown 转 HTML（杂志风格：简洁语义标签，样式由 CSS .article-body 控制）
function parseMarkdown(md) {
    const { metadata, content } = parseYAMLFrontMatter(md);
    let html = content.replace(/\r\n/g, '\n');

    // 保护代码块（避免被后续正则破坏）
    const codeBlocks = [];
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        codeBlocks.push(`<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`);
        return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
    });

    // 标题
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // 粗体和斜体
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 引用
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // 行内代码
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 列表
    html = html.replace(/^\d+\.\s+(.*$)/gim, '<li>$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');

    // 链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // 表格
    html = html.replace(/\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g, function(match, header, rows) {
        const headers = header.split('|').map(h => h.trim()).filter(h => h);
        const rowData = rows.trim().split('\n').map(row => row.split('|').map(c => c.trim()).filter(c => c));
        let t = '<table><thead><tr>';
        headers.forEach(h => { t += `<th>${h}</th>`; });
        t += '</tr></thead><tbody>';
        rowData.forEach(row => { t += '<tr>'; row.forEach(c => { t += `<td>${c}</td>`; }); t += '</tr>'; });
        t += '</tbody></table>';
        return t;
    });

    // 水平线
    html = html.replace(/^---$/gim, '<div style="display:flex;align-items:center;gap:1rem;margin:2rem 0;"><div style="flex:1;height:1px;background:var(--line);"></div><span style="color:var(--muted);">&#10022;</span><div style="flex:1;height:1px;background:var(--line);"></div></div>');

    // 分段：双换行 → 段落
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>\s*<\/p>/g, '');

    // 恢复代码块
    codeBlocks.forEach((block, i) => {
        html = html.replace(`__CODE_BLOCK_${i}__`, block);
    });

    return { metadata, html };
}
