"use strict";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        loadAll();
        saveMainAndContainer();
        navigateTo("main");
    } catch (error) {
        console.error("Ошибка при загрузке страницы:", error);
        navigateTo("main");
    }

    window.addEventListener("storage", (event) => {
        if (event.key === "remnants" || event.key === "containerCards" || event.key === "currentCard") {
            loadAll();
            if (currentPage === "main") renderMainPage();
            else if (currentPage === "container") renderContainerPage();
            else if (currentPage === "create") renderCreatePage(currentTab);
        }
    });

    document.body.addEventListener("click", (e) => {
        // Пропускаем обработку клика по крестику закрытия
        if (e.target.classList.contains("close-modal")) {
            return;
        }
        if (e.target.tagName === "H2" || e.target.tagName === "H3" || e.target.tagName === "STRONG") {
            if (isEditing || currentPage === "create") {
                const id = e.target.closest(".remnant-card, .custom-block")?.id;
                if (id) editHeader(id);
            }
        } else if (e.target.tagName === "P" && e.target.closest(".custom-block")) {
            if (isEditing || currentPage === "create") {
                const id = e.target.closest(".custom-block").id;
                if (id) editText(id);
            }
        }
    });
});

function editHeader(blockId) {
    const blockEl = document.getElementById(blockId);
    if (!blockEl) return;
    let headerEl = blockEl.querySelector("h2, h3, strong");
    if (!headerEl) return;
    const input = document.createElement("input");
    input.type = "text";
    input.value = headerEl.textContent;
    input.className = "edit-input";
    input.addEventListener("blur", () => {
        const newValue = input.value || "Заголовок";
        if (blockId.endsWith("-age")) {
            const remnant = remnants.find(r => r.id === blockId.split('-')[0]);
            if (remnant) remnant.ageLabel = newValue;
        } else if (blockId.endsWith("-class")) {
            const remnant = remnants.find(r => r.id === blockId.split('-')[0]);
            if (remnant) remnant.classLabel = newValue;
        } else if (blockId.endsWith("-skills")) {
            const remnant = remnants.find(r => r.id === blockId.split('-')[0]);
            if (remnant) remnant.skillsLabel = newValue;
        } else if (blockId.endsWith("-desc")) {
            const remnant = remnants.find(r => r.id === blockId.split('-')[0]);
            if (remnant) remnant.descriptionLabel = newValue;
        } else if (blockId.endsWith("-fun")) {
            const remnant = remnants.find(r => r.id === blockId.split('-')[0]) || containerCards.find(c => c.id === blockId.split('-')[0]) || currentCard;
            if (remnant) remnant.funPhrase = newValue;
        } else if (blockEl.classList.contains("header-text-block")) {
            const block = (currentCard?.blocks || []).find(b => b.id === blockId) || 
                         remnants.flatMap(r => r.blocks).find(b => b.id === blockId) || 
                         containerCards.flatMap(c => c.blocks).find(b => b.id === blockId);
            if (block) block.title = newValue;
        } else {
            const remnant = remnants.find(r => r.id === blockId) || containerCards.find(c => c.id === blockId) || currentCard;
            if (remnant) remnant.name = newValue;
        }
        headerEl.textContent = newValue;
        saveAll();
        if (currentPage === "create") showCreateTab(currentTab);
        else if (currentPage === "main") renderMainPage();
        else if (currentPage === "container") renderContainerPage();
    });
    headerEl.textContent = "";
    headerEl.appendChild(input);
    input.focus();
}

function editText(blockId) {
    const blockEl = document.getElementById(blockId);
    if (!blockEl) return;
    let pEl = blockEl.querySelector("p");
    if (!pEl) return;
    const textarea = document.createElement("textarea");
    textarea.value = pEl.textContent;
    textarea.className = "edit-textarea";
    textarea.addEventListener("blur", () => {
        const newValue = textarea.value || "Введите текст...";
        pEl.textContent = newValue;
        const block = (currentCard?.blocks || []).find(b => b.id === blockId) || 
                     remnants.flatMap(r => r.blocks).find(b => b.id === blockId) || 
                     containerCards.flatMap(c => c.blocks).find(b => b.id === blockId);
        if (block) block.content = newValue;
        saveAll();
        if (currentPage === "create") showCreateTab(currentTab);
        else if (currentPage === "main") renderMainPage();
        else if (currentPage === "container") renderContainerPage();
    });
    pEl.textContent = "";
    pEl.appendChild(textarea);
    textarea.focus();
}

function changeRemnantImage(remnantId, file) {
    if (!file || !file.type.includes("image")) {
        alert("Выбранный файл не является изображением!");
        return;
    }
    const reader = new FileReader();
    reader.onload = function(event) {
        const remnant = remnants.find(r => r.id === remnantId) || containerCards.find(c => c.id === remnantId) || (currentCard && currentCard.id === remnantId ? currentCard : null);
        if (remnant) {
            remnant.imageUrl = event.target.result;
            const imgElement = document.getElementById(`img-${remnantId}`);
            if (imgElement) imgElement.src = event.target.result;
            saveMainAndContainer();
            if (currentPage === "create") showCreateTab(currentTab);
        }
    };
    reader.onerror = function() {
        alert("Не удалось загрузить изображение.");
    };
    reader.readAsDataURL(file);
}

function changeMemeImage(remnantId, file) {
    if (!file || !file.type.includes("image")) {
        alert("Выбранный файл не является изображением!");
        return;
    }
    const reader = new FileReader();
    reader.onload = function(event) {
        const remnant = remnants.find(r => r.id === remnantId) || containerCards.find(c => c.id === remnantId) || (currentCard && currentCard.id === remnantId ? currentCard : null);
        if (remnant) {
            remnant.memeUrl = event.target.result;
            saveMainAndContainer();
            if (currentPage === "main") renderMainPage();
            else if (currentPage === "container") renderContainerPage();
            else if (currentPage === "create") showCreateTab(currentTab);
        }
    };
    reader.onerror = function() {
        alert("Не удалось загрузить изображение.");
    };
    reader.readAsDataURL(file);
}

function toggleEditMode() {
    if (isEditing) {
        remnants.forEach(remnant => remnant.enableEditing());
        containerCards.forEach(card => card.enableEditing());
        saveMainAndContainer();
        originalRemnants = JSON.parse(JSON.stringify(remnants));
        originalContainerCards = JSON.parse(JSON.stringify(containerCards));
    } else {
        originalRemnants = JSON.parse(JSON.stringify(remnants));
        originalContainerCards = JSON.parse(JSON.stringify(containerCards));
    }
    isEditing = !isEditing;
    if (currentPage === "main") renderMainPage();
    else if (currentPage === "container") renderContainerPage();
}

function cancelEditMode() {
    remnants = originalRemnants.map(d => {
        const blocks = (d.blocks || []).map(block => block.title ? new HeaderTextBlock(block.id, block.title, block.content) : new TextBlock(block.id, block.content));
        return new RemnantCard(d.id, d.name, d.age, d.remnantClass, d.skills, d.imageUrl, blocks, d.description, d.funPhrase, d.memeUrl, d.serverId);
    });
    containerCards = originalContainerCards.map(d => {
        const blocks = (d.blocks || []).map(block => block.title ? new HeaderTextBlock(block.id, block.title, block.content) : new TextBlock(block.id, block.content));
        return new RemnantCard(d.id, d.name, d.age, d.remnantClass, d.skills, d.imageUrl, blocks, d.description, d.funPhrase, d.memeUrl, d.serverId);
    });
    isEditing = false;
    if (currentPage === "main") renderMainPage();
    else if (currentPage === "container") renderContainerPage();
}

function addRemnant() {
    const newId = `remnant-${Date.now()}`;
    remnants.push(new RemnantCard(newId, "Новый персонаж", 1, "Неизвестно", "Отсутствуют", "https://cdn-icons-png.flaticon.com/512/6861/6861293.png"));
    saveMainAndContainer();
    renderMainPage();
}

function showBlockOptions(remnantId) {
    const existingOptions = document.querySelector(".block-options");
    if (existingOptions) return;
    const optionsHtml = `
        <div class="block-options">
            <span class="close-modal" onclick="document.querySelector('.block-options').remove()">X</span>
            <button onclick="addBlock('${remnantId}', 'text')">Поле ввода</button>
            <button onclick="addBlock('${remnantId}', 'header-text')">Поле ввода с заголовком</button>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", optionsHtml);
}

function addBlock(remnantId, type) {
    let targetArray = currentPage === "create" ? [currentCard] : currentPage === "container" ? containerCards : remnants;
    const remnant = targetArray.find(r => r.id === remnantId);
    if (!remnant) return;
    const newBlockId = `block-${Date.now()}`;
    if (type === "text") remnant.blocks.push(new TextBlock(newBlockId, "Введите текст..."));
    else if (type === "header-text") remnant.blocks.push(new HeaderTextBlock(newBlockId, "Новый заголовок", "Введите текст..."));
    document.querySelector(".block-options")?.remove();
    saveMainAndContainer();
    if (currentPage === "create") showCreateTab("description");
    else if (currentPage === "main") renderMainPage();
    else if (currentPage === "container") renderContainerPage();
}

function deleteRemnant(id) {
    remnants = remnants.filter(remnant => remnant.id !== id);
    saveMainAndContainer();
    renderMainPage();
}

async function deleteContainerCard(id) {
    const card = containerCards.find(c => c.id === id);
    if (card && card.serverId) {
        const success = await deleteCardOnServer(card.serverId);
        if (!success) {
            alert("Ошибка удаления карточки с сервера.");
            return;
        }
    }
    containerCards = containerCards.filter(card => card.id !== id);
    saveMainAndContainer();
    renderContainerPage();
}

function deleteBlock(id) {
    let targetArray = currentPage === "create" ? [currentCard] : currentPage === "container" ? containerCards : remnants;
    targetArray.forEach(remnant => {
        if (id === `${remnant.id}-age`) remnant.showAge = false;
        else if (id === `${remnant.id}-class`) remnant.showClass = false;
        else if (id === `${remnant.id}-skills`) remnant.showSkills = false;
        else if (id === `${remnant.id}-desc`) remnant.showDescription = false;
        else if (id === `${remnant.id}-fun`) {
            remnant.funPhrase = "";
            remnant.memeUrl = "";
        } else remnant.blocks = remnant.blocks.filter(block => block.id !== id);
    });
    saveMainAndContainer();
    if (currentPage === "create") showCreateTab("description");
    else if (currentPage === "main") renderMainPage();
    else if (currentPage === "container") renderContainerPage();
}

function addCardToMain(id) {
    const card = containerCards.find(c => c.id === id);
    if (card) {
        const newCard = new RemnantCard(
            `remnant-${Date.now()}`,
            card.name,
            card.age,
            card.remnantClass,
            card.skills,
            card.imageUrl,
            card.blocks.map(block => block instanceof HeaderTextBlock ? new HeaderTextBlock(block.id, block.title, block.content) : new TextBlock(block.id, block.content)),
            card.description,
            card.funPhrase,
            card.memeUrl,
            card.serverId
        );
        remnants.push(newCard);
        saveAll();
        navigateTo("main");
    }
}

function addEventListeners() {
    const editToggle = document.getElementById("edit-toggle");
    if (editToggle) editToggle.addEventListener("click", toggleEditMode);
    const cancelBtn = document.getElementById("cancel-btn");
    if (cancelBtn) cancelBtn.addEventListener("click", cancelEditMode);
    if (isEditing || currentPage === "create") {
        document.querySelectorAll(".delete-remnant").forEach(btn => btn.addEventListener("click", e => {
            e.stopPropagation();
            currentPage === "main" ? deleteRemnant(btn.dataset.id) : deleteContainerCard(btn.dataset.id);
        }));
        document.querySelectorAll(".add-block").forEach(btn => btn.addEventListener("click", e => {
            e.stopPropagation();
            showBlockOptions(btn.dataset.id);
        }));
        document.querySelectorAll(".delete-block").forEach(btn => btn.addEventListener("click", e => {
            e.stopPropagation();
            deleteBlock(e.target.dataset.id);
        }));
        document.querySelectorAll(".image-upload").forEach(input => input.addEventListener("change", e => {
            e.stopPropagation();
            changeRemnantImage(input.dataset.id, input.files[0]);
        }));
        document.querySelectorAll(".meme-upload").forEach(input => input.addEventListener("change", e => {
            e.stopPropagation();
            changeMemeImage(input.dataset.id, input.files[0]);
        }));
        document.querySelectorAll(".custom-block h3").forEach(h3 => h3.addEventListener("click", e => editHeader(h3.parentElement.id)));
        document.querySelectorAll(".custom-block p").forEach(p => p.addEventListener("click", e => editText(p.parentElement.id)));
    }
}

window.apiFetchRandomImage = async function() {
    const placeholder = document.createElement("div");
    placeholder.className = "loading-placeholder";
    placeholder.textContent = "Загрузка аватарки...";
    document.querySelector(".avatar-controls").appendChild(placeholder);
    try {
        currentCard.imageUrl = await fetchRandomImage();
        saveAll();
        showCreateTab("avatar");
    } catch (error) {
        alert("Ошибка получения аватарки: " + error.message);
    } finally {
        placeholder.remove();
    }
};

window.apiFetchRandomName = async function() {
    const placeholder = document.createElement("div");
    placeholder.className = "loading-placeholder";
    placeholder.textContent = "Загрузка имени...";
    document.getElementById("create-content").appendChild(placeholder);
    try {
        currentCard.name = await fetchRandomFantasyName();
        document.getElementById("name-input").value = currentCard.name;
        saveAll();
    } catch (error) {
        alert("Ошибка получения имени: " + error.message);
    } finally {
        placeholder.remove();
    }
};

window.apiFetchRandomAge = async function() {
    const placeholder = document.createElement("div");
    placeholder.className = "loading-placeholder";
    placeholder.textContent = "Загрузка возраста...";
    document.getElementById("create-content").appendChild(placeholder);
    try {
        currentCard.age = await fetchRandomAge();
        document.getElementById("age-input").value = currentCard.age;
        saveAll();
    } catch (error) {
        alert("Ошибка получения возраста: " + error.message);
    } finally {
        placeholder.remove();
    }
};

window.apiFetchRandomClass = async function() {
    const placeholder = document.createElement("div");
    placeholder.className = "loading-placeholder";
    placeholder.textContent = "Загрузка класса...";
    document.getElementById("create-content").appendChild(placeholder);
    try {
        currentCard.remnantClass = await fetchRandomClass();
        document.getElementById("class-input").value = currentCard.remnantClass;
        saveAll();
    } catch (error) {
        alert("Ошибка получения класса: " + error.message);
    } finally {
        placeholder.remove();
    }
};

window.apiFetchRandomSkills = async function() {
    const placeholder = document.createElement("div");
    placeholder.className = "loading-placeholder";
    placeholder.textContent = "Загрузка навыков...";
    document.getElementById("create-content").appendChild(placeholder);
    try {
        currentCard.skills = await fetchRandomSkills();
        document.getElementById("skills-input").value = currentCard.skills;
        saveAll();
    } catch (error) {
        alert("Ошибка получения навыков: " + error.message);
    } finally {
        placeholder.remove();
    }
};

window.apiFetchRandomDescription = async function() {
    const placeholder = document.createElement("div");
    placeholder.className = "loading-placeholder";
    placeholder.textContent = "Загрузка описания...";
    document.getElementById("create-content").appendChild(placeholder);
    try {
        currentCard.description = await fetchRandomDescription();
        document.getElementById("desc-input").value = currentCard.description;
        saveAll();
    } catch (error) {
        alert("Ошибка получения описания: " + error.message);
    } finally {
        placeholder.remove();
    }
};

window.apiFetchRandomJoke = async function() {
    const placeholder = document.createElement("div");
    placeholder.className = "loading-placeholder";
    placeholder.textContent = "Загрузка шутки...";
    document.getElementById("create-content").appendChild(placeholder);
    try {
        currentCard.funPhrase = await fetchRandomJoke();
        document.getElementById("fun-input").value = currentCard.funPhrase;
        saveAll();
        showCreateTab("fan");
    } catch (error) {
        alert("Ошибка получения шутки: " + error.message);
    } finally {
        placeholder.remove();
    }
};

window.apiFetchMeme = async function() {
    const placeholder = document.createElement("div");
    placeholder.className = "loading-placeholder";
    placeholder.textContent = "Загрузка мема...";
    document.getElementById("create-content").appendChild(placeholder);
    try {
        currentCard.memeUrl = await fetchMeme();
        saveAll();
        showCreateTab("fan");
    } catch (error) {
        alert("Ошибка получения мема: " + error.message);
    } finally {
        placeholder.remove();
    }
};

window.clearJoke = function() {
    currentCard.funPhrase = "";
    document.getElementById("fun-input").value = "";
    saveAll();
    showCreateTab("fan");
};

window.removeMeme = function() {
    currentCard.memeUrl = "";
    saveAll();
    showCreateTab("fan");
};