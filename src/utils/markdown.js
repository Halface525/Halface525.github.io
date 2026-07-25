import matter from "gray-matter";

/**
 * 解析 Markdown 文件，提取 YAML Front Matter 与正文内容。
 * 渲染交给 react-markdown + remark 插件处理，此处不再生成 HTML。
 */
export function parseMarkdown(md) {
  const { data: metadata, content } = matter(md);
  return { metadata, content };
}
