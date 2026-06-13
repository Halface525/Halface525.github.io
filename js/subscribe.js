// ========================================
// 订阅表单
// ========================================

function initSubscribeForm() {
    const form = document.getElementById('subscribe-form');
    const message = document.getElementById('subscribe-message');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('subscribe-email').value;

            let subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');

            if (subscribers.includes(email)) {
                message.textContent = '该邮箱已订阅过了！';
                message.className = 'mt-4 text-sm relative z-10 text-yellow-600';
            } else {
                subscribers.push(email);
                localStorage.setItem('subscribers', JSON.stringify(subscribers));

                message.textContent = '订阅成功！感谢你的关注 ✨';
                message.className = 'mt-4 text-sm relative z-10 text-green-600';

                document.getElementById('subscribe-email').value = '';
            }

            message.classList.remove('hidden');

            setTimeout(() => {
                message.classList.add('hidden');
            }, 3000);
        });
    }
}
