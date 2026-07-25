import { parseMarkdown } from "./src/utils/markdown.js";
import fs from "fs";

const files = [
  "./public/content/study/modeling/01-xianxingguihua.md",
  "./public/content/study/modeling/02-zhengshuguihua.md",
];

for (const f of files) {
  const md = fs.readFileSync(f, "utf8");
  const { html } = parseMarkdown(md);
  const idx = html.indexOf("<blockquote>");
  console.log(`\n=== ${f} ===`);
  console.log(html.slice(idx, idx + 500));
}
