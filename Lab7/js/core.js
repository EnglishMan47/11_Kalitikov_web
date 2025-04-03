"use strict";

let isEditing = false;
let remnants = [];
let containerCards = [];
let currentCard = null;
let currentPage = "main";
let currentTab = "avatar";
let originalRemnants = [];
let originalContainerCards = [];

class Block {
    constructor(id) {
        this.id = id;
    }
    render(editable = false) {
        return "";
    }
    enableEditing() {}
}

class RemnantCard extends Block {
    constructor(id, name, age, remnantClass, skills, imageUrl, blocks = [], description = "", funPhrase = "", memeUrl = "", serverId = null) {
        super(id);
        this.id = id;
        this.name = name;
        this.age = age;
        this.remnantClass = remnantClass || "Неизвестно";
        this.skills = skills || "Отсутствуют";
        this.description = description || "";
        this.imageUrl = imageUrl;
        this.blocks = blocks;
        this.funPhrase = funPhrase || "";
        this.memeUrl = memeUrl || "";
        this.showAge = true;
        this.showClass = true;
        this.showSkills = true;
        this.showDescription = true;
        this.ageLabel = "Возраст";
        this.classLabel = "Класс";
        this.skillsLabel = "Навыки";
        this.descriptionLabel = "Описание";
        this.serverId = serverId;
    }
    render(editable = false, withEditLink = false) {
        return `
            <div class="remnant-card" id="${this.id}">
                ${editable ? `<button class="delete-remnant" data-id="${this.id}">X</button>` : ""}
                <div class="character-info">
                    <label for="upload-${this.id}" class="image-label">
                        <img src="${this.imageUrl}" alt="${this.name}" class="character-image" id="img-${this.id}">
                        ${editable ? `<input type="file" id="upload-${this.id}" class="image-upload" data-id="${this.id}" accept="image/*">` : ""}
                    </label>
                    ${editable 
                        ? `<input type="text" class="remnant-name-input" data-id="${this.id}" value="${this.name}" placeholder="Имя">`
                        : `<h2 onclick="editHeader('${this.id}')">${this.name}</h2>`}
                </div>
                <div class="attributes-block">
                    <h3 onclick="${editable ? `editHeader('${this.id}-attr')` : ""}">Характеристики</h3>
                    <ul>
                        ${this.showAge ? `
                            <li>
                                <strong onclick="${editable ? `editHeader('${this.id}-age')` : ""}">${this.ageLabel}:</strong> 
                                ${editable 
                                    ? `<input type="number" class="attribute-input" data-id="${this.id}" data-key="age" value="${this.age}" min="1">`
                                    : this.age}
                                ${editable ? `<button class="delete-block" data-id="${this.id}-age">X</button>` : ""}
                            </li>` : ""}
                        ${this.showClass ? `
                            <li>
                                <strong onclick="${editable ? `editHeader('${this.id}-class')` : ""}">${this.classLabel}:</strong> 
                                ${editable 
                                    ? `<input type="text" class="attribute-input" data-id="${this.id}" data-key="class" value="${this.remnantClass}" placeholder="Неизвестно">`
                                    : this.remnantClass}
                                ${editable ? `<button class="delete-block" data-id="${this.id}-class">X</button>` : ""}
                            </li>` : ""}
                        ${this.showSkills ? `
                            <li>
                                <strong onclick="${editable ? `editHeader('${this.id}-skills')` : ""}">${this.skillsLabel}:</strong> 
                                ${editable 
                                    ? `<textarea class="attribute-input" data-id="${this.id}" data-key="skills" placeholder="Отсутствуют">${this.skills}</textarea>`
                                    : `<ul>${this.skills.split(',').map(skill => `<li>${skill.trim()}</li>`).join('')}</ul>`}
                                ${editable ? `<button class="delete-block" data-id="${this.id}-skills">X</button>` : ""}
                            </li>` : ""}
                        ${this.showDescription && this.description ? `
                            <li>
                                <strong onclick="${editable ? `editHeader('${this.id}-desc')` : ""}">${this.descriptionLabel}:</strong> 
                                ${editable 
                                    ? `<textarea class="attribute-input" data-id="${this.id}" data-key="description" placeholder="Нет описания">${this.description}</textarea>`
                                    : this.description}
                                ${editable ? `<button class="delete-block" data-id="${this.id}-desc">X</button>` : ""}
                            </li>` : ""}
                    </ul>
                </div>
                ${this.funPhrase || this.memeUrl ? `
                    <div class="attributes-block fun-block" id="${this.id}-fun">
                        ${editable ? `<button class="delete-block" data-id="${this.id}-fun">X</button>` : ""}
                        <h3 onclick="${editable ? `editHeader('${this.id}-fun')` : ""}">${this.funPhrase || "Без шутки"}</h3>
                        ${this.memeUrl ? `
                            <label for="meme-upload-${this.id}" class="image-label">
                                <img src="${this.memeUrl}" alt="Мем" class="character-image">
                                ${editable ? `<input type="file" id="meme-upload-${this.id}" class="meme-upload" data-id="${this.id}" accept="image/*">` : ""}
                            </label>` : ""}
                    </div>
                ` : ""}
                ${this.blocks.map(block => block.render(editable)).join('')}
                ${editable ? `<button class="add-block" data-id="${this.id}">+ Добавить элемент</button>` : ""}
                ${withEditLink ? `<button class="edit-card-btn" onclick="navigateTo('create', { edit: '${this.id}' })">Вернуться к работе</button>` : ""}
            </div>
        `;
    }
    async enableEditing() {
        const cardEl = document.getElementById(this.id);
        if (!cardEl) return;
        const nameInput = cardEl.querySelector(".remnant-name-input");
        if (nameInput) this.name = nameInput.value || "Безымянный";
        const ageInput = cardEl.querySelector(".attribute-input[data-key='age']");
        if (ageInput) this.age = parseInt(ageInput.value) || 1;
        const classInput = cardEl.querySelector(".attribute-input[data-key='class']");
        if (classInput) this.remnantClass = classInput.value || "Неизвестно";
        const skillsInput = cardEl.querySelector(".attribute-input[data-key='skills']");
        if (skillsInput) this.skills = skillsInput.value || "Отсутствуют";
        const descInput = cardEl.querySelector(".attribute-input[data-key='description']");
        if (descInput) this.description = descInput.value || "";
        const funBlock = cardEl.querySelector(`#${this.id}-fun h3`);
        if (funBlock) this.funPhrase = funBlock.textContent || "";
        this.blocks.forEach(block => block.enableEditing && block.enableEditing());
        if (this.serverId) {
            await updateCardOnServer(this.serverId, this);
            await patchCardOnServer(this.serverId, { title: this.name });
        }
        cardEl.outerHTML = this.render(isEditing);
        addEventListeners();
    }
}

class TextBlock extends Block {
    constructor(id, content) {
        super(id);
        this.content = content || "Введите текст...";
    }
    render(editable = false) {
        return `
            <div class="custom-block text-block" id="${this.id}">
                ${editable ? `<button class="delete-block" data-id="${this.id}">X</button>` : ""}
                <p ${editable ? `onclick="editText('${this.id}')"` : ""}>${this.content}</p>
            </div>
        `;
    }
    enableEditing() {
        const blockEl = document.getElementById(this.id);
        if (!blockEl) return;
        const pEl = blockEl.querySelector("p");
        if (pEl) this.content = pEl.textContent || "Введите текст...";
    }
}

class HeaderTextBlock extends Block {
    constructor(id, title, content) {
        super(id);
        this.title = title || "Новый заголовок";
        this.content = content || "Введите текст...";
    }
    render(editable = false) {
        return `
            <div class="custom-block header-text-block" id="${this.id}">
                ${editable ? `<button class="delete-block" data-id="${this.id}">X</button>` : ""}
                <h3 ${editable ? `onclick="editHeader('${this.id}')"` : ""}>${this.title}</h3>
                <p ${editable ? `onclick="editText('${this.id}')"` : ""}>${this.content}</p>
            </div>
        `;
    }
    enableEditing() {
        const blockEl = document.getElementById(this.id);
        if (!blockEl) return;
        const h3El = blockEl.querySelector("h3");
        const pEl = blockEl.querySelector("p");
        if (h3El) this.title = h3El.textContent || "Новый заголовок";
        if (pEl) this.content = pEl.textContent || "Введите текст...";
    }
}

function renderHeader() {
    let navButtons = "";
    if (currentPage === "main") {
        navButtons = `<div class="tab" onclick="navigateTo('container')">Окунуться в мир создания персонажей</div>`;
    } else if (currentPage === "container") {
        navButtons = `<div class="tab" onclick="navigateTo('main')">На главную</div>`;
    } else if (currentPage === "create") {
        navButtons = `
            <div class="tab" onclick="navigateTo('main')">На главную</div>
            <div class="tab" onclick="navigateTo('container')">Контейнер</div>
            <div class="tab ${currentTab === 'avatar' ? 'active' : ''}" onclick="showCreateTab('avatar')">Аватарка</div>
            <div class="tab ${currentTab === 'name' ? 'active' : ''}" onclick="showCreateTab('name')">Имя</div>
            <div class="tab ${currentTab === 'age' ? 'active' : ''}" onclick="showCreateTab('age')">Возраст</div>
            <div class="tab ${currentTab === 'description' ? 'active' : ''}" onclick="showCreateTab('description')">Описание</div>
            <div class="tab ${currentTab === 'fan' ? 'active' : ''}" onclick="showCreateTab('fan')">Фан</div>
            <div class="tab ${currentTab === 'finish' ? 'active' : ''}" onclick="showCreateTab('finish')">Предпросмотр</div>
        `;
    }
    return `
        <header class="controls">
            <nav class="tabs">
                ${navButtons}
            </nav>
            <div>
                ${(currentPage === "main" || currentPage === "container") ? `<button id="edit-toggle">${isEditing ? "Сохранить" : "Редактировать"}</button>` : ""}
                ${(currentPage === "main" || currentPage === "container") && isEditing ? `<button id="cancel-btn">Отмена</button>` : ""}
                ${currentPage === "main" ? `<button id="add-from-container" onclick="navigateTo('container', { select: true })">Добавить карточку из контейнера</button>` : ""}
            </div>
        </header>
    `;
}

function renderMainPage() {
    document.body.innerHTML = `
        ${renderHeader()}
        <div id="remnants-container">
            ${remnants.length === 0 ? `<p class="no-cards">Нет карточек</p>` : remnants.map(remnant => remnant.render(isEditing)).join('')}
            ${isEditing ? `<div class="add-card-placeholder" onclick="addRemnant()">Добавить карточку</div>` : ""}
        </div>
    `;
    addEventListeners();
}

function renderContainerPage(selectMode = false) {
    document.body.innerHTML = `
        ${renderHeader()}
        <h1 class="container-title">Контейнер карточек</h1>
        <div id="container-cards">
            ${containerCards.map(card => `
                <div class="remnant-card" id="${card.id}" onclick="${selectMode ? `addCardToMain('${card.id}')` : ""}">
                    ${card.render(isEditing, !selectMode && !isEditing)}
                </div>
            `).join('')}
            ${!selectMode && !isEditing ? `<div class="add-card-placeholder" onclick="navigateTo('create')">Создать персонажа</div>` : ""}
        </div>
    `;
    addEventListeners();
}

function renderCreatePage(activeTab) {
    currentTab = activeTab;
    document.body.innerHTML = `
        <div id="create-page">
            ${renderHeader()}
            <div id="create-content"></div>
        </div>
    `;
    showCreateTab(activeTab);
}

function showCreateTab(tab) {
    const content = document.getElementById("create-content");
    if (!content) return;
    currentTab = tab;
    const header = document.querySelector("header.controls");
    if (header) header.innerHTML = renderHeader().replace('<header class="controls">', '').replace('</header>', '');
    if (tab === "avatar") {
        content.innerHTML = `
            <h2 class="tab-title">Аватарка</h2>
            <div class="avatar-container">
                <div class="avatar-image">
                    ${currentCard.imageUrl ? `<img src="${currentCard.imageUrl}" alt="Аватар" class="character-image">` : "<p>Выберите изображение</p>"}
                </div>
                <div class="avatar-controls">
                    <input type="file" id="avatar-upload" accept="image/*">
                    <button class="api-btn fixed-btn" onclick="apiFetchRandomImage()">Случайная аватарка</button>
                </div>
            </div>
            <button class="create-btn fixed-btn" onclick="showCreateTab('name')">Далее</button>
        `;
        document.getElementById("avatar-upload").addEventListener("change", e => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    currentCard.imageUrl = reader.result;
                    saveAll();
                    showCreateTab("avatar");
                };
                reader.readAsDataURL(file);
            }
        });
    } else if (tab === "name") {
        content.innerHTML = `
            <h2 class="tab-title">Имя</h2>
            <div class="name-container">
                <input type="text" class="attribute-input name-input" id="name-input" value="${currentCard.name}">
                <button class="api-btn fixed-btn" onclick="apiFetchRandomName()">Случайное имя</button>
            </div>
            <button class="create-btn fixed-btn" onclick="showCreateTab('age')">Далее</button>
        `;
        document.getElementById("name-input").addEventListener("input", e => {
            currentCard.name = e.target.value || "Безымянный";
            saveAll();
        });
    } else if (tab === "age") {
        content.innerHTML = `
            <h2 class="tab-title">Возраст</h2>
            <div class="age-container">
                <input type="number" class="attribute-input age-input" id="age-input" value="${currentCard.age}" min="1">
                <button class="api-btn fixed-btn" onclick="apiFetchRandomAge()">Случайный возраст</button>
            </div>
            <button class="create-btn fixed-btn" onclick="showCreateTab('description')">Далее</button>
        `;
        document.getElementById("age-input").addEventListener("input", e => {
            currentCard.age = parseInt(e.target.value) || 1;
            saveAll();
        });
    } else if (tab === "description") {
        content.innerHTML = `
            <h2 class="tab-title">Описание</h2>
            <div class="description-container">
                <div class="form-group">
                    <label>Класс</label>
                    <input type="text" class="attribute-input" id="class-input" placeholder="Класс персонажа" value="${currentCard.remnantClass}">
                    <button class="api-btn fixed-btn" onclick="apiFetchRandomClass()">Случайный класс</button>
                </div>
                <div class="form-group">
                    <label>Навыки</label>
                    <textarea class="attribute-input" id="skills-input" placeholder="Навыки (через запятую)">${currentCard.skills}</textarea>
                    <button class="api-btn fixed-btn" onclick="apiFetchRandomSkills()">Случайные навыки</button>
                </div>
                <div class="form-group">
                    <label>Описание</label>
                    <textarea class="attribute-input" id="desc-input" placeholder="Описание">${currentCard.description}</textarea>
                    <button class="api-btn fixed-btn" onclick="apiFetchRandomDescription()">Случайное описание</button>
                </div>
                <div id="custom-blocks">
                    ${currentCard.blocks.map(block => block.render(true)).join('')}
                </div>
                <button class="api-btn fixed-btn" onclick="addCustomBlock()">Добавить элемент</button>
            </div>
            <button class="create-btn fixed-btn" onclick="showCreateTab('fan')">Далее</button>
        `;
        document.getElementById("class-input").addEventListener("input", e => { currentCard.remnantClass = e.target.value || "Неизвестно"; saveAll(); });
        document.getElementById("skills-input").addEventListener("input", e => { currentCard.skills = e.target.value || "Отсутствуют"; saveAll(); });
        document.getElementById("desc-input").addEventListener("input", e => { currentCard.description = e.target.value || ""; saveAll(); });
        document.querySelectorAll(".custom-block h3").forEach(h3 => h3.addEventListener("click", e => editHeader(h3.parentElement.id)));
        document.querySelectorAll(".custom-block p").forEach(p => p.addEventListener("click", e => editText(p.parentElement.id)));
        document.querySelectorAll(".delete-block").forEach(btn => btn.addEventListener("click", e => deleteBlock(e.target.dataset.id)));
    } else if (tab === "fan") {
        content.innerHTML = `
            <h2 class="tab-title">Фан</h2>
            <div class="fan-container">
                <div class="fan-left">
                    <textarea class="attribute-input fan-input" id="fun-input" placeholder="Введите веселую фразу">${currentCard.funPhrase}</textarea>
                    <div class="fan-options">
                        <button class="api-btn fixed-btn" onclick="apiFetchRandomJoke()">Получить шутку</button>
                        <button class="api-btn fixed-btn" onclick="apiFetchMeme()">Создать мем</button>
                        <input type="file" id="meme-upload" accept="image/*">
                    </div>
                </div>
                <div class="fan-right">
                    ${currentCard.funPhrase ? `<p>${currentCard.funPhrase}</p>` : ""}
                    ${currentCard.memeUrl ? `<img src="${currentCard.memeUrl}" alt="Мем" class="character-image">` : ""}
                </div>
            </div>
            <button class="create-btn fixed-btn" onclick="showCreateTab('finish')">Далее</button>
        `;
        document.getElementById("fun-input").addEventListener("input", e => { currentCard.funPhrase = e.target.value || ""; saveAll(); });
        document.getElementById("meme-upload").addEventListener("change", e => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    currentCard.memeUrl = reader.result;
                    saveAll();
                    showCreateTab("fan");
                };
                reader.readAsDataURL(file);
            }
        });
    } else if (tab === "finish") {
        content.innerHTML = `
            <h2 class="tab-title">Предпросмотр</h2>
            <div class="finish-container">
                <div class="finish-card">
                    ${currentCard.render()}
                </div>
                <div class="finish-buttons">
                    <button class="create-btn fixed-btn" onclick="saveToContainer()">Сохранить</button>
                    <button class="create-btn fixed-btn" onclick="saveToBoth()">Сохранить и выпустить</button>
                </div>
            </div>
        `;
    }
}

function addCustomBlock() {
    const newBlockId = `block-${Date.now()}`;
    const newBlock = new HeaderTextBlock(newBlockId, "Новый заголовок", "Введите текст...");
    currentCard.blocks.push(newBlock);
    saveAll();
    showCreateTab("description");
}

function saveAll() {
    localStorage.setItem("currentCard", JSON.stringify(currentCard));
    saveMainAndContainer();
}

function saveMainAndContainer() {
    localStorage.setItem("remnants", JSON.stringify(remnants));
    localStorage.setItem("containerCards", JSON.stringify(containerCards));
}

function loadAll() {
    const mainData = JSON.parse(localStorage.getItem("remnants") || "[]");
    remnants = mainData.map(d => {
        const blocks = (d.blocks || []).map(block => block.title ? new HeaderTextBlock(block.id, block.title, block.content) : new TextBlock(block.id, block.content));
        return new RemnantCard(d.id, d.name, d.age, d.remnantClass, d.skills, d.imageUrl, blocks, d.description, d.funPhrase, d.memeUrl, d.serverId);
    });

    const lolikCard = remnants.find(r => r.id === "remnant-1");
    if (!lolikCard) {
        remnants.push(new RemnantCard(
            "remnant-1",
            "Лёлек",
            45,
            "Отступник",
            "Заряжаемая хилка, Высокая выживаемость, Командная работа",
            "https://psv4.userapi.com/s/v1/d/HkPa9vhnPt3gvbGoQwMvkn9YnpZZFpjZdVvNDvTQbGRuroycbyS-Di2sbJJRz2Iho2bRv5DNQvNi4_drhYdy59mJc-2aVPzc0UR3w5vBXyf9uY9ocRmLQA/Lolik.png"
        ));
    } else if (lolikCard.remnantClass === "Неизвестно" || lolikCard.skills === "Отсутствуют") {
        lolikCard.remnantClass = "Отступник";
        lolikCard.skills = "Заряжаемая хилка, Высокая выживаемость, Командная работа";
    }

    const contData = JSON.parse(localStorage.getItem("containerCards") || "[]");
    containerCards = contData.map(d => {
        const blocks = (d.blocks || []).map(block => block.title ? new HeaderTextBlock(block.id, block.title, block.content) : new TextBlock(block.id, block.content));
        return new RemnantCard(d.id, d.name, d.age, d.remnantClass, d.skills, d.imageUrl, blocks, d.description, d.funPhrase, d.memeUrl, d.serverId);
    });

    const currData = JSON.parse(localStorage.getItem("currentCard") || "null");
    if (currData) {
        const blocks = (currData.blocks || []).map(block => block.title ? new HeaderTextBlock(block.id, block.title, block.content) : new TextBlock(block.id, block.content));
        currentCard = new RemnantCard(currData.id, currData.name, currData.age, currData.remnantClass, currData.skills, currData.imageUrl, blocks, currData.description, currData.funPhrase, currData.memeUrl, currData.serverId);
    } else {
        currentCard = null;
    }
}

async function saveToContainer() {
    const loadingPlaceholder = document.createElement("div");
    loadingPlaceholder.className = "loading-placeholder";
    loadingPlaceholder.textContent = "Сохранение...";
    document.getElementById("create-content").appendChild(loadingPlaceholder);

    const serverId = await createCardOnServer(currentCard);
    if (serverId) {
        currentCard.serverId = serverId;
        const existingCardIndex = containerCards.findIndex(c => c.id === currentCard.id);
        if (existingCardIndex !== -1) {
            containerCards[existingCardIndex] = currentCard;
        } else {
            containerCards.push(currentCard);
        }
        saveMainAndContainer();
        localStorage.removeItem("currentCard");
        navigateTo("container");
        loadingPlaceholder.remove();
    } else {
        loadingPlaceholder.textContent = "Ошибка сохранения карточки. Проверьте подключение.";
        setTimeout(() => loadingPlaceholder.remove(), 3000);
    }
}

async function saveToBoth() {
    const loadingPlaceholder = document.createElement("div");
    loadingPlaceholder.className = "loading-placeholder";
    loadingPlaceholder.textContent = "Сохранение...";
    document.getElementById("create-content").appendChild(loadingPlaceholder);

    const serverId = await createCardOnServer(currentCard);
    if (serverId) {
        currentCard.serverId = serverId;
        const existingCardIndex = containerCards.findIndex(c => c.id === currentCard.id);
        if (existingCardIndex !== -1) {
            containerCards[existingCardIndex] = currentCard;
        } else {
            containerCards.push(currentCard);
        }
        const newCard = new RemnantCard(
            `remnant-${Date.now()}`,
            currentCard.name,
            currentCard.age,
            currentCard.remnantClass,
            currentCard.skills,
            currentCard.imageUrl,
            currentCard.blocks.map(block => block instanceof HeaderTextBlock ? new HeaderTextBlock(block.id, block.title, block.content) : new TextBlock(block.id, block.content)),
            currentCard.description,
            currentCard.funPhrase,
            currentCard.memeUrl,
            currentCard.serverId
        );
        remnants.push(newCard);
        saveMainAndContainer();
        localStorage.removeItem("currentCard");
        navigateTo("main");
        loadingPlaceholder.remove();
    } else {
        loadingPlaceholder.textContent = "Ошибка сохранения карточки. Проверьте подключение.";
        setTimeout(() => loadingPlaceholder.remove(), 3000);
    }
}

function navigateTo(page, params = {}) {
    if (currentPage === "create" && currentCard) {
        const existingCardIndex = containerCards.findIndex(c => c.id === currentCard.id);
        if (existingCardIndex !== -1) {
            containerCards[existingCardIndex] = currentCard;
        }
        saveMainAndContainer();
    }
    currentPage = page;
    if (page === "main") {
        renderMainPage();
    } else if (page === "container") {
        renderContainerPage(params.select);
    } else if (page === "create") {
        if (params.edit) {
            const cardToEdit = containerCards.find(c => c.id === params.edit);
            if (cardToEdit) {
                currentCard = new RemnantCard(
                    cardToEdit.id,
                    cardToEdit.name,
                    cardToEdit.age,
                    cardToEdit.remnantClass,
                    cardToEdit.skills,
                    cardToEdit.imageUrl,
                    cardToEdit.blocks.map(block => block instanceof HeaderTextBlock ? new HeaderTextBlock(block.id, block.title, block.content) : new TextBlock(block.id, block.content)),
                    cardToEdit.description,
                    cardToEdit.funPhrase,
                    cardToEdit.memeUrl,
                    cardToEdit.serverId
                );
            } else {
                currentCard = new RemnantCard(params.edit);
            }
        } else {
            currentCard = new RemnantCard(`card-${Date.now()}`, "", 1, "Неизвестно", "Отсутствуют", "https://via.placeholder.com/300x200?text=Avatar");
        }
        saveAll();
        renderCreatePage("avatar");
    }
}