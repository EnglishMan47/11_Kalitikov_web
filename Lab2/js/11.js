document.addEventListener('DOMContentLoaded', () => {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabs = document.querySelectorAll('.tab');

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            tabLinks.forEach(l => l.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));
            link.classList.add('active');
            const tabId = link.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    const videoSections = document.querySelectorAll('.video-section');
    videoSections.forEach(section => {
        const placeholder = section.querySelector('.video-placeholder');
        if (placeholder) {
            const videoUrl = placeholder.getAttribute('data-video');
            const wrapper = document.createElement('div');
            wrapper.className = 'video-wrapper';
            const iframe = document.createElement('iframe');
            iframe.src = videoUrl;
            iframe.frameborder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.setAttribute('allowfullscreen', '');
            wrapper.appendChild(iframe);
            section.replaceChild(wrapper, placeholder);
        }
    });

    const adElements = {
        timerAd: document.querySelector('.ad-timer'),
        waitAd: document.querySelector('.ad-wait'),
        salmonAd: document.querySelector('.salmon-ad'),
        leftAd: document.querySelector('.left-ad'),
        rightAd: document.querySelector('.right-ad')
    };

    Object.keys(adElements).forEach(adType => {
        const element = adElements[adType];
        if (!element) return;

        switch (adType) {
            case 'timerAd':
                let timeLeft = 5;
                let countdownInterval; // Перемещаем объявление сюда

                element.innerHTML = `
                    <div class="ad-content">
                        <img src="https://i.pinimg.com/736x/9a/0d/49/9a0d4988dcc474a77fdc0d6132d5cb76--cool-kitchen-gadgets-kitchen-tips.jpg" alt="Ad Image" class="ad-image">
                        <p>Скидка 99%!!!</p>
                        <p>Рекламу можно будет закрыть через <span id="timer">${timeLeft}</span> сек...</p>
                    </div>
                    <span class="close-btn">✖</span>
                `;
                element.style.display = 'none';

                const closeTimerAd = () => {
                    clearInterval(countdownInterval); // Теперь countdownInterval доступен
                    element.style.display = 'none';
                };

                element.querySelector('.close-btn').addEventListener('click', () => {
                    if (timeLeft === 0) closeTimerAd();
                });

                setTimeout(() => {
                    element.style.display = 'block';
                    countdownInterval = setInterval(() => { // Присваиваем значение здесь
                        if (timeLeft > 0) {
                            timeLeft--;
                            document.getElementById('timer').textContent = timeLeft;
                        } else {
                            element.querySelector('.close-btn').style.cursor = 'pointer';
                        }
                    }, 1000);
                }, 3000);
                break;

            case 'waitAd':
                const showWaitAd = () => {
                    element.style.display = 'block';
                };
                element.querySelector('.close-btn').addEventListener('click', () => {
                    element.style.display = 'none';
                });
                showWaitAd();
                setInterval(showWaitAd, 10000);
                break;

            case 'salmonAd':
                let position = 0;
                const speed = 2;
                let direction = 1;
                function animateSalmon() {
                    position += speed * direction;
                    if (position >= window.innerWidth - element.offsetWidth || position <= 0) {
                        direction *= -1;
                    }
                    element.style.transform = `translateX(${position}px)`;
                    requestAnimationFrame(animateSalmon);
                }
                element.addEventListener('click', (e) => {
                    if (e.target.classList.contains('close-btn')) {
                        element.style.display = 'none';
                    }
                });
                animateSalmon();
                break;

            case 'leftAd':
                element.addEventListener('click', () => {
                    location.reload();
                });
                break;

            case 'rightAd':
                break;

                default:
                    console.log(`Неизвестный тип рекламы: ${adType}`);
            }
    });


const reviewForm = document.getElementById('review-form');
const reviewList = document.getElementById('review-list');

if (reviewForm && reviewList) {
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const comment = document.getElementById('review').value;
        const rating = document.getElementById('rating').value;
        let stars = '';
        for (let i = 0; i < rating; i++) stars += '★';
        for (let i = rating; i < 5; i++) stars += '☆';

        const newReview = document.createElement('div');
        newReview.classList.add('review-card');
        newReview.innerHTML = `
            <img src="https://via.placeholder.com/50" alt="${name}" class="review-img">
            <p>"${comment}" <span class="stars">${stars}</span></p>
            <p><strong>— ${name}</strong></p>
        `;
        reviewList.appendChild(newReview);

        localStorage.removeItem('avoSaverReviews');
        reviewForm.reset();
    });
}

})
