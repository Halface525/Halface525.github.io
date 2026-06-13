// ========================================
// 视觉效果
// ========================================

// 卡片随机旋转
function initCards() {
    document.querySelectorAll('.sketch-card').forEach((card) => {
        const randomRotate = (Math.random() - 0.5) * 4;
        card.style.transform = `rotate(${randomRotate}deg)`;
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'rotate(0deg) translateY(-5px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotate(${randomRotate}deg)`;
        });
    });
}

// 鼠标轨迹粒子效果
function initMouseTrail() {
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.9) {
            const dot = document.createElement('div');
            const isDark = document.documentElement.classList.contains('dark');
            dot.style.position = 'fixed';
            dot.style.left = e.clientX + 'px';
            dot.style.top = e.clientY + 'px';
            dot.style.width = '8px';
            dot.style.height = '8px';
            dot.style.background = isDark ? 'rgba(255, 133, 133, 0.4)' : 'rgba(255, 107, 107, 0.3)';
            dot.style.borderRadius = '50%';
            dot.style.pointerEvents = 'none';
            dot.style.zIndex = '9999';
            dot.style.transition = 'all 1s ease-out';
            document.body.appendChild(dot);

            setTimeout(() => {
                dot.style.transform = 'scale(0)';
                dot.style.opacity = '0';
            }, 10);

            setTimeout(() => {
                dot.remove();
            }, 1000);
        }
    });
}

// 鼠标跟随倾斜效果
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('.sketch-border');

    tiltElements.forEach(element => {
        // 跳过音乐播放器及其子元素
        if (element.id === 'music-player' || element.closest('#music-player')) {
            return;
        }

        // 跳过播放器内部的按钮和卡片
        if (element.classList.contains('music-control-btn') ||
            element.classList.contains('music-play-btn') ||
            element.classList.contains('music-mode-btn') ||
            element.classList.contains('music-item') ||
            element.closest('.music-controls') ||
            element.closest('.music-playlist')) {
            return;
        }

        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const mouseX = e.clientX;

            const percentX = (mouseX - centerX) / (rect.width / 2);
            const rotation = percentX * 3;

            element.style.transform = `rotate(${rotation}deg)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
        });
    });
}
