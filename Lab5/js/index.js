let isEditMode = false;
let initialState = null;

// Сохранение начального состояния при входе в режим редактирования
function saveInitialState() {
    initialState = {
        name: document.getElementById('character-name').innerText,
        image: document.getElementById('character-img').src,
        fields: Array.from(document.querySelectorAll('.field')).map(field => ({
            id: field.dataset.id,
            label: field.querySelector('label')?.innerText || '',
            content: field.querySelector('span')?.innerText || '',
            html: field.innerHTML
        }))
    };
}

document.getElementById('toggle-edit').addEventListener('click', () => {
    isEditMode = !isEditMode;
    document.getElementById('toggle-edit').textContent = isEditMode ? 'Сохранить' : 'Режим редактирования';
    document.getElementById('cancel-changes').classList.toggle('hidden', !isEditMode);
    if (isEditMode) saveInitialState();
    toggleEditMode(isEditMode);
});

function toggleEditMode(editMode) {
    const editableElements = document.querySelectorAll('[contenteditable]');
    editableElements.forEach(el => {
        el.contentEditable = editMode;
        if (editMode && el.innerText === el.getAttribute('data-placeholder')) {
            el.innerText = '';
        }
    });
    document.querySelector('.edit-image').classList.toggle('hidden', !editMode);
    document.querySelector('.add-field').classList.toggle('hidden', !editMode);
    document.querySelectorAll('.remove').forEach(btn => btn.classList.toggle('hidden', !editMode));
}

function cancelChanges() {
    if (!initialState) return;
    document.getElementById('character-name').innerText = initialState.name;
    document.getElementById('character-img').src = initialState.image;
    const fieldsContainer = document.querySelector('.info-fields');
    fieldsContainer.innerHTML = '';
    initialState.fields.forEach(field => {
        const div = document.createElement('div');
        div.className = 'field';
        div.dataset.id = field.id;
        div.innerHTML = field.html;
        fieldsContainer.appendChild(div);
    });
    isEditMode = false;
    document.getElementById('toggle-edit').textContent = 'Режим редактирования';
    document.getElementById('cancel-changes').classList.add('hidden');
    toggleEditMode(false);
}

function uploadImage() {
    const fileInput = document.getElementById('image-input');
    const file = fileInput.files[0];
    if (file && file.type.includes('image')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('character-img').src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        alert('Выберите изображение!');
    }
}

function removeImage() {
    document.getElementById('character-img').src = 'default-character.png';
}

function addTextField(withHeader) {
    const id = Date.now().toString();
    const field = document.createElement('div');
    field.className = 'field';
    field.dataset.id = id;
    field.innerHTML = withHeader
        ? `
            <label contenteditable="true" data-placeholder="Новый заголовок:"></label>
            <span contenteditable="true" data-placeholder="Значение"></span>
            <span class="remove hidden" onclick="removeField('${id}')">✖</span>
        `
        : `
            <span contenteditable="true" data-placeholder="Свободный текст"></span>
            <span class="remove hidden" onclick="removeField('${id}')">✖</span>
        `;
    document.querySelector('.info-fields').appendChild(field);
}

function addImageField(withHeader) {
    const id = Date.now().toString();
    const field = document.createElement('div');
    field.className = 'field';
    field.dataset.id = id;
    field.innerHTML = withHeader
        ? `
            <label contenteditable="true" data-placeholder="Заголовок изображения:"></label>
            <img src="default-image.png" alt="Изображение" style="max-width: 100px;">
            <input type="file" accept="image/*" onchange="uploadFieldImage(this)">
            <span class="remove hidden" onclick="removeField('${id}')">✖</span>
        `
        : `
            <img src="default-image.png" alt="Изображение" style="max-width: 100px;">
            <input type="file" accept="image/*" onchange="uploadFieldImage(this)">
            <span class="remove hidden" onclick="removeField('${id}')">✖</span>
        `;
    document.querySelector('.info-fields').appendChild(field);
}

function uploadFieldImage(input) {
    const file = input.files[0];
    if (file && file.type.includes('image')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            input.previousElementSibling.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function addListField(withHeader) {
    const id = Date.now().toString();
    const field = document.createElement('div');
    field.className = 'field';
    field.dataset.id = id;
    field.innerHTML = withHeader
        ? `
            <label contenteditable="true" data-placeholder="Заголовок списка:"></label>
            <ul contenteditable="true"><li>Элемент 1</li></ul>
            <span class="remove hidden" onclick="removeField('${id}')">✖</span>
        `
        : `
            <ul contenteditable="true"><li>Элемент 1</li></ul>
            <span class="remove hidden" onclick="removeField('${id}')">✖</span>
        `;
    document.querySelector('.info-fields').appendChild(field);
}

function removeField(id) {
    const field = document.querySelector(`.field[data-id="${id}"]`);
    if (field) field.remove();
}