"use strict";

async function fetchRandomImage() {
    const randomSeed = Math.random().toString(36).substring(2, 15);
    const imageUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${randomSeed}`;
    return imageUrl;
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
        age = age > 0 ? age : 1;
        return age;
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
        const skills = data.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(", ");
        return skills;
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
        const description = `${currentCard.name} is a ${gender} character from ${city}, ${country}.`;
        return description;
    } catch (error) {
        console.error("Ошибка загрузки описания:", error);
        return "Нет описания";
    }
}

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
        return "https://cdn-icons-png.flaticon.com/512/6861/6861293.png";
    }
}

async function fetchCardsFromServer() {
    try {
        console.log("GET: Загрузка карточек с сервера...");
        const response = await fetch("https://reqres.in/api/users");
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        const data = await response.json();
        console.log("Получены карточки:", data);
        return data.data.map(item => ({
            id: `server-${item.id}`,
            name: item.first_name + " " + item.last_name,
            description: item.email,
            serverId: item.id
        }));
    } catch (error) {
        console.error("Ошибка загрузки карточек:", error);
        return [];
    }
}

async function createCardOnServer(card) {
    try {
        console.log("POST: Создание карточки на сервере:", card);
        const response = await fetch("https://reqres.in/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: card.name,
                job: "character"
            }),
        });
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        const data = await response.json();
        console.log("Карточка создана (POST):", data);
        return data.id;
    } catch (error) {
        console.error("Ошибка создания карточки (POST):", error);
        return null;
    }
}

async function updateCardOnServer(cardId, card) {
    try {
        console.log("PUT: Полное обновление карточки:", cardId, card);
        const response = await fetch(`https://reqres.in/api/users/${cardId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: card.name,
                job: "character"
            }),
        });
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        const data = await response.json();
        console.log("Карточка обновлена (PUT):", data);
        return data;
    } catch (error) {
        console.error("Ошибка обновления (PUT):", error);
        return null;
    }
}

async function putCardOnServer(serverId, cardData) {
    try {
        console.log("PUT: Полное обновление карточки на сервере с ID:", serverId, "данные:", cardData);
        const response = await fetch(`https://reqres.in/api/users/${serverId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cardData)
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log("PUT: Успешно обновлено на сервере:", data);
        return true;
    } catch (error) {
        console.error("Ошибка PUT-запроса:", error);
        return false;
    }
}
window.putCardOnServer = putCardOnServer;

async function patchCardOnServer(serverId, updatedFields) {
    try {
        console.log("PATCH: Обновление карточки на сервере с ID:", serverId, "изменённые поля:", updatedFields);
        const response = await fetch(`https://reqres.in/api/users/${serverId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFields)
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log("PATCH: Успешно обновлено на сервере:", data);
        return true;
    } catch (error) {
        console.error("Ошибка PATCH-запроса:", error);
        return false;
    }
}
window.patchCardOnServer = patchCardOnServer;

async function deleteCardOnServer(serverId) {
    try {
        console.log("Отправка DELETE-запроса для serverId:", serverId);
        const response = await fetch(`https://reqres.in/api/users/${serverId}`, {
            method: "DELETE",
        });
        if (response.status === 204) {
            console.log("DELETE: Успешно удалено с сервера:", serverId);
            return true;
        }
        console.error("Ошибка DELETE: сервер вернул статус", response.status);
        return false;
    } catch (error) {
        console.error("Ошибка при DELETE-запросе:", error);
        return false;
    }
}

window.apiFetchRandomImage = async function() {
    try {
        console.log("GET: Запрос случайного изображения с DiceBear...");
        const imageUrl = await fetchRandomImage();
        currentCard.imageUrl = imageUrl;
        saveAll(); 
        showCreateTab("avatar");
    } catch (error) {
        console.error("Ошибка загрузки изображения:", error);
        return null;
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
        const placeholder = document.getElementById("class-placeholder");
        if (placeholder) placeholder.style.display = "block";

        const className = await fetchRandomClass();
        currentCard.remnantClass = className;
        document.getElementById("class-input").value = className;
        saveAll();
        if (placeholder) placeholder.style.display = "none";
    } catch (error) {
        alert("Ошибка получения класса: " + error.message);
        const placeholder = document.getElementById("class-placeholder");
        if (placeholder) placeholder.style.display = "none";
    }
};

window.apiFetchRandomSkills = async function() {
    try {
        const placeholder = document.getElementById("skills-placeholder");
        if (placeholder) placeholder.style.display = "block";

        const skills = await fetchRandomSkills();
        currentCard.skills = skills;
        document.getElementById("skills-input").value = skills;
        saveAll(); 
        if (placeholder) placeholder.style.display = "none";
    } catch (error) {
        alert("Ошибка получения навыков: " + error.message);
        const placeholder = document.getElementById("skills-placeholder");
        if (placeholder) placeholder.style.display = "none";
    }
};

window.apiFetchRandomDescription = async function() {
    try {
        const placeholder = document.getElementById("desc-placeholder");
        if (placeholder) placeholder.style.display = "block";

        const description = await fetchRandomDescription();
        currentCard.description = description;
        const descInput = document.getElementById("desc-input");
        if (descInput) descInput.value = description;
        saveAll(); 
        if (placeholder) placeholder.style.display = "none";
    } catch (error) {
        console.error("Ошибка получения описания:", error);
        alert("Не удалось загрузить описание. Попробуйте снова.");
        const placeholder = document.getElementById("desc-placeholder");
        if (placeholder) placeholder.style.display = "none";
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

window.clearJoke = function() {
    currentCard.funPhrase = "";
    const funInput = document.getElementById("fun-input");
    if (funInput) funInput.value = "";
    saveAll();
    showCreateTab("fan");
};

window.removeMeme = function() {
    currentCard.memeUrl = "";
    saveAll(); 
    showCreateTab("fan");
};

async function syncPartialCard(changedFields = {}) {
    if (!currentCard) {
        console.warn("syncPartialCard: currentCard отсутствует");
        return;
    }
    const updates = {};
    for (const [key, value] of Object.entries(changedFields)) {
        updates[key] = currentCard[key];
    }
    if (Object.keys(updates).length === 0) {
        console.log("Нет изменений для синхронизации");
        return;
    }
    if (currentCard.serverId) {
        console.log("PATCH: Синхронизация изменений для serverId:", currentCard.serverId);
        await patchCardOnServer(currentCard.serverId, updates);
    } else {
        console.log("POST: Создание новой карточки на сервере");
        const serverId = await createCardOnServer(currentCard);
        if (serverId) {
            currentCard.serverId = serverId;
            console.log("POST: Установлен serverId:", serverId);
        }
    }
}

async function fullSyncCurrentCard() {
    if (!currentCard) return;
    if (currentCard.serverId) {
        await updateCardOnServer(currentCard.serverId, currentCard);
    } else {
        const serverId = await createCardOnServer(currentCard);
        if (serverId) {
            currentCard.serverId = serverId;
        }
    }
}