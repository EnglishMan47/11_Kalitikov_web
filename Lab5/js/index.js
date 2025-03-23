"use strict";

let isEditing = false;
let remnants = [];

class Block {
    constructor(id) {
        this.id = id;
    }

    render() {
        return "";
    }

    enableEditing() {}
}

class RemnantCard extends Block {
    constructor(id, name, age, remnantClass, skills, imageUrl, blocks = []) {
        super(id);
        this.name = name;
        this.age = age;
        this.remnantClass = remnantClass || "Неизвестно";
        this.skills = skills || "Отсутствуют";
        this.imageUrl = imageUrl;
        this.blocks = blocks;
    }

    render() {
        return `
            <div class="remnant-card" id="${this.id}">
                ${isEditing ? `<button class="delete-remnant" data-id="${this.id}">X</button>` : ""}
                <div class="character-info">
                    <label for="upload-${this.id}" class="image-label">
                        <img src="${this.imageUrl}" alt="${this.name}" class="character-image" id="img-${this.id}">
                        ${isEditing ? `<input type="file" id="upload-${this.id}" class="image-upload" data-id="${this.id}" accept="image/*">` : ""}
                    </label>
                    ${isEditing 
                        ? `<input type="text" class="remnant-name-input" data-id="${this.id}" value="${this.name}" placeholder="Имя">`
                        : `<h2>${this.name}</h2>`}
                </div>
                <div class="attributes-block">
                    <h3>Характеристики</h3>
                    <ul>
                        <li><strong>Возраст:</strong> 
                            ${isEditing 
                                ? `<input type="number" class="attribute-input" data-id="${this.id}" data-key="age" value="${this.age}" min="1">`
                                : this.age}
                        </li>
                        <li><strong>Класс:</strong> 
                            ${isEditing 
                                ? `<input type="text" class="attribute-input" data-id="${this.id}" data-key="class" value="${this.remnantClass}" placeholder="Неизвестно">`
                                : this.remnantClass}
                        </li>
                        <li><strong>Навыки:</strong> 
                            ${isEditing 
                                ? `<textarea class="attribute-input" data-id="${this.id}" data-key="skills" placeholder="Отсутствуют">${this.skills}</textarea>`
                                : `<ul>${this.skills.split(',').map(skill => `<li>${skill.trim()}</li>`).join('')}</ul>`}
                        </li>
                    </ul>
                </div>
                ${this.blocks.map(block => block.render()).join('')}
                ${isEditing ? `<button class="add-block" data-id="${this.id}">+ Добавить элемент</button>` : ""}
            </div>
        `;
    }

    enableEditing() {
        const nameInput = document.querySelector(`.remnant-name-input[data-id="${this.id}"]`);
        if (nameInput) this.name = nameInput.value || "Безымянный";

        const ageInput = document.querySelector(`.attribute-input[data-id="${this.id}"][data-key="age"]`);
        if (ageInput) {
            const age = parseInt(ageInput.value);
            if (age > 0) this.age = age;
            else {
                alert("Возраст должен быть положительным числом! Повторите ввод.");
                ageInput.value = this.age;
            }
        }

        const classInput = document.querySelector(`.attribute-input[data-id="${this.id}"][data-key="class"]`);
        if (classInput) this.remnantClass = classInput.value || "Неизвестно";

        const skillsInput = document.querySelector(`.attribute-input[data-id="${this.id}"][data-key="skills"]`);
        if (skillsInput) this.skills = skillsInput.value || "Отсутствуют";

        this.blocks.forEach(block => block.enableEditing());
    }
}

class ImageBlock extends Block {
    constructor(id, content) {
        super(id);
        this.content = content;
    }

    render() {
        return `
            <div class="custom-block" id="${this.id}">
                ${isEditing ? `<button class="delete-block" data-id="${this.id}">X</button>` : ""}
                <img src="${this.content}" class="character-image">
            </div>
        `;
    }
}

class TextBlock extends Block {
    constructor(id, content) {
        super(id);
        this.content = content;
    }

    render() {
        return `
            <div class="custom-block text-block" id="${this.id}">
                ${isEditing ? `<button class="delete-block" data-id="${this.id}">X</button>` : ""}
                <p ${isEditing ? `onclick="editText('${this.id}')"` : ""}>${this.content}</p>
            </div>
        `;
    }

    enableEditing() {
        const contentInput = document.querySelector(`textarea[data-id="${this.id}"][data-field="content"]`);
        if (contentInput) this.content = contentInput.value || "Введите текст...";
    }
}

class HeaderTextBlock extends Block {
    constructor(id, title, content) {
        super(id);
        this.title = title;
        this.content = content;
    }

    render() {
        return `
            <div class="custom-block header-text-block" id="${this.id}">
                ${isEditing ? `<button class="delete-block" data-id="${this.id}">X</button>` : ""}
                <h3 ${isEditing ? `onclick="editTitle('${this.id}')"` : ""}>${this.title}</h3>
                <p ${isEditing ? `onclick="editText('${this.id}')"` : ""}>${this.content}</p>
            </div>
        `;
    }

    enableEditing() {
        const titleInput = document.querySelector(`input[data-id="${this.id}"][data-field="title"]`);
        if (titleInput) this.title = titleInput.value || "Новый заголовок";
        const contentInput = document.querySelector(`textarea[data-id="${this.id}"][data-field="content"]`);
        if (contentInput) this.content = contentInput.value || "Введите текст...";
    }
}

function renderRemnants() {
    document.body.innerHTML = `
        <div class="controls">
            <button id="edit-toggle">${isEditing ? "Сохранить" : "Редактировать"}</button>
            ${isEditing ? `<button id="cancel-btn">Отмена</button>` : ""}
        </div>
        <div id="remnants-container">
            ${remnants.map(remnant => remnant.render()).join('')}
            ${isEditing ? `<div class="add-card-placeholder" onclick="addRemnant()">Добавить карточку</div>` : ""}
        </div>
    `;

    document.getElementById("edit-toggle").addEventListener("click", toggleEditMode);
    if (isEditing) {
        document.getElementById("cancel-btn").addEventListener("click", cancelEditMode);
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
        document.querySelectorAll(".attribute-input, .remnant-name-input").forEach(input => {
            input.addEventListener("focus", () => {
                if (input.placeholder === input.value) input.value = "";
            });
        });
    }
}

function editText(blockId) {
    const block = remnants.flatMap(r => r.blocks).find(b => b.id === blockId);
    if (!block || block instanceof ImageBlock) return;

    const element = document.querySelector(`p[onclick="editText('${blockId}')"]`);
    if (!element || element.querySelector("textarea")) return;

    const textarea = document.createElement("textarea");
    textarea.className = "block-content-input";
    textarea.dataset.id = blockId;
    textarea.dataset.field = "content";
    textarea.placeholder = "Введите текст...";
    textarea.value = block.content === "Введите текст..." ? "" : block.content;

    textarea.addEventListener("input", () => {
        block.content = textarea.value || "Введите текст...";
    });

    textarea.addEventListener("blur", () => {
        block.content = textarea.value || "Введите текст...";
        renderRemnants();
    });

    element.innerHTML = "";
    element.appendChild(textarea);
    textarea.focus();
}

function editTitle(blockId) {
    const block = remnants.flatMap(r => r.blocks).find(b => b.id === blockId);
    if (!block || !(block instanceof HeaderTextBlock)) return;

    const element = document.querySelector(`h3[onclick="editTitle('${blockId}')"]`);
    if (!element || element.querySelector("input")) return;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "block-title-input";
    input.dataset.id = blockId;
    input.dataset.field = "title";
    input.placeholder = "Новый заголовок";
    input.value = block.title === "Новый заголовок" ? "" : block.title;

    input.addEventListener("input", () => {
        block.title = input.value || "Новый заголовок";
    });

    input.addEventListener("blur", () => {
        block.title = input.value || "Новый заголовок";
        renderRemnants();
    });

    element.innerHTML = "";
    element.appendChild(input);
    input.focus();
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
            document.getElementById(`img-${remnantId}`).src = event.target.result;
            saveToLocalStorage();
        }
    };
    reader.readAsDataURL(file);
}

function toggleEditMode() {
    if (isEditing) {
        remnants.forEach(remnant => remnant.enableEditing());
        saveToLocalStorage();
    }
    isEditing = !isEditing;
    renderRemnants();
}

function cancelEditMode() {
    loadFromLocalStorage();
    isEditing = false;
    renderRemnants();
}

function addRemnant() {
    const newId = `remnant-${Date.now()}`;
    remnants.push(new RemnantCard(newId, "Новый персонаж", 1, "Неизвестно", "Отсутствуют", "https://via.placeholder.com/300x200?text=Remnant+Character"));
    saveToLocalStorage();
    renderRemnants();
}

function showBlockOptions(remnantId, x, y) {
    const existingOptions = document.querySelector(".block-options");
    if (existingOptions) existingOptions.remove();

    const optionsHtml = `
        <div class="block-options" style="top: ${y + 10}px; left: ${x}px;">
            <button onclick="addBlock('${remnantId}', 'image')">Картинка</button>
            <button onclick="addBlock('${remnantId}', 'text')">Поле ввода</button>
            <button onclick="addBlock('${remnantId}', 'header-text')">Поле ввода с заголовком</button>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", optionsHtml);
}

function addBlock(remnantId, type) {
    const remnant = remnants.find(r => r.id === remnantId);
    if (!remnant) return;

    const newBlockId = `block-${Date.now()}`;
    if (type === "image") {
        const formHtml = `
            <div class="block-form" style="top: ${window.scrollY + 100}px; left: 50%; transform: translateX(-50%);">
                <input type="file" id="block-image-${newBlockId}" accept="image/*">
                <button onclick="uploadBlockImage('${remnantId}', '${newBlockId}')">Загрузить картинку</button>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", formHtml);
    } else if (type === "text") {
        remnant.blocks.push(new TextBlock(newBlockId, "Введите текст..."));
        document.querySelector(".block-options")?.remove();
        saveToLocalStorage();
        renderRemnants();
    } else if (type === "header-text") {
        remnant.blocks.push(new HeaderTextBlock(newBlockId, "Новый заголовок", "Введите текст..."));
        document.querySelector(".block-options")?.remove();
        saveToLocalStorage();
        renderRemnants();
    }
}

function uploadBlockImage(remnantId, blockId) {
    const fileInput = document.getElementById(`block-image-${blockId}`);
    const file = fileInput.files[0];
    if (!file || !file.type.includes("image")) {
        alert("Выбранный файл не является изображением!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const remnant = remnants.find(r => r.id === remnantId);
        if (remnant) {
            remnant.blocks.push(new ImageBlock(blockId, event.target.result));
            document.querySelector(".block-options")?.remove();
            document.querySelector(".block-form")?.remove();
            saveToLocalStorage();
            renderRemnants();
        }
    };
    reader.readAsDataURL(file);
}

function deleteRemnant(id) {
    remnants = remnants.filter(remnant => remnant.id !== id);
    saveToLocalStorage();
    renderRemnants();
}

function deleteBlock(id) {
    remnants.forEach(remnant => {
        remnant.blocks = remnant.blocks.filter(block => block.id !== id);
    });
    saveToLocalStorage();
    renderRemnants();
}

function saveToLocalStorage() {
    const data = remnants.map(remnant => ({
        id: remnant.id,
        name: remnant.name,
        age: remnant.age,
        remnantClass: remnant.remnantClass,
        skills: remnant.skills,
        imageUrl: remnant.imageUrl,
        blocks: remnant.blocks.map(block => {
            if (block instanceof ImageBlock) {
                return { id: block.id, type: "image", content: block.content };
            } else if (block instanceof TextBlock) {
                return { id: block.id, type: "text", content: block.content };
            } else if (block instanceof HeaderTextBlock) {
                return { id: block.id, type: "header-text", title: block.title, content: block.content };
            }
        })
    }));
    localStorage.setItem("remnantsData", JSON.stringify(data));
}

function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem("remnantsData"));

    if (data && data.length > 0) {
        remnants = data.map(remnantData => new RemnantCard(
            remnantData.id,
            remnantData.name,
            remnantData.age,
            remnantData.remnantClass,
            remnantData.skills,
            remnantData.imageUrl,
            remnantData.blocks.map(b => {
                if (b.type === "image") {
                    return new ImageBlock(b.id, b.content);
                } else if (b.type === "text") {
                    return new TextBlock(b.id, b.content);
                } else if (b.type === "header-text") {
                    return new HeaderTextBlock(b.id, b.title, b.content);
                }
            })
        ));
    } else {
        const initialRemnant = new RemnantCard(
            "remnant-1",
            "Лёлек",
            45,
            "Отступник",
            "Заряжаемая хилка, Высокая выживаемость, Командная работа",
            "https://psv4.userapi.com/s/v1/d/HkPa9vhnPt3gvbGoQwMvkn9YnpZZFpjZdVvNDvTQbGRuroycbyS-Di2sbJJRz2Iho2bRv5DNQvNi4_drhYdy59mJc-2aVPzc0UR3w5vBXyf9uY9ocRmLQA/Lolik.png"
        );
        remnants.push(initialRemnant);
        saveToLocalStorage();
    }

    renderRemnants();
}

document.addEventListener("DOMContentLoaded", loadFromLocalStorage);