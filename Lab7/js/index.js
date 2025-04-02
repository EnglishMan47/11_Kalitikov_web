"use strict";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Загружаем локальные данные
        loadAll();

        // Сохраняем изменения и переходим на главную страницу
        saveMainAndContainer();
        navigateTo("main");
    } catch (error) {
        console.error("Ошибка при загрузке страницы:", error);
        // Если произошла ошибка, все равно отображаем главную страницу с локальными данными
        navigateTo("main");
    }

    // Добавляем глобальные обработчики событий
    window.addEventListener("storage", (event) => {
        if (event.key === "remnants" || event.key === "containerCards" || event.key === "currentCard") {
            loadAll();
            if (currentPage === "main") renderMainPage();
            else if (currentPage === "container") renderContainerPage();
            else if (currentPage === "create") renderCreatePage(currentTab);
        }
    });

    // Обработка кликов по заголовкам для редактирования
    document.body.addEventListener("click", (e) => {
        if (e.target.tagName === "H2" || e.target.tagName === "H3" || e.target.tagName === "STRONG") {
            if (isEditing) {
                const id = e.target.closest(".remnant-card, .custom-block")?.id;
                if (id) editHeader(id);
            }
        } else if (e.target.tagName === "P" && e.target.closest(".custom-block")) {
            if (isEditing) {
                const id = e.target.closest(".custom-block").id;
                if (id) editText(id);
            }
        }
    });
});