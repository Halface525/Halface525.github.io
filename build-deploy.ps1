# 构建并同步到根目录（用于 GitHub Pages 部署）
# 运行前请确保已在项目根目录

# 1. 恢复开发入口
Copy-Item index.dev.html index.html -Force
Write-Host "[1/4] 已恢复开发入口 index.html"

# 2. 构建
npm run build
Write-Host "[2/4] 构建完成"

# 3. 清理旧产物
Remove-Item -Recurse -Force assets -ErrorAction SilentlyContinue
Write-Host "[3/4] 已清理旧产物 assets/"

# 4. 同步 dist/ 到根目录
Copy-Item dist/index.html index.html -Force
Copy-Item dist/assets . -Recurse -Force
Copy-Item dist/audio/* audio/ -Recurse -Force
Copy-Item dist/content/* content/ -Recurse -Force
Copy-Item dist/images/* images/ -Recurse -Force
Copy-Item dist/vite.svg vite.svg -Force
Write-Host "[4/4] 已同步 dist/ 到根目录"

Write-Host "`n✅ 部署产物已准备就绪，提交根目录的 index.html 和 assets/ 即可"
Write-Host "   下次开发请运行: npm run dev（会自动恢复开发入口）"
