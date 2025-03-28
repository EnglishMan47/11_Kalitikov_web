"use strict";

// Глобальные переменные
let isEditing = false;
let remnants = [];
let containerCards = [];
let currentCard = null;
let currentPage = "main";
let currentTab = "avatar";

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
    constructor(id, name, age, remnantClass, skills, imageUrl, blocks = [], description = "", funPhrase = "", memeUrl = "") {
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
        this.serverId = null;
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
                    <div class="attributes-block">
                        <h3>${this.funPhrase || "Без шутки"}</h3>
                        ${this.memeUrl ? `<img src="${this.memeUrl}" alt="Мем" class="character-image">` : ""}
                    </div>
                ` : ""}
                ${this.blocks.map(block => block.render(editable)).join('')}
                ${editable ? `<button class="add-block" data-id="${this.id}">+ Добавить элемент</button>` : ""}
            </div>
        `;
    }
    async enableEditing() {
        const cardEl = document.getElementById(this.id);
        if (!cardEl) return;
        const nameInput = cardEl.querySelector(".remnant-name-input");
        if (nameInput) this.name = nameInput.value || "Безымянный";
        const ageInput = cardEl.querySelector(".attribute-input[data-key='age']");
        if (ageInput) {
            const age = parseInt(ageInput.value);
            this.age = age > 0 ? age : 1;
        }
        const classInput = cardEl.querySelector(".attribute-input[data-key='class']");
        if (classInput) this.remnantClass = classInput.value || "Неизвестно";
        const skillsInput = cardEl.querySelector(".attribute-input[data-key='skills']");
        if (skillsInput) this.skills = skillsInput.value || "Отсутствуют";
        const descInput = cardEl.querySelector(".attribute-input[data-key='description']");
        if (descInput) this.description = descInput.value || "";
        this.blocks.forEach(block => block.enableEditing && block.enableEditing());

        if (this.serverId) {
            await updateCardOnServer(this.serverId, this);
            await patchCardOnServer(this.serverId, { title: this.name });
        }
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
                <p onclick="${editable ? `editText('${this.id}')` : ""}">${this.content}</p>
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
                <h3 onclick="${editable ? `editHeader('${this.id}')` : ""}">${this.title}</h3>
                <p onclick="${editable ? `editText('${this.id}')` : ""}">${this.content}</p>
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
        navButtons = `
            <div class="tab" onclick="navigateTo('main')">На главную</div>
            <div class="tab" onclick="navigateTo('container')">Контейнер карточек</div>
        `;
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
            ${remnants.map(remnant => remnant.render(isEditing)).join('')}
            ${isEditing ? `<div class="add-card-placeholder" onclick="addRemnant()">Добавить карточку</div>` : ""}
        </div>
    `;
    if (document.getElementById("edit-toggle"))
        document.getElementById("edit-toggle").addEventListener("click", toggleEditMode);
    if (document.getElementById("cancel-btn"))
        document.getElementById("cancel-btn").addEventListener("click", cancelEditMode);

    if (isEditing) {
        document.querySelectorAll(".delete-remnant").forEach(btn => {
            btn.addEventListener("click", e => deleteRemnant(e.target.dataset.id));
        });
        document.querySelectorAll(".add-block").forEach(btn => {
            btn.addEventListener("click", e => showBlockOptions(e.target.dataset.id, e.clientX, e.clientY));
        });
        document.querySelectorAll(".delete-block").forEach(btn => {
            btn.addEventListener("click", e => deleteBlock(e.target.dataset.id));
        });
        document.querySelectorAll(".image-upload").forEach(input => {
            input.addEventListener("change", e => changeRemnantImage(e.target.dataset.id, e.target.files[0]));
        });
    }
}

function renderContainerPage(selectMode = false) {
    document.body.innerHTML = `
        ${renderHeader()}
        <div id="container-cards">
            ${containerCards.map(card => `
                <div class="remnant-card" id="${card.id}">
                    ${card.render(isEditing || selectMode)}
                    ${!selectMode && !isEditing ? `<button class="edit-card-btn" onclick="navigateTo('create', { edit: '${card.id}' })">Вернуться к работе</button>` : ""}
                </div>
            `).join('')}
            ${!selectMode && !isEditing ? `<div class="add-card-placeholder" onclick="navigateTo('create')">Создать персонажа</div>` : ""}
            ${selectMode ? containerCards.map(card => `
                <button class="add-to-main" data-id="${card.id}">Добавить на главную</button>
            `).join('') : ""}
        </div>
    `;
    if (document.getElementById("edit-toggle"))
        document.getElementById("edit-toggle").addEventListener("click", toggleEditMode);
    if (document.getElementById("cancel-btn"))
        document.getElementById("cancel-btn").addEventListener("click", cancelEditMode);
    if (isEditing) {
        document.querySelectorAll(".delete-remnant").forEach(btn => {
            btn.addEventListener("click", e => deleteContainerCard(e.target.dataset.id));
        });
        document.querySelectorAll(".delete-block").forEach(btn => {
            btn.addEventListener("click", e => deleteBlock(e.target.dataset.id));
        });
    }
    if (selectMode) {
        document.querySelectorAll(".add-to-main").forEach(btn => {
            btn.addEventListener("click", e => addCardToMain(e.target.dataset.id));
        });
    }
}

function renderCreatePage(activeTab) {
    currentTab = activeTab;
    document.body.innerHTML = `
        <div id="create-page">
            ${renderHeader()}
            <div id="create-content"></div>
        </div>
    `;
    const content = document.getElementById("create-content");
    if (!content) return;
    showCreateTab(activeTab);
}

function showCreateTab(tab) {
    const content = document.getElementById("create-content");
    if (!content) return;

    currentTab = tab;
    const header = document.querySelector("header.controls");
    if (header) {
        header.innerHTML = renderHeader().replace('<header class="controls">', '').replace('</header>', '');
    }

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
        const uploadInput = document.getElementById("avatar-upload");
        if (uploadInput) {
            uploadInput.addEventListener("change", e => {
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
        }
    } else if (tab === "name") {
        content.innerHTML = `
            <h2 class="tab-title">Имя</h2>
            <div class="name-container">
                <input type="text" class="attribute-input name-input" id="name-input" value="${currentCard.name}">
                <button class="api-btn fixed-btn" onclick="apiFetchRandomName()">Случайное имя</button>
            </div>
            <button class="create-btn fixed-btn" onclick="showCreateTab('age')">Далее</button>
        `;
        const nameInput = document.getElementById("name-input");
        if (nameInput) {
            nameInput.addEventListener("input", e => {
                currentCard.name = e.target.value || "Безымянный";
                saveAll();
            });
        }
    } else if (tab === "age") {
        content.innerHTML = `
            <h2 class="tab-title">Возраст</h2>
            <div class="age-container">
                <input type="number" class="attribute-input age-input" id="age-input" value="${currentCard.age}" min="1">
                <button class="api-btn fixed-btn" onclick="apiFetchRandomAge()">Случайный возраст</button>
            </div>
            <button class="create-btn fixed-btn" onclick="showCreateTab('description')">Далее</button>
        `;
        const ageInput = document.getElementById("age-input");
        if (ageInput) {
            ageInput.addEventListener("input", e => {
                currentCard.age = parseInt(e.target.value) || 1;
                saveAll();
            });
        }
    } else if (tab === "description") {
        content.innerHTML = `
            <h2 class="tab-title">Описание</h2>
            <div class="description-container">
                <div class="form-group">
                    <label>Класс</label>
                    <input type="text" class="attribute-input description-input" id="class-input" placeholder="Класс персонажа" value="${currentCard.remnantClass}">
                    <button class="api-btn fixed-btn" onclick="apiFetchRandomClass()">Случайный класс</button>
                </div>
                <div class="form-group">
                    <label>Навыки</label>
                    <textarea class="attribute-input description-input" id="skills-input" placeholder="Навыки (через запятую)">${currentCard.skills}</textarea>
                    <button class="api-btn fixed-btn" onclick="apiFetchRandomSkills()">Случайные навыки</button>
                </div>
                <div class="form-group">
                    <label>Описание</label>
                    <textarea class="attribute-input description-input" id="desc-input" placeholder="Описание">${currentCard.description}</textarea>
                    <button class="api-btn fixed-btn" onclick="apiFetchRandomDescription()">Случайное описание</button>
                </div>
                <div id="custom-blocks">
                    ${currentCard.blocks.map(block => block.render(true)).join('')}
                </div>
                <button class="api-btn fixed-btn" onclick="addCustomBlock()">Добавить элемент</button>
            </div>
            <button class="create-btn fixed-btn" onclick="showCreateTab('fan')">Далее</button>
        `;
        const classInput = document.getElementById("class-input");
        const skillsInput = document.getElementById("skills-input");
        const descInput = document.getElementById("desc-input");
        if (classInput) classInput.addEventListener("input", e => { currentCard.remnantClass = e.target.value || "Неизвестно"; saveAll(); });
        if (skillsInput) skillsInput.addEventListener("input", e => { currentCard.skills = e.target.value || "Отсутствуют"; saveAll(); });
        if (descInput) descInput.addEventListener("input", e => { currentCard.description = e.target.value || ""; saveAll(); });

        // Добавляем обработчики для редактирования заголовков и текста
        document.querySelectorAll(".custom-block h3").forEach(h3 => {
            h3.addEventListener("click", e => {
                e.preventDefault();
                editHeader(h3.parentElement.id);
            });
        });
        document.querySelectorAll(".custom-block p").forEach(p => {
            p.addEventListener("click", e => {
                e.preventDefault();
                editText(p.parentElement.id);
            });
        });
        document.querySelectorAll(".delete-block").forEach(btn => {
            btn.addEventListener("click", e => deleteBlock(e.target.dataset.id));
        });
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
        const funInput = document.getElementById("fun-input");
        const memeUpload = document.getElementById("meme-upload");
        if (funInput) funInput.addEventListener("input", e => { currentCard.funPhrase = e.target.value || ""; saveAll(); });
        if (memeUpload) {
            memeUpload.addEventListener("change", e => {
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
        }
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
    currentCard.blocks.push(new HeaderTextBlock(newBlockId, "Новый заголовок", "Введите текст..."));
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
    remnants = mainData.map(d => new RemnantCard(d.id, d.name, d.age, d.remnantClass, d.skills, d.imageUrl, d.blocks || [], d.description, d.funPhrase, d.memeUrl));
    
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
    containerCards = contData.map(d => new RemnantCard(d.id, d.name, d.age, d.remnantClass, d.skills, d.imageUrl, d.blocks || [], d.description, d.funPhrase, d.memeUrl));
    const currData = JSON.parse(localStorage.getItem("currentCard") || "null");
    currentCard = currData ? new RemnantCard(currData.id, currData.name, currData.age, currData.remnantClass, currData.skills, currData.imageUrl, currData.blocks || [], currData.description, currData.funPhrase, currData.memeUrl) : null;
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
    } else {
        loadingPlaceholder.textContent = "Ошибка сохранения карточки. Попробуйте снова.";
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
        remnants.push(currentCard);
        saveMainAndContainer();
        localStorage.removeItem("currentCard");
        navigateTo("main");
    } else {
        loadingPlaceholder.textContent = "Ошибка сохранения карточки. Попробуйте снова.";
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
            currentCard = containerCards.find(c => c.id === params.edit) || new RemnantCard(params.edit);
        } else {
            currentCard = new RemnantCard(`card-${Date.now()}`, "", 1, "Неизвестно", "Отсутствуют", "https://via.placeholder.com/300x200?text=Avatar");
        }
        saveAll();
        renderCreatePage("avatar");
    }
}

function editHeader(blockId) {
    const blockEl = document.getElementById(blockId);
    if (!blockEl) return;
    let headerEl = blockEl.querySelector("h2, h3, strong");
    if (!headerEl) return;
    const input = document.createElement("input");
    input.type = "text";
    input.value = headerEl.textContent;
    input.addEventListener("blur", () => {
        const newValue = input.value || "Заголовок";
        if (blockId.endsWith("-age")) remnants.find(r => r.id === blockId.split('-')[0]).ageLabel = newValue;
        else if (blockId.endsWith("-class")) remnants.find(r => r.id === blockId.split('-')[0]).classLabel = newValue;
        else if (blockId.endsWith("-skills")) remnants.find(r => r.id === blockId.split('-')[0]).skillsLabel = newValue;
        else if (blockId.endsWith("-desc")) remnants.find(r => r.id === blockId.split('-')[0]).descriptionLabel = newValue;
        else if (blockEl.classList.contains("header-text-block")) {
            const block = currentCard.blocks.find(b => b.id === blockId);
            if (block) block.title = newValue;
        }
        headerEl.textContent = newValue;
        if (currentPage === "create") {
            showCreateTab(currentTab);
        } else if (currentPage === "main") {
            renderMainPage();
        } else if (currentPage === "container") {
            renderContainerPage();
        }
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
    textarea.addEventListener("blur", () => {
        const newValue = textarea.value || "Введите текст...";
        pEl.textContent = newValue;
        if (blockEl.classList.contains("text-block") || blockEl.classList.contains("header-text-block")) {
            const block = currentCard.blocks.find(b => b.id === blockId);
            if (block) block.content = newValue;
        }
        if (currentPage === "create") {
            showCreateTab(currentTab);
        } else if (currentPage === "main") {
            renderMainPage();
        } else if (currentPage === "container") {
            renderContainerPage();
        }
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
        const remnant = remnants.find(r => r.id === remnantId);
        if (remnant) {
            remnant.imageUrl = event.target.result;
            const imgElement = document.getElementById(`img-${remnantId}`);
            if (imgElement) {
                imgElement.src = event.target.result;
            }
            saveMainAndContainer();
        }
    };
    reader.onerror = function() {
        alert("Не удалось загрузить изображение. Попробуйте другой файл.");
    };
    reader.readAsDataURL(file);
}

function toggleEditMode() {
    if (isEditing) {
        remnants.forEach(remnant => remnant.enableEditing());
        containerCards.forEach(card => card.enableEditing());
        saveMainAndContainer();
    }
    isEditing = !isEditing;
    if (currentPage === "main") renderMainPage();
    else if (currentPage === "container") renderContainerPage();
}

function cancelEditMode() {
    loadAll();
    isEditing = false;
    if (currentPage === "main") renderMainPage();
    else if (currentPage === "container") renderContainerPage();
}

function addRemnant() {
    const newId = `remnant-${Date.now()}`;
    remnants.push(new RemnantCard(newId, "Новый персонаж", 1, "Неизвестно", "Отсутствуют", "https://via.placeholder.com/300x200?text=Avatar"));
    saveMainAndContainer();
    renderMainPage();
}

function showBlockOptions(remnantId, x, y) {
    const existingOptions = document.querySelector(".block-options");
    if (existingOptions) existingOptions.remove();

    const optionsHtml = `
        <div class="block-options" style="top: ${y + 10}px; left: ${x}px;">
            <button onclick="addBlock('${remnantId}', 'text')">Поле ввода</button>
            <button onclick="addBlock('${remnantId}', 'header-text')">Поле ввода с заголовком</button>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", optionsHtml);
}

function addBlock(remnantId, type) {
    let targetArray = remnants;
    if (currentPage === "create") {
        targetArray = [currentCard];
    } else if (currentPage === "container") {
        targetArray = containerCards;
    }

    const remnant = targetArray.find(r => r.id === remnantId);
    if (!remnant) return;

    const newBlockId = `block-${Date.now()}`;
    if (type === "text") {
        remnant.blocks.push(new TextBlock(newBlockId, "Введите текст..."));
    } else if (type === "header-text") {
        remnant.blocks.push(new HeaderTextBlock(newBlockId, "Новый заголовок", "Введите текст..."));
    }
    document.querySelector(".block-options")?.remove();
    saveMainAndContainer();
    if (currentPage === "create") {
        showCreateTab("description");
    } else if (currentPage === "main") {
        renderMainPage();
    } else if (currentPage === "container") {
        renderContainerPage();
    }
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
    let targetArray = remnants;
    if (currentPage === "create") {
        targetArray = [currentCard];
    } else if (currentPage === "container") {
        targetArray = containerCards;
    }

    targetArray.forEach(remnant => {
        if (id === `${remnant.id}-age`) remnant.showAge = false;
        else if (id === `${remnant.id}-class`) remnant.showClass = false;
        else if (id === `${remnant.id}-skills`) remnant.showSkills = false;
        else if (id === `${remnant.id}-desc`) remnant.showDescription = false;
        else remnant.blocks = remnant.blocks.filter(block => block.id !== id);
    });
    saveMainAndContainer();
    if (currentPage === "create") {
        showCreateTab("description");
    } else if (currentPage === "main") {
        renderMainPage();
    } else if (currentPage === "container") {
        renderContainerPage();
    }
}

function addCardToMain(id) {
    const card = containerCards.find(c => c.id === id);
    if (card) {
        remnants.push(card);
        saveMainAndContainer();
        navigateTo("main");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadAll();
    navigateTo("main");
});