"use strict";

// Функция для генерации случайной аватарки
async function fetchRandomImage() {
    const randomSeed = Math.random().toString(36).substring(2, 15);
    const imageUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${randomSeed}`;
    return imageUrl;
}

// Функция для генерации случайного имени
async function fetchRandomFantasyName() {
    try {
        const response = await fetch("https://random-data-api.com/api/users/random_user");
        const data = await response.json();
        return data.first_name || "Случайное имя";
    } catch (error) {
        console.error("Ошибка загрузки имени:", error);
        return "Случайное имя";
    }
}

// Функция для генерации случайного возраста
async function fetchRandomAge() {
    try {
        const response = await fetch("https://randomuser.me/api/");
        const data = await response.json();
        const dob = new Date(data.results[0].dob.date);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        age = age > 0 ? age : 1;
        return age;
    } catch (error) {
        console.error("Ошибка загрузки возраста:", error);
        return Math.floor(Math.random() * 80) + 18;
    }
}

// Функция для генерации случайного класса (новый API)
async function fetchRandomClass() {
    try {
        const response = await fetch("https://random-word-api.herokuapp.com/word?number=1");
        const data = await response.json();
        return data[0].charAt(0).toUpperCase() + data[0].slice(1) || "Неизвестно";
    } catch (error) {
        console.error("Ошибка загрузки класса:", error);
        return "Неизвестно";
    }
}

// Функция для генерации случайных навыков
async function fetchRandomSkills() {
    try {
        const response = await fetch("https://random-word-api.herokuapp.com/word?number=3");
        const data = await response.json();
        const skills = data.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(", ");
        return skills;
    } catch (error) {
        console.error("Ошибка загрузки навыков:", error);
        return "Отсутствуют";
    }
}

// Функция для генерации случайного описания (новый API)
async function fetchRandomDescription() {
    try {
        const response = await fetch("https://baconipsum.com/api/?type=all-meat&sentences=1");
        const data = await response.json();
        return data[0] || "Нет описания";
    } catch (error) {
        console.error("Ошибка загрузки описания:", error);
        return "Нет описания";
    }
}

// Функция для генерации случайной шутки
async function fetchRandomJoke() {
    try {
        const response = await fetch("https://v2.jokeapi.dev/joke/Any");
        const data = await response.json();
        const joke = data.type === "single" ? data.joke : `${data.setup} - ${data.delivery}`;
        return joke;
    } catch (error) {
        console.error("Ошибка загрузки шутки:", error);
        return "Случайная шутка";
    }
}

// Функция для генерации мема
async function fetchMeme() {
    try {
        const response = await fetch("https://api.imgflip.com/get_memes");
        const data = await response.json();
        const randomMeme = data.data.memes[Math.floor(Math.random() * data.data.memes.length)];
        return randomMeme.url;
    } catch (error) {
        console.error("Ошибка создания мема:", error);
        return "https://via.placeholder.com/300x200?text=Meme";
    }
}

// Функции для работы с сервером (JSONPlaceholder)
async function createCardOnServer(card) {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: card.name,
                body: card.description,
                userId: 1,
            }),
        });
        const data = await response.json();
        return data.id;
    } catch (error) {
        console.error("Ошибка создания карточки:", error);
        return null;
    }
}

async function updateCardOnServer(cardId, card) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${cardId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: cardId,
                title: card.name,
                body: card.description,
                userId: 1,
            }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Ошибка обновления карточки:", error);
        return null;
    }
}

async function patchCardOnServer(cardId, updates) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${cardId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Ошибка частичного обновления карточки:", error);
        return null;
    }
}

async function deleteCardOnServer(cardId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${cardId}`, {
            method: "DELETE",
        });
        return response.ok;
    } catch (error) {
        console.error("Ошибка удаления карточки:", error);
        return false;
    }
}

// Обёртки для вызова API с заглушками
window.apiFetchRandomImage = async function() {
    try {
        const placeholder = document.createElement("div");
        placeholder.className = "loading-placeholder";
        placeholder.textContent = "Загрузка аватарки...";
        document.getElementById("create-content").appendChild(placeholder);

        const url = await fetchRandomImage();
        currentCard.imageUrl = url;
        showCreateTab("avatar");
        saveAll();
        placeholder.remove();
    } catch (error) {
        alert("Ошибка получения аватарки: " + error.message);
    }
};

window.apiFetchRandomName = async function() {
    try {
        const placeholder = document.createElement("div");
        placeholder.className = "loading-placeholder";
        placeholder.textContent = "Загрузка имени...";
        document.getElementById("create-content").appendChild(placeholder);

        const name = await fetchRandomFantasyName();
        currentCard.name = name;
        document.getElementById("name-input").value = name;
        saveAll();
        placeholder.remove();
    } catch (error) {
        alert("Ошибка получения имени: " + error.message);
    }
};

window.apiFetchRandomAge = async function() {
    try {
        const placeholder = document.createElement("div");
        placeholder.className = "loading-placeholder";
        placeholder.textContent = "Загрузка возраста...";
        document.getElementById("create-content").appendChild(placeholder);

        const age = await fetchRandomAge();
        currentCard.age = age;
        document.getElementById("age-input").value = age;
        saveAll();
        placeholder.remove();
    } catch (error) {
        alert("Ошибка получения возраста: " + error.message);
    }
};

window.apiFetchRandomClass = async function() {
    try {
        const placeholder = document.createElement("div");
        placeholder.className = "loading-placeholder";
        placeholder.textContent = "Загрузка класса...";
        document.getElementById("create-content").appendChild(placeholder);

        const className = await fetchRandomClass();
        currentCard.remnantClass = className;
        document.getElementById("class-input").value = className;
        saveAll();
        placeholder.remove();
    } catch (error) {
        alert("Ошибка получения класса: " + error.message);
    }
};

window.apiFetchRandomSkills = async function() {
    try {
        const placeholder = document.createElement("div");
        placeholder.className = "loading-placeholder";
        placeholder.textContent = "Загрузка навыков...";
        document.getElementById("create-content").appendChild(placeholder);

        const skills = await fetchRandomSkills();
        currentCard.skills = skills;
        document.getElementById("skills-input").value = skills;
        saveAll();
        placeholder.remove();
    } catch (error) {
        alert("Ошибка получения навыков: " + error.message);
    }
};

window.apiFetchRandomDescription = async function() {
    try {
        const placeholder = document.createElement("div");
        placeholder.className = "loading-placeholder";
        placeholder.textContent = "Загрузка описания...";
        document.getElementById("create-content").appendChild(placeholder);

        const description = await fetchRandomDescription();
        currentCard.description = description;
        document.getElementById("desc-input").value = description;
        saveAll();
        placeholder.remove();
    } catch (error) {
        alert("Ошибка получения описания: " + error.message);
    }
};

window.apiFetchRandomJoke = async function() {
    try {
        const placeholder = document.createElement("div");
        placeholder.className = "loading-placeholder";
        placeholder.textContent = "Загрузка шутки...";
        document.getElementById("create-content").appendChild(placeholder);

        const joke = await fetchRandomJoke();
        currentCard.funPhrase = joke;
        document.getElementById("fun-input").value = joke;
        showCreateTab("fan");
        saveAll();
        placeholder.remove();
    } catch (error) {
        alert("Ошибка получения шутки: " + error.message);
    }
};

window.apiFetchMeme = async function() {
    try {
        const placeholder = document.createElement("div");
        placeholder.className = "loading-placeholder";
        placeholder.textContent = "Загрузка мема...";
        document.getElementById("create-content").appendChild(placeholder);

        const memeUrl = await fetchMeme();
        currentCard.memeUrl = memeUrl;
        showCreateTab("fan");
        saveAll();
        placeholder.remove();
    } catch (error) {
        alert("Ошибка получения мема: " + error.message);
    }
};