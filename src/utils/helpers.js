export function getCategoryLabel(category) {
  const labels = {
    ml: "机器学习",
    modeling: "数学建模",
    convex: "凸优化",
    thinking: "半思",
    reading: "半读",
    travel: "半游",
  };
  return labels[category] || category;
}

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
    return new Date(db) - new Date(da);
  });
}
