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

    // Обновляем обработку видео
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
            iframe.allowFullscreen = true;
            
            wrapper.appendChild(iframe);
            section.replaceChild(wrapper, placeholder);
        }
    });

const timerAd = document.querySelector('.ad-timer');
if (timerAd) {
    let timeLeft = 5;
    timerAd.innerHTML = `<div class="ad-content"><img src="https://i.pinimg.com/736x/9a/0d/49/9a0d4988dcc474a77fdc0d6132d5cb76--cool-kitchen-gadgets-kitchen-tips.jpg" alt="Ad Image" class="ad-image"><p>Рекламу можно будет закрыть через <span id="timer">${timeLeft}</span> сек...</p></div><span class="close-btn">✖</span>`;
    timerAd.style.display = 'none';

    const closeTimerAd = () => {
        timerAd.style.display = 'none';
    };

    timerAd.querySelector('.close-btn').addEventListener('click', () => {
        if (timeLeft === 0) {
            closeTimerAd();
        }
    });

    setTimeout(() => {
        timerAd.style.display = 'block';
        const countdown = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                document.getElementById('timer').textContent = timeLeft;
            } else {
                clearInterval(countdown);
                timerAd.querySelector('.close-btn').style.cursor = 'pointer';
            }
        }, 1000);
    }, 3000);
}

const waitAd = document.querySelector('.ad-wait');
if (waitAd) {
    const timerAd = document.querySelector('.ad-timer');
    const showWaitAd = () => {
        waitAd.style.display = 'block';
    };

    waitAd.querySelector('.close-btn').addEventListener('click', () => {
        waitAd.style.display = 'none';
    });

    showWaitAd();
    setInterval(showWaitAd, 10000); 
}


const salmonAd = document.querySelector('.salmon-ad');
if (salmonAd) {
    let direction = 1;
    let speed = 2;

    function animateSalmon() {
        let left = parseInt(salmonAd.style.left || 20); 
        if (left >= window.innerWidth - salmonAd.offsetWidth - 20) {
            direction = -1; 
        } else if (left <= 20) {
            direction = 1; 
        }
        salmonAd.style.left = (left + speed * direction) + 'px';
        requestAnimationFrame(animateSalmon);
    }

    salmonAd.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-btn')) {
            salmonAd.style.display = 'none';
        }
    });

    animateSalmon();
}

const leftAd = document.querySelector('.left-ad');
if (leftAd) {
    leftAd.addEventListener('click', () => {
        location.reload();
    });
}


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
