/**
 * Устанавливает cookie с указанным именем, значением и сроком действия.
 * @param {string} name - Имя cookie.
 * @param {string} value - Значение cookie.
 * @param {number} days - Количество дней до истечения срока действия.
 */
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
}

/**
 * Получает значение cookie по имени.
 * @param {string} name - Имя cookie.
 * @returns {string|null} Значение cookie или null, если cookie не найден.
 */
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

export { setCookie, getCookie };