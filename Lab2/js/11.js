document.addEventListener('DOMContentLoaded', () => {
        const leftAdImages = document.querySelectorAll('.left-ad img');
        leftAdImages.forEach(img => {
            img.src = 'https://resizer.mail.ru/p/0f8fa55f-1fa9-509f-9374-d08eab4e64d1/dpr:123/scale:80/AQAKmbT1PiAYFusPn3oHpWUdW8kj88j56zrFqaUviq0rnMvGia8WpNeBqqWAzVXMhMgWv1VUP-ZmMcoFh7jqJKjCUtw.webp';
        });
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabs = document.querySelectorAll('.tab');

    // Устанавливаем активную вкладку "Главная" при загрузке
    tabs.forEach(t => t.classList.remove('active'));
    document.getElementById('main').classList.add('active');

    tabLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            tabLinks.forEach(l => l.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));
            link.classList.add('active');
            document.getElementById(link.dataset.tab).classList.add('active');
        });
    });

    document.querySelectorAll('.video-placeholder').forEach(placeholder => {
        const iframe = document.createElement('iframe');
        iframe.src = placeholder.dataset.video;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        const wrapper = document.createElement('div');
        wrapper.className = 'video-wrapper';
        wrapper.appendChild(iframe);
        placeholder.replaceWith(wrapper);
    });

    const leftAds = document.querySelectorAll('.left-ad');
    leftAds.forEach(ad => ad.addEventListener('click', () => location.reload()));

    const salmonAd = document.querySelector('.salmon-ad');
    if (salmonAd) {
        salmonAd.querySelector('.close-btn').addEventListener('click', () => salmonAd.style.display = 'none');
    }

    const adTimer = document.querySelector('.ad-timer');
    let timeLeft = 5;
    adTimer.style.display = 'none';
    setTimeout(() => {
        adTimer.style.display = 'flex';
        const countdown = setInterval(() => {
            timeLeft--;
            document.getElementById('timer').textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                adTimer.querySelector('.close-btn').addEventListener('click', () => adTimer.style.display = 'none');
            }
        }, 1000);
    }, 3000);

    const reviewForm = document.getElementById('review-form');
    const reviewList = document.getElementById('review-list');
    if (reviewForm && reviewList) {
        reviewForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const comment = document.getElementById('review').value;
            const rating = document.getElementById('rating').value;
            let stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

            const newReview = document.createElement('div');
            newReview.classList.add('review-card');
            newReview.innerHTML = `
                <img src="https://via.placeholder.com/50" alt="${name}" class="review-img">
                <p>"${comment}" <span class="stars">${stars}</span></p>
                <p><strong>— ${name}</strong></p>
            `;
            reviewList.appendChild(newReview);
            reviewForm.reset();
        });
    }
});