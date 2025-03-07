let health = 100;
let fatigue = 0;
let hunger = 50;
let thirst = 100;
let hungerTimer = 0;
let thirstTimer = 0;

let canteenTrayTime = null;

const salads = ["Фруктовый", "Цезарь", "Оливье", "Греческий", "Мимоза", "Ничего"];
const desserts = ["Чизкейк", "Медовик", "Сметанник", "Корзинка с ягодами", "Шоколадный", "Ничего"];
const firstCourses = ["Гороховый суп", "Солянка", "Борщ", "Доширак", "Том Ям", "Ничего"];
const mainCourses = ["Котлеты", "Куриная ножка", "Бифштекс", "Фуа-Гра", "Бургер", "Ничего"];
const sideDishes = ["Рис", "Гречка", "Плов", "Картофель фри", "Картофельное пюре", "Ничего"];
const pastries = ["Пицца", "Пирожок", "Круассан", "Беляш", "Чебурек", "Ничего"];
const drinks = ["Чай", "Вода (бесплатно)", "Компот", "Сок", "Узвар", "Ничего"];

const costs = {
  "Фруктовый": 50, "Цезарь": 90, "Оливье": 60, "Греческий": 75, "Мимоза": 80,
  "Чизкейк": 70, "Медовик": 95, "Сметанник": 100, "Корзинка с ягодами": 85, "Шоколадный": 90,
  "Гороховый суп": 65, "Солянка": 75, "Борщ": 80, "Доширак": 40, "Том Ям": 80,
  "Котлеты": 100, "Куриная ножка": 120, "Бифштекс": 110, "Фуа-Гра": 400, "Бургер": 250,
  "Рис": 40, "Гречка": 40, "Плов": 40, "Картофель фри": 40, "Картофельное пюре": 40,
  "Пицца": 60, "Пирожок": 20, "Круассан": 30, "Беляш": 50, "Чебурек": 50,
  "Чай": 15, "Компот": 20, "Сок": 20, "Узвар": 20, "Вода": 0, "Ничего": 0
};

let currentTime = 6 * 60; 
let balance = 10000;
let inventory = [];
let alarmTime = 6 * 60;
let musicPlaying = false;
let imbaEnergyEffect = false;

function formatTime(minutes) {
  let hrs = Math.floor(minutes / 60);
  let mins = minutes % 60;
  return `${hrs < 10 ? "0" + hrs : hrs}:${mins < 10 ? "0" + mins : mins}`;
}

function statusString() {
  return `Время: ${formatTime(currentTime)}\nЗдоровье: ${health}\nУсталость: ${fatigue}\nГолод: ${hunger}\nЖажда: ${thirst}\nБаланс: ${balance} деняк\n\n`;
}

function endGame(message) {
  alert(message);
  resetGame();

}

function advanceTime(minutes) {
  currentTime += minutes;
  hungerTimer += minutes;
  thirstTimer += minutes;
  while (hungerTimer >= 6) {
    hunger = Math.min(100, hunger + 1);
    hungerTimer -= 6;
  }
  while (thirstTimer >= 6) {
    thirst = Math.min(100, thirst + 1);
    thirstTimer -= 6;
  }
  if (hunger >= 100 && thirst >= 100 && fatigue >= 100) {
    health = Math.max(0, health - 10);
    if (health <= 0) {
      endGame("Твоё здоровье упало до 0. Игра окончена.");
      return;
    }
  }
  if (currentTime >= 1440) currentTime = currentTime % 1440;
}

function addToInventory(item) {
  if (inventory.includes(item)) {
    alert(`У тебя уже есть ${item} в инвентаре.`);
  } else {
    inventory.push(item);
    alert(`Ты получил: ${item}.`);
  }
}

function applyMealEffects(effects) {
  hunger = Math.max(0, hunger + effects.hunger);
  thirst = Math.max(0, thirst + effects.thirst);
  fatigue = Math.max(0, fatigue + effects.fatigue);
}

function useInventory() {
  advanceTime(1);
  if (inventory.length === 0) {
    alert(statusString() + "Инвентарь пуст.");
    return null;
  }

  let inventoryList = "Инвентарь:\n" + inventory.map((item, index) => `${index + 1}. ${item}`).join("\n");
  let choice = prompt(statusString() + inventoryList + "\nВыбери номер предмета или 0 для выхода:");
  if (!choice) return null;

  let selectedIndex = parseInt(choice) - 1;
  if (choice === "0") return null;
  if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= inventory.length) {
    alert(statusString() + "Неверный выбор.");
    return null;
  }

  let selectedItem = inventory[selectedIndex];
  alert(statusString() + `Ты выбрал: ${selectedItem}.`);

  const coffeeEffects = {
    "Латте": { thirst: -15, fatigue: -10 },
    "Эспрессо": { thirst: -10, fatigue: -15 },
    "Американо": { thirst: -15, fatigue: -10 },
    "Капучино": { thirst: -15, fatigue: -10 },
    "Кисель": { thirst: -20, hunger: -5 },
    "Чай": { thirst: -15, fatigue: -5 },
    "Кротовуха": { special: "restart" }
  };

  const snackEffects = {
    "Шоколадный батончик": { hunger: -10 },
    "Чипсы": { hunger: -10 },
    "Энергетик": { fatigue: -15 },
    "Прикормка": { hunger: -10 },
    "Вафли": { hunger: -10 },
    "Шаурма": { hunger: -20 }
  };

  if (coffeeEffects[selectedItem]) {
    let effect = coffeeEffects[selectedItem];
    if (effect.special === "restart") {
      alert("При употреблении кротовухи игра перезапускается!");
      inventory.splice(selectedIndex, 1);
      resetGame();
      myFunc();
      return;
    }
    if (effect.thirst) thirst = Math.max(0, thirst + effect.thirst);
    if (effect.fatigue) fatigue = Math.max(0, fatigue + effect.fatigue);
    if (effect.hunger) hunger = Math.max(0, hunger + effect.hunger);
    alert(`Ты выпил ${selectedItem}. Жажда ${effect.thirst || 0}, усталость ${effect.fatigue || 0}, голод ${effect.hunger || 0}.`);
    inventory.splice(selectedIndex, 1);
  } else if (snackEffects[selectedItem]) {
    let effect = snackEffects[selectedItem];
    hunger = Math.max(0, hunger + effect.hunger);
    if (effect.fatigue) fatigue = Math.max(0, fatigue + effect.fatigue);
    alert(`Ты употребил ${selectedItem}. Голод ${effect.hunger}${effect.fatigue ? `, усталость ${effect.fatigue}` : ""}.`);
    inventory.splice(selectedIndex, 1);
  } else if (selectedItem === "Телефон") {
    phoneMenu();
  } else if (selectedItem === "Ноутбук") {
    laptopMenu();
  }

  return selectedItem;
}

function alarmClock() {
  let alarms = 0;
  while (alarms < 10) {
    let action = prompt(statusString() + "Будильник звонит!\n1. Отключить\n2. Отложить (5 мин)");
    if (!action || !["1", "2"].includes(action.trim())) {
      alert("Неверный ввод.");
      continue;
    }
    if (action === "1") {
      alert("Будильник отключён.");
      break;
    } else {
      alarms++;
      advanceTime(5);
      alert(`Будильник отложен. Попытка ${alarms}/10`);
    }
  }
  if (alarms >= 10) alert("Будильник отключился сам.");
  let isAwake = confirm(statusString() + "Встать с кровати?");
  if (!isAwake) {
    alert("Ты уснул после будильника. Сейчас 12:00. Ты проспал пары.");
    currentTime = 12 * 60;
    if (!inventory.includes("Телефон")) addToInventory("Телефон");
  }
  return isAwake;
}

function mealEvent(mealType) {
  let drinkOptions = ["Чай", "Кофе", "Цикорий", "Энергетик Imba Energy", "Вода", "Ничего"];
  let drinkPrompt = drinkOptions.map((drink, index) => `${index + 1}. ${drink}`).join("\n");
  let drinkChoice = prompt(statusString() + `Начинается ${mealType}.\nВыбери напиток:\n${drinkPrompt}`);
  let selectedDrink = drinkOptions[parseInt(drinkChoice) - 1] || "Ничего";

  let effects = {
    "Чай": { thirst: -10, fatigue: -5 },
    "Кофе": { thirst: -15, fatigue: -10 },
    "Цикорий": { thirst: -8, fatigue: -3 },
    "Энергетик Imba Energy": { thirst: -20, fatigue: -20, imbaEnergy: true },
    "Вода": { thirst: -15 },
    "Ничего": {}
  };
  let drinkEffect = effects[selectedDrink] || {};

  let actionChoice = prompt(
    statusString() +
    "Что делать?\n1. Просто есть (30 мин)\n2. Смотреть YouTube (40 мин)\n3. Открыть инвентарь\n4. Прекратить"
  );

  switch (actionChoice) {
    case "1":
      advanceTime(30);
      hunger = Math.max(0, hunger - 20);
      thirst = Math.max(0, thirst + (drinkEffect.thirst || 0));
      fatigue = Math.max(0, fatigue + (drinkEffect.fatigue || 0));
      if (drinkEffect.imbaEnergy) imbaEnergyEffect = true;
      alert(statusString() + `Ты поел.\nГолод -20, жажда ${drinkEffect.thirst || 0}, усталость ${drinkEffect.fatigue || 0}${drinkEffect.imbaEnergy ? "\nПолучен баф: Без утомляемости" : ""}`);
      break;
    case "2":
      advanceTime(40);
      hunger = Math.max(0, hunger - 50);
      thirst = Math.max(0, thirst + (drinkEffect.thirst || 0));
      fatigue = Math.max(0, fatigue + (drinkEffect.fatigue || 0));
      if (drinkEffect.imbaEnergy) imbaEnergyEffect = true;
      alert(statusString() + `Ты поел, смотря YouTube.\nГолод -50, жажда ${drinkEffect.thirst || 0}, усталость ${drinkEffect.fatigue || 0}${drinkEffect.imbaEnergy ? "\nПолучен баф: Без утомляемости" : ""}`);
      break;
    case "3":
      useInventory();
      break;
    case "4":
      alert(statusString() + "Ты прекратил есть. Бонусы не применены.");
      break;
    default:
      alert(statusString() + "Неверный выбор.");
  }
}

function phoneMenu() {
  let continueMenu = true;
  while (continueMenu) {
    let choice = prompt(statusString() + "Телефон:\n1. Убрать телефон\n2. YouTube\n3. ВКонтакте\n4. Телеграмм\n5. Электрички\n6. ПеньковБанк\n7. Музыка\n8. Будильник");
    if (!choice) {
      alert("Неверный ввод. Вернуться назад.");
      return;
    }
    advanceTime(1);
    switch (choice.trim()) {
      case "1": continueMenu = false; break;
      case "2": alert("Ты смотришь YouTube."); break;
      case "3": vkMenu(); break;
      case "4": telegramMenu(); break;
      case "5": alert("Расписание электричек утром: 7:15, 7:29, 7:54, 8:10\nРасписание электричек вечером: 17:17, 17:22, 17:37, 18:02"); break;
      case "6": alert(`Баланс: ${balance} деняк.`); break;
      case "7": musicMenu(); break;
      case "8": alarmMenu(); break;
      default: alert("Неверный выбор.");
    }
  }
}

function vkMenu() {
  while (true) {
    let choice = prompt(statusString() + "ВКонтакте:\n1. Посмотреть чатики\n2. Почитать мемы\n3. Написать друзьям\n4. Выйти");
    if (!choice) return;
    advanceTime(1);
    switch (choice.trim()) {
      case "1": alert("Ты посмотрел все чатики. Ничего нового... Как обычно."); break;
      case "2": alert("Ты почитал мемы."); break;
      case "3": alert("Ты написал друзьям."); break;
      case "4": return;
      default: alert("Неверный выбор.");
    }
  }
}

function telegramMenu() {
  while (true) {
    let choice = prompt(statusString() + "Телеграмм:\n1. Канал\n2. Чатики\n3. Написать друзьям\n4. Выйти");
    if (!choice) return;
    advanceTime(1);
    switch (choice.trim()) {
      case "1": channelActions(); break;
      case "2": alert("Ты читаешь все чатики."); break;
      case "3": alert("Ты написал друзьям."); break;
      case "4": return;
      default: alert("Неверный выбор.");
    }
  }
}

function channelActions() {
  while (true) {
    let action = prompt(statusString() + "Канал:\n1. Оставить реакцию\n2. Сделать пост\n3. Написать комментарий\n4. Поскроллить посты\n5. Назад");
    if (!action) return;
    advanceTime(1);
    switch (action.trim()) {
      case "1": alert("Ты оставил реакцию."); break;
      case "2": alert("Ты сделал пост."); break;
      case "3": alert("Ты написал комментарий."); break;
      case "4": alert("Ты поскроллил посты."); break;
      case "5": return;
      default: alert("Неверный выбор.");
    }
  }
}

function musicMenu() {
  let choice = prompt(statusString() + "Музыка:\n1. Включить\n2. Выключить");
  if (!choice) return;
  musicPlaying = choice === "1" ? true : choice === "2" ? false : musicPlaying;
  alert(`Музыка ${musicPlaying ? "включена" : "выключена"}.`);
}

function alarmMenu() {
  let newTime = prompt(statusString() + `Текущий будильник: ${formatTime(alarmTime)}\nУстановить время (ЧЧ:ММ):`);
  if (!newTime) return;
  let [hrs, mins] = newTime.split(":").map(Number);
  alarmTime = hrs * 60 + mins;
  alert(`Будильник на ${formatTime(alarmTime)}.`);
}

function laptopMenu() {
  while (true) {
    let choice = prompt(statusString() + "Ноутбук:\n1. Сыграть в Доту (40 мин)\n2. Ботать (30 мин)\n3. Играть в Сапёр (10 мин)\n4. Изучать материал лекций (30 мин)\n5. Отключить ноутбук");
    if (!choice) return;
    switch (choice.trim()) {
      case "1":
        advanceTime(40);
        fatigue += 10;
        alert("Ты сыграл в Доту. Усталость +10.");
        break;
      case "2":
        advanceTime(30);
        fatigue += 5;
        alert("Ты ботал. Усталость +5.");
        break;
      case "3":
        advanceTime(10);
        alert("Ты поиграл в Сапёр.");
        break;
      case "4":
        advanceTime(30);
        fatigue += 5;
        alert("Ты изучал материал лекций. Усталость +5.");
        break;
      case "5": return;
      default: alert("Неверный выбор.");
    }
  }
}

function dressingUp() {
  let defaultItems = ["Телефон", "Ноутбук", "Ключи", "Наушники", "Карта", "Пропуск", "Зарядник", "Жвачка"];
  defaultItems.forEach(item => {
    if (!inventory.includes(item)) inventory.push(item);
  });
  advanceTime(15);
  alert(`Ты собрался. В инвентарь добавлены: ${defaultItems.join(", ")}.`);
  
  let extra = prompt(statusString() + "Добавить:\n1. Термос\n2. Повербанк\n3. Ничего");
  if (extra === "1") addToInventory("Термос");
  else if (extra === "2") addToInventory("Повербанк");
}

function platformAndLift(isGoingHome = false) {
  let currentFloor = isGoingHome ? 1 : 7;
  let targetFloor = isGoingHome ? 7 : 1;
  
  let choice = prompt(statusString() + `Спуск/подъём с ${currentFloor} этажа:\n1. Лифт\n2. Лестница`);
  if (!choice) return false;
  if (choice === "2") {
    advanceTime(2);
    alert(isGoingHome ? "Ты поднялся по лестнице на 7 этаж. Молодец!" : "Ты спустился по лестнице на улицу.");
    return true;
  } else if (choice === "1") {
    while (true) {
      let floor = prompt(statusString() + `Текущий этаж: ${currentFloor}\nВыбери этаж (1-14):`);
      if (!floor) return false;
      let selectedFloor = parseInt(floor);
      if (isNaN(selectedFloor) || selectedFloor < 1 || selectedFloor > 14) {
        alert("Неверный этаж. Введи число от 1 до 14.");
        continue;
      }
      advanceTime(Math.abs(currentFloor - selectedFloor));
      currentFloor = selectedFloor;
      if (currentFloor === targetFloor) {
        alert(isGoingHome ? "Ты поднялся на 7 этаж." : "Ты спустился на 1 этаж и вышел на улицу.");
        return true;
      } else {
        alert(statusString() + "Неверный этаж! Ты остаёшься в лифте.");
      }
    }
  }
  return false;
}

function handleSpeedUp() {
  let totalTime = 0;
  let speedCount = 0;

  while (speedCount < 5) {
    let choice = prompt(statusString() + `Ты ускоряешься (попытка ${speedCount + 1}/5):\n1. Продолжить ускоряться\n2. Перейти на шаг`);
    if (!choice) return Math.round(totalTime);
    if (choice === "1") {
      speedCount++;
      totalTime += 11 / 5;
    } else if (choice === "2") {
      totalTime += (5 - speedCount) * 12 / 5;
      break;
    } else {
      alert("Неверный выбор.");
      continue;
    }
  }

  if (speedCount === 5) {
    totalTime = 11;
    alert("Ты ускорился до предела и перешёл на шаг.");
  } else {
    alert("Ты перестал ускоряться.");
  }
  return Math.round(totalTime);
}

function handleRunning() {
  let totalTime = 0;
  let runCount = 0;

  while (runCount < 5) {
    let choice = prompt(statusString() + `Ты бежишь (попытка ${runCount + 1}/5):\n1. Продолжить бежать (+5 усталости)\n2. Перейти на шаг`);
    if (!choice) return Math.round(totalTime);
    if (choice === "1") {
      runCount++;
      fatigue += 5;
      totalTime += 9 / 5;
    } else if (choice === "2") {
      totalTime += (5 - runCount) * 12 / 5;
      break;
    } else {
      alert("Неверный выбор.");
      continue;
    }
  }

  if (runCount === 5) {
    totalTime = 9;
    alert("Ты устал бежать и перешёл на шаг.");
  } else {
    alert("Ты перестал бежать.");
  }
  return Math.round(totalTime);
}

function trainEvent() {
  const trains = [7 * 60 + 15, 7 * 60 + 29, 7 * 60 + 54, 8 * 60 + 10];
  const ticketCost = 59;
  let nextTrainIndex = trains.findIndex(t => t >= currentTime);
  let nextTrain = nextTrainIndex !== -1 ? trains[nextTrainIndex] : null;
  let followingTrain = nextTrainIndex + 1 < trains.length ? trains[nextTrainIndex + 1] : null;

  let timeToNext = nextTrain ? nextTrain - currentTime : "Нет";
  let timeToFollowing = followingTrain ? followingTrain - currentTime : "Нет";

  let promptText = statusString() + `До ближайшей электрички (${nextTrain ? formatTime(nextTrain) : "Нет"}): ${timeToNext} мин.\n`;
  promptText += `До следующей (${followingTrain ? formatTime(followingTrain) : "Нет"}): ${timeToFollowing} мин.\n`;
  promptText += `Как идти до станции?\n1. Спокойно (12 мин)\n2. Ускориться (11 мин)\n3. Бежать (9 мин, +5 усталости)`;

  let choice = prompt(promptText);
  if (!choice) return false;
  let timeSpent = 0;

  switch (choice) {
    case "1": timeSpent = 12; alert("Ты идёшь спокойно."); break;
    case "2": timeSpent = handleSpeedUp(); break;
    case "3": timeSpent = handleRunning(); break;
    default: alert("Неверный выбор."); return trainEvent();
  }

  advanceTime(timeSpent);
  alert(`Ты пришёл на станцию в ${formatTime(currentTime)}.`);
  
  if (!nextTrain || currentTime > nextTrain) {
    alert("Ты опоздал на ближайшую электричку.");
    nextTrain = followingTrain;
    timeToNext = followingTrain ? followingTrain - currentTime : "Нет";
  }

  if (!nextTrain) {
    alert("Следующей электрички нет. Ты возвращаешься домой.");
    advanceTime(15);
    returnToHome();
    return false;
  }

  if (balance >= ticketCost) {
    balance -= ticketCost;
    alert(`Ты купил билет за ${ticketCost} деняк. Остаток: ${balance} деняк.`);
    if (currentTime <= nextTrain) {
      advanceTime(nextTrain + 80 - currentTime);
      fatigue += 20;
      alert(`Ты успел на электричку в ${formatTime(nextTrain)}.`);
      alert("Ты доехал до вуза.");
      turnstileEvent(true);
      return true;
    } else {
      alert("Ты опоздал на электричку.");
      return trainEvent();
    }
  } else {
    alert("Недостаточно средств для покупки билета!");
    advanceTime(15);
    returnToHome();
    return false;
  }
}

function turnstileEvent(isEntering = true) {
  let action = isEntering ? "Войти в вуз" : "Выйти из вуза";
  let item = useInventory();
  if (item && item === "Пропуск") {
    alert(statusString() + `Ты использовал пропуск и ${isEntering ? "вошёл в вуз" : "вышел из вуза"}.`);
    return true;
  } else {
    alert(statusString() + `Нужен пропуск, чтобы ${action}!`);
    return turnstileEvent(isEntering);
  }
}

function university() {
  alert(`Время ${formatTime(currentTime)}. Ты вошёл в вуз.`);
  advanceTime(1);
  alert("Ты зашёл в гардероб, снял верхнюю одежду (1 мин).");
  while (true) {
    let choice = prompt(statusString() + "Ты в вузе. Выбери действие:\n1. Открыть инвентарь\n2. Потратить время\n3. Пойти на пары\n4. Выйти на улицу\n5. Пойти на Планерную");
    if (!choice) break;
    if (choice === "1") {
      useInventory();
    } else if (choice === "2") {
      spendTime();
    } else if (choice === "3") {
      lectures();
    } else if (choice === "4") {
      if (turnstileEvent(false)) {
        street();
        break;
      }
    } else if (choice === "5") {
      if (turnstileEvent(false)) {
        planernaya();
        break;
      }
    } else {
      alert("Неверный выбор.");
    }
  }
}

function eveningTrainEvent() {
  const eveningTrains = [17 * 60 + 17, 17 * 60 + 22, 17 * 60 + 37, 18 * 60 + 2];
  const ticketCost = 59;
  let nextTrainIndex = eveningTrains.findIndex(t => t >= currentTime);
  let nextTrain = nextTrainIndex !== -1 ? eveningTrains[nextTrainIndex] : null;
  let followingTrain = nextTrainIndex + 1 < eveningTrains.length ? eveningTrains[nextTrainIndex + 1] : null;

  let timeToNext = nextTrain ? nextTrain - currentTime : "Нет";
  let timeToFollowing = followingTrain ? followingTrain - currentTime : "Нет";

  let promptText = statusString() + `До ближайшей электрички (${nextTrain ? formatTime(nextTrain) : "Нет"}): ${timeToNext} мин.\n`;
  promptText += `До следующей (${followingTrain ? formatTime(followingTrain) : "Нет"}): ${timeToFollowing} мин.\n`;
  promptText += `Ты на станции. Купить билет? (59 деняк)\n1. Да\n2. Нет`;

  let choice = prompt(promptText);
  if (!choice) return false;
  if (choice === "1") {
    if (balance >= ticketCost) {
      balance -= ticketCost;
      alert(`Ты купил билет за ${ticketCost} деняк. Остаток: ${balance} деняк.`);
      if (currentTime <= nextTrain) {
        advanceTime(nextTrain + 80 - currentTime);
        fatigue += 20;
        alert(`Ты успел на электричку в ${formatTime(nextTrain)}.`);
        alert("Ты доехал домой и стоишь у подъезда.");
        returnToHome();
        return true;
      } else {
        alert("Ты опоздал на электричку.");
        return eveningTrainEvent();
      }
    } else {
      alert("Недостаточно средств для покупки билета!");
      return false;
    }
  } else {
    alert("Ты не купил билет и остался на станции.");
    return false;
  }
}

function returnToHome() {
  alert(statusString() + "Ты подошёл к подъезду.");
  let item = useInventory();
  if (item && item === "Ключи") {
    alert(statusString() + "ты открыл дверь подъезда.");
    if(platformAndLift(true)) {
      homeAtNight();
    }
  } else {
    alert(statusString() + "Нужны ключи, чтобы открыть дверь!");
    returnToHome();
  }
}

function spendTime() {
  let choice = prompt(statusString() + "Потратить время:\n1. Купить кофе\n2. Купить снек\n3. Пойти в столовую\n4. Погулять (5 мин)");
  if (!choice) return;
  switch (choice) {
    case "1": buyCoffee(); break;
    case "2": buySnack(); break;
    case "3": canteen(); break;
    case "4": advanceTime(5); alert("Ты погулял."); break;
    default: alert("Неверный выбор.");
  }
}

function buyCoffee() {
  let coffeeOptions = [
    "Латте (125 деняк)", "Эспрессо (90 деняк)", "Американо (100 деняк)",
    "Капучино (125 деняк)", "Кисель (50 деняк)", "Чай (70 деняк)", "Кротовуха (100 деняк)"
  ];
  let choice = prompt(statusString() + `Выбери кофе:\n${coffeeOptions.map((c, i) => `${i + 1}. ${c}`).join("\n")}`);
  if (!choice) return;
  let selected = coffeeOptions[parseInt(choice) - 1];
  if (!selected) return;

  let [coffee, priceStr] = selected.split(" (");
  let price = parseInt(priceStr);
  let paymentItem = useInventory();
  if (paymentItem && paymentItem === "Карта") {
    if (balance >= price) {
      balance -= price;
      addToInventory(coffee);
      alert(`Ты купил ${coffee} за ${price} деняк.`);
    } else {
      alert("Недостаточно средств.");
    }
  } else {
    alert("Оплата возможна только банковской картой!");
  }
  advanceTime(1);
}

function buySnack() {
  let snackOptions = [
    "Шоколадный батончик (70 деняк)", "Чипсы (70 деняк)", "Энергетик (70 деняк)",
    "Прикормка (70 деняк)", "Вафли (70 деняк)", "Шаурма (70 деняк)"
  ];
  let choice = prompt(statusString() + `Выбери снек:\n${snackOptions.map((s, i) => `${i + 1}. ${s}`).join("\n")}`);
  if (!choice) return;
  let selected = snackOptions[parseInt(choice) - 1];
  if (!selected) return;

  let [snack, priceStr] = selected.split(" (");
  let price = parseInt(priceStr);
  let paymentItem = useInventory();
  if (paymentItem && paymentItem === "Карта") {
    if (balance >= price) {
      balance -= price;
      addToInventory(snack);
      alert(`Ты купил ${snack} за ${price} деняк.`);
    } else {
      alert("Недостаточно средств.");
    }
  } else {
    alert("Оплата возможна только банковской картой!");
  }
  advanceTime(1);
}

function lectures() {
  let lectureTimes = [9 * 60, 10 * 60 + 45, 13 * 60, 14 * 60 + 45];
  let breakTimes = [10 * 60 + 35, 12 * 60 + 20, 14 * 60 + 45, 16 * 60 + 20];
  
  let currentLectureIndex = lectureTimes.findIndex((t, index) => currentTime >= t && currentTime < breakTimes[index]);
  if (currentLectureIndex === -1) {

    if (currentTime < lectureTimes[0]) currentLectureIndex = 0;
    else {
      alert("Все пары на сегодня закончились!");
      currentTime = breakTimes[breakTimes.length - 1];
      return;
    }
  }

  for (let i = currentLectureIndex; i < lectureTimes.length; i++) {
    if (currentTime < lectureTimes[i]) {
      let waitTime = lectureTimes[i] - currentTime;
      alert(`До следующей пары осталось ${waitTime} мин.`);
      advanceTime(waitTime);
    }

    let startTime = Math.max(currentTime, lectureTimes[i]);
    let endTime = breakTimes[i];
    alert(`Пара начинается в ${formatTime(lectureTimes[i])}. Ты пришёл в ${formatTime(startTime)}.`);

    while (currentTime < endTime) {
      let timeLeft = endTime - currentTime;
      let action = prompt(
        statusString() +
        `До конца пары: ${timeLeft} мин.\nВыбери действие:\n` +
        `1. Ботать (30 мин)\n2. Играть в Доту (40 мин)\n3. Смотреть YouTube (40 мин)\n` +
        `4. Писать лекции (20 мин)\n5. Слушать препода (5 мин)\n6. Ничего (1 мин)\n7. Пропустить пару`
      );
      if (!action) break;

      let actionTime = 0;
      switch (action) {
        case "1": actionTime = 30; break;
        case "2": actionTime = 40; break;
        case "3": actionTime = 40; break;
        case "4": actionTime = 20; break;
        case "5": actionTime = 5; break;
        case "6": actionTime = 1; break;
        case "7":
          advanceTime(endTime - currentTime);
          alert(`Ты пропустил пару. Текущее время: ${formatTime(currentTime)}.`);
          break;
        default: alert("Неверный выбор."); continue;
      }

      if (action === "7") break;
      if (currentTime + actionTime > endTime) {
        alert("Недостаточно времени для этого действия. Ты можешь подождать или пропустить пару.");
        continue;
      }
      advanceTime(actionTime);
    }

    if (currentTime >= endTime) {
      fatigue += 20;
      alert(`Пара окончена. Текущее время: ${formatTime(currentTime)}. Усталость: ${fatigue}`);
    }

    if (i < lectureTimes.length - 1) {
      let breakDuration = lectureTimes[i + 1] - currentTime;
      alert(`Перерыв ${breakDuration} мин.`);
      while (currentTime < lectureTimes[i + 1]) {
        let choice = prompt(
          statusString() +
          "Перерыв. Выбери действие:\n1. Открыть инвентарь\n2. Потратить время\n3. Погулять\n4. Ждать"
        );
        if (!choice) break;
        switch (choice) {
          case "1": useInventory(); break;
          case "2": spendTime(); break;
          case "3": advanceTime(5); alert("Ты погулял."); break;
          case "4": advanceTime(1); alert("Ты ждёшь."); break;
          default: alert("Неверный выбор.");
        }
      }
    }
  }
}

function canteen() {
  
  let effects = { hunger: 0, thirst: 0, fatigue: 0 };

  if (canteenTrayTime && currentTime - canteenTrayTime <= 15) {
    alert("Ты вернулся к своему подносу.");

  } else {
    canteenTrayTime = null;
    alert("Ты пришёл в столовую, взял поднос и приборы.");
    let chosenItems = [];
    let totalCost = 0;
    const foodEffects = {
      "Фруктовый": { hunger: -10, thirst: -5 },
      "Цезарь": { hunger: -15 },
      "Оливье": { hunger: -15 },
      "Греческий": { hunger: -10, thirst: -5 },
      "Мимоза": { hunger: -15 },
      "Чизкейк": { hunger: -10, fatigue: -5 },
      "Медовик": { hunger: -10, fatigue: -5 },
      "Сметанник": { hunger: -10, fatigue: -5 },
      "Корзинка с ягодами": { hunger: -10, thirst: -5 },
      "Шоколадный": { hunger: -10, fatigue: -5 },
      "Гороховый суп": { hunger: -20, thirst: -10 },
      "Солянка": { hunger: -20, thirst: -10 },
      "Борщ": { hunger: -20, thirst: -10 },
      "Доширак": { hunger: -15, thirst: -5 },
      "Том Ям": { hunger: -20, thirst: -10 },
      "Котлеты": { hunger: -25 },
      "Куриная ножка": { hunger: -25 },
      "Бифштекс": { hunger: -25 },
      "Фуа-Гра": { hunger: -30, fatigue: -10 },
      "Бургер": { hunger: -25 },
      "Рис": { hunger: -10 },
      "Гречка": { hunger: -10 },
      "Плов": { hunger: -15 },
      "Картофель фри": { hunger: -15 },
      "Картофельное пюре": { hunger: -15 },
      "Пицца": { hunger: -20 },
      "Пирожок": { hunger: -10 },
      "Круассан": { hunger: -10 },
      "Беляш": { hunger: -15 },
      "Чебурек": { hunger: -15 },
      "Чай": { thirst: -15, fatigue: -5 },
      "Вода (бесплатно)": { thirst: -15 },
      "Компот": { thirst: -15, hunger: -5 },
      "Сок": { thirst: -15 },
      "Узвар": { thirst: -15, hunger: -5 }
    };

    let saladChoice = prompt(statusString() + `Выбери салат:\n${salads.map((s, i) => `${i+1}. ${s} (${costs[s]} деняк)`).join("\n")}`);
    if (!saladChoice) return;
    let salad = salads[parseInt(saladChoice) - 1] || "Ничего";
    if (salad !== "Ничего") {
      chosenItems.push(salad);
      totalCost += costs[salad];
      Object.keys(foodEffects[salad]).forEach(key => effects[key] += foodEffects[salad][key]);
    }

    let dessertChoice = prompt(statusString() + `Выбери десерт:\n${desserts.map((d, i) => `${i+1}. ${d} (${costs[d]} деняк)`).join("\n")}`);
    if (!dessertChoice) return;
    let dessert = desserts[parseInt(dessertChoice) - 1] || "Ничего";
    if (dessert !== "Ничего") {
      chosenItems.push(dessert);
      totalCost += costs[dessert];
      Object.keys(foodEffects[dessert]).forEach(key => effects[key] += foodEffects[dessert][key]);
    }

    let firstCourseChoice = prompt(statusString() + `Выбери первое блюдо:\n${firstCourses.map((f, i) => `${i+1}. ${f} (${costs[f]} деняк)`).join("\n")}`);
    if (!firstCourseChoice) return;
    let firstCourse = firstCourses[parseInt(firstCourseChoice) - 1] || "Ничего";
    if (firstCourse !== "Ничего") {
      chosenItems.push(firstCourse);
      totalCost += costs[firstCourse];
      Object.keys(foodEffects[firstCourse]).forEach(key => effects[key] += foodEffects[firstCourse][key]);
    }

    let mainCourseChoice = prompt(statusString() + `Выбери второе блюдо:\n${mainCourses.map((m, i) => `${i+1}. ${m} (${costs[m]} деняк)`).join("\n")}`);
    if (!mainCourseChoice) return;
    let mainCourse = mainCourses[parseInt(mainCourseChoice) - 1] || "Ничего";
    if (mainCourse !== "Ничего") {
      chosenItems.push(mainCourse);
      totalCost += costs[mainCourse];
      Object.keys(foodEffects[mainCourse]).forEach(key => effects[key] += foodEffects[mainCourse][key]);
    }

    let sideDishChoice = prompt(statusString() + `Выбери гарнир:\n${sideDishes.map((s, i) => `${i+1}. ${s} (${costs[s]} деняк)`).join("\n")}`);
    if (!sideDishChoice) return;
    let sideDish = sideDishes[parseInt(sideDishChoice) - 1] || "Ничего";
    if (sideDish !== "Ничего") {
      chosenItems.push(sideDish);
      totalCost += costs[sideDish];
      Object.keys(foodEffects[sideDish]).forEach(key => effects[key] += foodEffects[sideDish][key]);
    }

    let pastryChoice = prompt(statusString() + `Выбери выпечку:\n${pastries.map((p, i) => `${i+1}. ${p} (${costs[p]} деняк)`).join("\n")}`);
    if (!pastryChoice) return;
    let pastry = pastries[parseInt(pastryChoice) - 1] || "Ничего";
    if (pastry !== "Ничего") {
      chosenItems.push(pastry);
      totalCost += costs[pastry];
      Object.keys(foodEffects[pastry]).forEach(key => effects[key] += foodEffects[pastry][key]);
    }

    let drinkChoice = prompt(statusString() + `Выбери напиток:\n${drinks.map((d, i) => `${i+1}. ${d} (${costs[d]} деняк)`).join("\n")}`);
    if (!drinkChoice) return;
    let drink = drinks[parseInt(drinkChoice) - 1] || "Ничего";
    if (drink !== "Ничего") {
      chosenItems.push(drink);
      totalCost += costs[drink];
      Object.keys(foodEffects[drink]).forEach(key => effects[key] += foodEffects[drink][key]);
    }

    alert(`Ваш заказ: ${chosenItems.join(", ")}. Общая стоимость: ${totalCost} деняк.`);
    let paymentItem = useInventory();
    if (paymentItem && paymentItem === "Карта") {
      if (balance >= totalCost) {
        balance -= totalCost;
        alert("Оплата прошла успешно.");
        canteenTrayTime = currentTime;
      } else {
        alert("Недостаточно средств для оплаты.");
        return;
      }
    } else {
      alert("Оплата возможна только банковской картой!");
      return;
    }
  }

  while (true) {
    let action = prompt(statusString() +
      "Поднос с едой:\n1. Начать есть (+15 мин)\n2. Попробовать\n3. Уйти");
    
    if (action === "1") {
      advanceTime(15);
      applyMealEffects(effects);
      alert(statusString() + `Ты поел. Голод ${effects.hunger}, жажда ${effects.thirst}, усталость ${effects.fatigue}`);
      canteenTrayTime = null;
      break;
    } else if (action === "2") {
      let subChoice = prompt("1. Подогреть (1 мин)\n2. Начать есть");
      if (subChoice === "1") {
        advanceTime(1);
        alert("Еда подогрета");
      } else if (subChoice === "2") {
        advanceTime(15);
        applyMealEffects(effects);
        alert(statusString() + `Ты поел. Голод ${effects.hunger}, жажда ${effects.thirst}, усталость ${effects.fatigue}`);
        canteenTrayTime = null;
        break;
      } else {
        alert("Неверный выбор.");
      }
    } else if (action === "3") {
      break;
    } else {
      alert("Неверный выбор.");
    }
  }
}

function oversleptHome() {
  alert("Ты проспал пары. Теперь ты дома и можешь заняться своими делами.");
  mealEvent("завтрак"); 
  
  let hasEatenLunch = false;
  let hasEatenDinner = false;

  while (currentTime < 3 * 60 || currentTime >= 6 * 60) { 
    if (currentTime >= 13 * 60 && currentTime < 14 * 60 && !hasEatenLunch) {
      mealEvent("обед");
      hasEatenLunch = true;
      continue;
    }
    if (currentTime >= 19 * 60 && currentTime < 20 * 60 && !hasEatenDinner) {
      mealEvent("ужин");
      hasEatenDinner = true;
      continue;
    }

    let choice = prompt(statusString() + "Ты дома. Что будете делать?\n1. Ботать (2 ч)\n2. Отдохнуть (2 ч)\n3. Открыть инвентарь\n4. Подождать (1 ч)\n5. Пойти спать");
    if (!choice) {
      alert("Неверный ввод. Продолжаем...");
      continue;
    }
    
    switch (choice.trim()) {
      case "1":
        advanceTime(120);
        fatigue += 20;
        alert("Ты ботал 2 часа. Усталость +20.");
        break;
      case "2":
        advanceTime(120);
        fatigue = Math.max(0, fatigue - 10);
        alert("Ты отдохнул 2 часа. Усталость -10.");
        break;
      case "3":
        useInventory();
        break;
      case "4":
        advanceTime(60);
        alert("Ты ждал 1 час.");
        break;
      case "5":
        if (currentTime < 3 * 60) {
          alert("Слишком рано спать. Нужно дождаться 03:00.");
        } else {
          alert("Ты лёг спать. Новый день начинается!");
          resetGame(); 
          myFunc(); 
          return;
        }
        break;
      default:
        alert("Неверный выбор.");
    }

    if (currentTime >= 1440) {
      currentTime = currentTime % 1440; 
    }
  }
}


function street() {
  while (true) {
    let choice = prompt(statusString() + "Ты на улице. Выбери действие:\n1. Пойти на задний двор (10 мин)\n2. Пятёрочка (10 мин)\n3. Планерная (20 мин)\n4. Вернуться в вуз");
    if (!choice) return;
    switch (choice) {
      case "1":
        advanceTime(10);
        alert("Ты прогулялся на заднем дворе.");
        break;
      case "2":
        pyaterochka();
        break;
      case "3":
        advanceTime(20);
        planernaya();
        break;
      case "4":
        university();
        return;
      default:
        alert("Неверный выбор.");
    }
  }
}

function planernaya() {
  alert("Ты на Планерной.");
  while (true) {
    let choice = prompt(statusString() + "Выберидействие:\n1. Зайти в Перекрёсток (15 мин)\n2. Вернуться в вуз (20 мин)\n3. Поехать домой");
    if (!choice) return;
    switch (choice) {
      case "1":
        advanceTime(15);
        perekrestok();
        break;
      case "2":
        advanceTime(20);
        university();
        return;
      case "3":
        eveningTrainEvent();
        return;
      default:
        alert("Неверный выбор.");
    }
  }
}

function pyaterochka() {
  advanceTime(10);
  let choice = prompt(statusString() +
    "Пятёрочка:\n1. Энергетик (90 деняк)\n2. Донат (70 деняк)\n3. Выйти");
  if (!choice) return;
  if (choice === "1" && balance >= 90) {
    balance -= 90;
    addToInventory("Энергетик");
  } else if (choice === "2" && balance >= 70) {
    balance -= 70;
    addToInventory("Донат");
  }
}

function perekrestok() {
  let choice = prompt(statusString() +
    "Перекрёсток:\n1. Лимонад (90 деняк)\n2. Донат (70 деняк)\n3. Выйти");
  if (!choice) return;
  if (choice === "1" && balance >= 90) {
    balance -= 90;
    addToInventory("Лимонад");
  } else if (choice === "2" && balance >= 70) {
    balance -= 70;
    addToInventory("Донат");
  }
}

function myFunc() {
  alert("Добро пожаловать в 'Студенческую жизнь'!");
  let isAwake = alarmClock();
  if (isAwake) {
    dayProcess();
  } else {
    oversleptHome();
  }
}

function dayProcess() {
  if (!inventory.includes("Телефон")) addToInventory("Телефон");
  alert("Ты встал с кровати.");
  alert(statusString() + "Ты принял душ, сходил в туалет и оделся.");
  advanceTime(20);
  mealEvent("завтрак");
  if (confirm("Хотчешь использовать телефон?")) phoneMenu();
  dressingUp();
  if (platformAndLift()) {
    if (trainEvent()) {
      university();
    } else {
      homeAtNight();
    }
  } else {
    homeAtNight();
  }
}

function resetGame() {
  health = 100;
  fatigue = 0;
  hunger = 50;
  thirst = 100;
  hungerTimer = 0;
  thirstTimer = 0;
  currentTime = 6 * 60; 
  balance = 10000;
  inventory = [];
  alarmTime = 6 * 60;
  musicPlaying = false;
  imbaEnergyEffect = false;
  canteenTrayTime = null;
}

function homeAtNight() {
  while (true) {
    let choice = prompt(statusString() + "Дома:\n1. Заняться делами (1 ч)\n2. Отдохнуть (2 ч)\n3. Пойти спать");
    if (!choice) {
      alert("Неверный ввод. Продолжаем...");
      continue;
    }
    if (choice === "1") {
      advanceTime(60);
      alert("Вы занимался делами 1 час.");
    } else if (choice === "2") {
      advanceTime(120);
      fatigue = Math.max(0, fatigue - 10);
      alert("Ты отдохнул 2 часа.");
    } else if (choice === "3") {
      if (currentTime < 3 * 60) {
        alert("Слишком рано спать. Подожди до 03:00.");
        continue;
      } else {
        alert("Ты лёг спать. Новый день начинается!");
        resetGame(); 
        myFunc(); 
        return;
      }
    } else {
      alert("Неверный выбор.");
    }
  }
}

