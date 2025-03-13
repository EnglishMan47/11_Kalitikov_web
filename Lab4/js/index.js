function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length));
        }
    }
    return null;
}

document.addEventListener('DOMContentLoaded', () => {
    // Очистка localStorage и установка только базовых отзывов
    localStorage.removeItem('reviews');
    document.cookie = 'reviews=; Max-Age=-99999999;';

    const tabLinks = document.querySelectorAll('.tab-link');
    const tabs = document.querySelectorAll('.tab');
    const themeToggle = document.getElementById('theme-toggle');
    const reviewList = document.getElementById('review-list');
    const reviewForm = document.getElementById('review-form');
    const sortAscBtn = document.getElementById('sort-asc');
    const sortDescBtn = document.getElementById('sort-desc');
    const filterRating = document.getElementById('filter-rating');
    const avgRatingValue = document.getElementById('avg-rating-value');
    const avgStars = document.getElementById('avg-stars');
    const avgReviewsCount = document.getElementById('avg-reviews-count');

    let isDarkTheme = false;

    const defaultReviews = [
      
 {
    name: "Алблак Пясятдва, 20 лет",
    comment: "Моя жизнь изменилась! Авокадо всегда свежие.",
    rating: 5,
    icon: "https://sun9-72.userapi.com/impg/Bgfn1LEnsVzVEn-u2FSaPN5agBQcX5l0OLtcGw/G3Is0UVPhOE.jpg?size=1536x2048&quality=95&sign=8944e40d3c2ae3318ebf220433e532de&type=album",
    timestamp: new Date().toISOString(),
    isDefault: true
},
{
    name: "Наталья, 300 метров от вас",
    comment: "Лучшее, что я покупала за 99 рублей!",
    rating: 4,
    icon: "https://i.pinimg.com/originals/cf/cb/2d/cfcb2d41a08ba4305c7337ac4cb1f967.jpg",
    timestamp: new Date().toISOString(),
    isDefault: true
},
{
    name: "Строитель Дюрант, 20 лет",
    comment: "Теперь я ем авокадо каждый день!",
    rating: 5,
    icon: "https://sun9-5.userapi.com/impg/oJZwfIBxOUBl5voecuj3KCc4vcM1FdykVkTfdw/3qxLGTeSRBQ.jpg?size=1620x2160&quality=95&sign=94e832da758aab544961f7b2ce85e80d&type=album",
    timestamp: new Date().toISOString(),
    isDefault: true
},
{
    name: "Буба",
    comment: "Неплохо, но как по мне неудобно использовать. Поставлю среднячок.",
    rating: 3,
    icon: "https://psv4.userapi.com/s/v1/d/tV_he1_avm9CG9PxuT_tTr-kZ7jPdHoKoPXlMe17mU9nhp3fTab-hBIoT8__v2xtFCAEn9atM78a1GVfIHWgm8JBS2RUWQBoHNFMWfx1Sod_ttDulSMmCg/Penkov_udivlyaetsya.png",
    timestamp: new Date().toISOString(),
    isDefault: true
},
{
    name: "Брутальный Камень",
    comment: "Этот гаджет держит авокадо крепче, чем я держу кинематограф. Однозначно 5 звёзд!",
    rating: 5,
    icon: "https://yandex-images.clstorage.net/hi9J5f450/ae523cGL-/sP9bFhSP5TRLEAdccrLbGsyQQX_DARJczqMeYs1tqGXuModcD07mGkorHxy62g1wBFa8bgqIFgzJTF2NXdBqk-n2HgtNkpwoSwRWcFuCsyqMxXEKz1QaON6-elLE1Am8PrMj5MvmdrbmWkJwptZlLQlbJc8Smf4pqHE1CbnZ18YA8zseKHcUBFfg0ihG5gNe8HltC4_88tV2b8P_wKBljAbz47ybqnpS-iaKXFaiCFkFU32C2ikaKZyhuaVpbZ_abP9DbrB7CMDTxE7wipZ33gCVfVNf6MZl7qczt5w4IVhms1NQH0r2Bj4yihQifpS1cafpvh4R5q3E9YVZCcVnhnC7mx5047xcZygOxIbm6zJ4FaET-xwWXZLnN4OgbL00ivP7AOPqpq4atvao0tpQ8WGj1W4uIdppgPVVSbVta2pki8t-UM90pMsE2oyGnqdiABWxC4sMFsEiP4czEExBlOpzT9y7JioqdubenBImVJmNhzk-wrlqjaj95UGF8cuqqBNjziD3lJRvoBJAntKrLhjdKYsbzBoRKj83P8QQabxi-8sA29Z2TtJ67vD65lxZ_a8R7lZRCo0kaUERfYnLmuz_b_aEe7gAs-CG1KKug5pEEXXTt9juyXqDK0sYTPl8_o-bvM9eurLOulqgmh6ssQlPceLWsR5tEPE5IZH9z85UE4eGeE80SCe8AgD2pj8SEOm5f2Po8r2qL587LACxPG4Td_SPplaCQp6GZCqiiPGVt3FmBhliHeR1HRVhifvaJKM7atCTDAQr0OKoTrqjopSVOZv7BH6hbm_Hm0T48egWP78wx2oiCj6mzvTq2rS9bbvp1jblfjU0eWFBEVGPfvwbf2KwW-C0OwguTMqKx76Ike1_0zDi8dIDG1fgmDGsDusDEJOK-gpK8g4s7hqgrXlTvdI22QZVmDml3al5h27gz_tCvCf0xCMEDiSy9tveFH09m8Psmhn-p1u3IByc",
    timestamp: new Date().toISOString(),
    isDefault: true
},
{
    name: "Синька",
    comment: "Эта штука выглядит, как какой-то миниатюрный гробик для авокадо. Открываю – а там просто зелёная жижа отдыхает. Но знаете что? Это работает! Я оставила половинку авокадо внутри на неделю, и она всё еще выглядела так, будто готова танцевать чечётку, а не гнить в подвале. Берите, мясные мешки!",
    rating: 4,
    icon: "https://i.pinimg.com/736x/c7/0e/aa/c70eaa3c930cade3e89e2e8336bdcec2.jpg",
    timestamp: new Date().toISOString(),
    isDefault: true
}
    ];

    let loadedReviews = defaultReviews;

    function saveReviews(reviews) {
        localStorage.setItem('reviews', JSON.stringify(reviews));
        setCookie('reviews', JSON.stringify(reviews), 30);
    }

    function filterFreshReviews(reviews) {
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const now = new Date().getTime();
        return reviews.filter(review => {
            if (review.isDefault) return true;
            const reviewTime = new Date(review.timestamp).getTime();
            return (now - reviewTime) <= oneDayInMs;
        });
    }

    saveReviews(loadedReviews);

    function calculateAverageRating(reviews) {
        if (reviews.length === 0) return { avg: 0, count: 0 };
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const avg = totalRating / reviews.length;
        return { avg: avg.toFixed(1), count: reviews.length };
    }

    function renderAverageRating() {
        const { avg, count } = calculateAverageRating(loadedReviews);
        avgRatingValue.textContent = avg;
        avgStars.innerHTML = '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));
        avgReviewsCount.textContent = `(основано на ${count} отзывах)`;
    }

    function renderReviews(reviewsToDisplay) {
        reviewList.innerHTML = '';
        reviewsToDisplay.forEach(review => {
            const newReview = document.createElement('div');
            newReview.classList.add('review-card');
            newReview.innerHTML = `
                <div class="review-card-inner">
                    <img src="${review.icon}" alt="${review.name}" class="review-icon">
                    <div class="review-details">
                        <div class="review-header">
                            <h4>${review.name}</h4>
                            <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                        </div>
                        <p>${review.comment}</p>
                    </div>
                </div>
            `;
            reviewList.appendChild(newReview);
        });
        renderAverageRating();
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

    themeToggle.addEventListener('click', () => {
        isDarkTheme = !isDarkTheme;
        document.body.classList.toggle('dark-theme', isDarkTheme);
        themeToggle.textContent = isDarkTheme ? 'Светлая тема' : 'Тёмная тема';
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
        const salmonAdClose = salmonAd.querySelector('.close-btn');
        salmonAdClose.addEventListener('click', () => {
            salmonAd.style.display = 'none';
        });
    }

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
                    timestamp: new Date().toISOString(),
                    isDefault: false
                };
                loadedReviews.push(newReview);
                saveReviews(loadedReviews);
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