import { setCookie, getCookie } from './cookies.js';

document.addEventListener('DOMContentLoaded', () => {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabs = document.querySelectorAll('.tab');
    const themeToggle = document.getElementById('theme-toggle');
    const reviewList = document.getElementById('review-list');
    const reviewForm = document.getElementById('review-form');
    const sortAscBtn = document.getElementById('sort-asc');
    const sortDescBtn = document.getElementById('sort-desc');
    const filterRating = document.getElementById('filter-rating');

    let isDarkTheme = false;

    const defaultReviews = [
        {
            name: "Алблак Пясятдва",
            comment: "Моя жизнь изменилась! Авокадо всегда свежие.",
            rating: 5,
            icon: "https://sun9-72.userapi.com/impg/Bgfn1LEnsVzVEn-u2FSaPN5agBQcX5l0OLtcGw/G3Is0UVPhOE.jpg?size=1536x2048&quality=95&sign=8944e40d3c2ae3318ebf220433e532de&type=album",
            timestamp: new Date().toISOString() 
        },
        {
            name: "Наталья",
            comment: "Лучшее, что я покупала за 99 рублей!",
            rating: 4,
            icon: "https://i.pinimg.com/originals/cf/cb/2d/cfcb2d41a08ba4305c7337ac4cb1f967.jpg",
            timestamp: new Date().toISOString()
        },
        {
            name: "Строитель Дюрант",
            comment: "Теперь я ем авокадо каждый день!",
            rating: 5,
            icon: "https://sun9-5.userapi.com/impg/oJZwfIBxOUBl5voecuj3KCc4vcM1FdykVkTfdw/3qxLGTeSRBQ.jpg?size=1620x2160&quality=95&sign=94e832da758aab544961f7b2ce85e80d&type=album",
            timestamp: new Date().toISOString()
        }
    ];

    // Функция для фильтрации свежих отзывов (за последние 24 часа)
    function filterFreshReviews(reviews) {
        const oneDayInMs = 24 * 60 * 60 * 1000; // 24 часа в миллисекундах
        const now = new Date().getTime();
        return reviews.filter(review => {
            const reviewTime = new Date(review.timestamp).getTime();
            return (now - reviewTime) <= oneDayInMs;
        });
    }

    // Загрузка и фильтрация отзывов из cookies
    let loadedReviews = defaultReviews; // Начальное значение — базовые отзывы
    const savedReviews = getCookie('reviews');
    if (savedReviews) {
        const parsedReviews = JSON.parse(savedReviews);
        loadedReviews = filterFreshReviews(parsedReviews); 
        if (loadedReviews.length === 0) {
            loadedReviews = defaultReviews;
        }
        setCookie('reviews', JSON.stringify(loadedReviews), 30); 
    } else {
        setCookie('reviews', JSON.stringify(defaultReviews), 30);
    }

    function renderReviews(reviews) {
        reviewList.innerHTML = '';
        reviews.forEach(review => {
            const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            const newReview = document.createElement('div');
            newReview.classList.add('review-card');
            newReview.innerHTML = `
                <img src="${review.icon}" alt="${review.name}" class="review-img">
                <p>"${review.comment}" <span class="stars">${stars}</span></p>
                <p><strong>— ${review.name}</strong></p>
            `;
            reviewList.appendChild(newReview);
        });
    }

    renderReviews(loadedReviews);

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

    // Переключение темы
    themeToggle.addEventListener('click', () => {
        isDarkTheme = !isDarkTheme;
        document.body.classList.toggle('dark-theme', isDarkTheme);
        themeToggle.textContent = isDarkTheme ? 'Светлая тема' : 'Тёмная тема';
    });

    // Видео
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

    // Обработка кликов по рекламе слева
    const leftAds = document.querySelectorAll('.left-ad');
    leftAds.forEach(ad => ad.addEventListener('click', () => location.reload()));

    // Закрытие рекламы с лососем
    const salmonAd = document.querySelector('.salmon-ad');
    if (salmonAd) {
        const salmonAdClose = salmonAd.querySelector('.close-btn');
        salmonAdClose.addEventListener('click', () => {
            salmonAd.style.display = 'none';
        });
    }

    // Таймер рекламы
    const adTimer = document.querySelector('.ad-timer');
    const adTimerClose = adTimer.querySelector('.close-btn');
    const timerSpan = document.getElementById('timer');
    adTimer.style.display = 'none';
    setTimeout(() => {
        adTimer.style.display = 'flex';
        let timeLeft = 5;
        const countdown = setInterval(() => {
            timeLeft--;
            timerSpan.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                adTimerClose.addEventListener('click', () => {
                    adTimer.style.display = 'none';
                });
            }
        }, 1000);
    }, 3000);

    // Добавление отзыва
    if (reviewForm && reviewList) {
        reviewForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const comment = document.getElementById('review').value.trim();
            const rating = document.getElementById('rating').value;

            if (name.length < 2) {
                alert('Имя должно содержать минимум 2 символа');
                return;
            }
            if (comment.length < 5) {
                alert('Отзыв должен содержать минимум 5 символов');
                return;
            }

            const selectedIcon = document.querySelector('input[name="icon"]:checked');
            let iconSrc = 'https://via.placeholder.com/50';

            if (selectedIcon) {
                iconSrc = selectedIcon.value;
            } else {
                const customIcon = document.getElementById('custom-icon');
                if (customIcon.files && customIcon.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        iconSrc = e.target.result;
                        addReview(iconSrc);
                    };
                    reader.readAsDataURL(customIcon.files[0]);
                    return;
                }
            }

            addReview(iconSrc);

            function addReview(iconSrc) {
                const newReview = {
                    name,
                    comment,
                    rating: parseInt(rating),
                    icon: iconSrc,
                    timestamp: new Date().toISOString() 
                };
                loadedReviews.push(newReview);
                setCookie('reviews', JSON.stringify(loadedReviews), 30);
                renderReviews(loadedReviews);
                reviewForm.reset();
            }
        });
    }

    sortAscBtn.addEventListener('click', () => {
        const sorted = [...loadedReviews].sort((a, b) => a.rating - b.rating);
        renderReviews(sorted);
    });

    sortDescBtn.addEventListener('click', () => {
        const sorted = [...loadedReviews].sort((a, b) => b.rating - a.rating);
        renderReviews(sorted);
    });

    filterRating.addEventListener('change', () => {
        const value = filterRating.value;
        let filtered = loadedReviews;
        if (value !== 'all') {
            filtered = loadedReviews.filter(review => review.rating === parseInt(value));
        }
        renderReviews(filtered);
    });
});