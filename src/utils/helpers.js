export function getCategoryLabel(category) {
  const labels = {
    ml: "机器学习",
    modeling: "数学建模",
    convex: "凸优化",
    array: "阵列处理",
    thinking: "半思",
    reading: "半读",
    travel: "半游",
  };
  return labels[category] || category;
}

// 半学各系列的标识色（与书架书脊一致）
export const CATEGORY_TONES = {
  ml: "#7a1f1f",
  modeling: "#1f6a8a",
  convex: "#3d7a52",
  array: "#7a5cc4",
};

export function getCardLabel(title) {
  return /^[一-龥]/.test(title) ? title : title.split(" ")[0];
}

export function getArticleSequence(file) {
  const basename = file.split("/").pop();
  const match = basename.match(/^(\d+)-/);
  return match ? match[1] : null;
}

export function formatDate(dateStr) {
  return dateStr.replace(/-/g, ".");
}

export function sortByDateDesc(items, key = "date") {
  return [...items].sort((a, b) => {
    const da = String(a[key]).replace(/\./g, "-");
    const db = String(b[key]).replace(/\./g, "-");
    const diff = new Date(db) - new Date(da);
    if (diff !== 0) return diff;
    // 日期相同时按文章序号降序，最新的（序号大）排前面，避免依赖 sort 的稳定性
    const sa = Number(getArticleSequence(a.file));
    const sb = Number(getArticleSequence(b.file));
    if (!Number.isNaN(sa) && !Number.isNaN(sb)) return sb - sa;
    return 0;
  });
}
