"use strict";

async function fetchRandomImage() {
    const randomSeed = Math.random().toString(36).substring(2, 15);
    return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${randomSeed}`;
}

async function fetchRandomFantasyName() {
    try {
        const response = await fetch("https://random-data-api.com/api/users/random_user");
        const data = await response.json();
        return data.first_name || "Безымянный";
    } catch (error) {
        console.error("Ошибка загрузки имени:", error);
        return "Безымянный";
    }
}

async function fetchRandomAge() {
    try {
        const response = await fetch("https://randomuser.me/api/");
        const data = await response.json();
        const dob = new Date(data.results[0].dob.date);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        return age > 0 ? age : 1;
    } catch (error) {
        console.error("Ошибка загрузки возраста:", error);
        return Math.floor(Math.random() * 80) + 18;
    }
}

async function fetchRandomClass() {
    try {
        const response = await fetch("https://random-word-api.vercel.app/api?words=1");
        const data = await response.json();
        return data[0].charAt(0).toUpperCase() + data[0].slice(1) || "Неизвестно";
    } catch (error) {
        console.error("Ошибка загрузки класса:", error);
        return "Неизвестно";
    }
}

async function fetchRandomSkills() {
    try {
        const response = await fetch("https://random-word-api.vercel.app/api?words=3");
        const data = await response.json();
        return data.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(", ");
    } catch (error) {
        console.error("Ошибка загрузки навыков:", error);
        return "Отсутствуют";
    }
}

async function fetchRandomDescription() {
    try {
        const response = await fetch("https://randomuser.me/api/");
        const data = await response.json();
        const user = data.results[0];
        const gender = user.gender === "male" ? "male" : "female";
        const city = user.location.city || "an unknown city";
        const country = user.location.country || "an unknown land";
        return `${currentCard.name} is a ${gender} character from ${city}, ${country}.`;
    } catch (error) {
        console.error("Ошибка загрузки описания:", error);
        return "Нет описания";
    }
}

async function fetchRandomJoke() {
    try {
        const response = await fetch("https://v2.jokeapi.dev/joke/Any");
        const data = await response.json();
        return data.type === "single" ? data.joke : `${data.setup} - ${data.delivery}`;
    } catch (error) {
        console.error("Ошибка загрузки шутки:", error);
        return "Случайная шутка";
    }
}

async function fetchMeme() {
    try {
        const response = await fetch("https://api.imgflip.com/get_memes");
        const data = await response.json();
        const randomMeme = data.data.memes[Math.floor(Math.random() * data.data.memes.length)];
        const img = new Image();
        img.src = randomMeme.url;
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            setTimeout(() => reject(new Error("Тайм-аут загрузки мема")), 5000);
        });
        return randomMeme.url;
    } catch (error) {
        console.error("Ошибка создания мема:", error);
        return "https://via.placeholder.com/300x200?text=Meme";
    }
}

async function fetchCardsFromServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?userId=1");
        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
        const data = await response.json();
        return data.map(item => ({
            id: `server-${item.id}`,
            name: item.title,
            description: item.body,
            serverId: item.id
        }));
    } catch (error) {
        console.error("Ошибка загрузки карточек:", error);
        return [];
    }
}

async function createCardOnServer(card) {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: card.name, body: card.description, userId: 1 })
        });
        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
        const data = await response.json();
        return data.id;
    } catch (error) {
        console.error("Ошибка создания карточки:", error);
        return null;
    }
}

async function updateCardOnServer(cardId, card) {
    try {
        if (cardId > 100) {
            console.warn(`ID ${cardId} превышает диапазон JSONPlaceholder. Обновление пропущено.`);
            return card;
        }
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${cardId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: cardId, title: card.name, body: card.description, userId: 1 })
        });
        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Ошибка обновления карточки:", error);
        return null;
    }
}

async function patchCardOnServer(cardId, updates) {
    try {
        if (cardId > 100) {
            console.warn(`ID ${cardId} превышает диапазон JSONPlaceholder. Обновление пропущено.`);
            return updates;
        }
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${cardId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates)
        });
        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Ошибка частичного обновления карточки:", error);
        return null;
    }
}

async function deleteCardOnServer(cardId) {
    try {
        if (cardId > 100) {
            console.warn(`ID ${cardId} превышает диапазон JSONPlaceholder. Удаление пропущено.`);
            return true;
        }
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${cardId}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
        return true;
    } catch (error) {
        console.error("Ошибка удаления карточки:", error);
        return false;
    }
}