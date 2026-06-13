// ========================================
// 半趣项目展示
// ========================================

// 显示项目详情弹窗
function showProjectDetail(projectId) {
    const project = projectsData[projectId];
    if (!project) return;

    const modal = document.getElementById('project-detail-modal');
    const title = document.getElementById('project-detail-title');
    const content = document.getElementById('project-detail-content');

    title.innerHTML = `<span class="mr-2">${project.icon}</span>${project.title}`;
    content.innerHTML = `
        <div class="space-y-4">
            <p class="text-lg opacity-80">${project.description}</p>
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                ${project.details}
            </div>
            <div class="flex gap-4 pt-4">
                ${project.link !== '#' ? `<a href="${project.link}" target="_blank" class="sketch-btn inline-block">查看项目</a>` : ''}
                ${project.github !== '#' ? `<a href="${project.github}" target="_blank" class="sketch-btn inline-block">GitHub</a>` : ''}
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// 关闭项目详情弹窗
function closeProjectDetail() {
    const modal = document.getElementById('project-detail-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}
