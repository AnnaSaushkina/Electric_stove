// --- Состояние комфорки
function createBurner(name) {
    return {
        name,
        power: 0,
        isOn: false,
        isOverheated: false
    };
}

// Функция регулировки мощности
function setBurnerPower(burner, power) {
    if (power < 0 || power > 10) return;

    burner.power = power;
    console.log(`${burner.name}: мощность ${power}`);

    if (power > 0) {
        burnerOn(burner);
    } else {
        burnerOff(burner);
    }
}

// Включение комфорки
function burnerOn(burner) {
    // Защита от перегрева
    if (burner.isOverheated) return;

    burner.isOn = true;
    console.log(`${burner.name}: включена`);
}

// Выключение конфорки
function burnerOff(burner) {
    burner.isOn = false;
    console.log(`${burner.name}: выключена`);
}

// --- создание плиты
function createStove() {
    return {
        isPowered: false,
        burners: {
            leftFront: createBurner('Левая передняя'),
            rightFront: createBurner('Правая передняя'),
            leftBack: createBurner('Левая задняя'),
            rightBack: createBurner('Правая задняя')
        }
    };
}

// Включение плиты (в розетку)
function stovePowerOn(stove) {
    stove.isPowered = true;
    console.log('Плита включена в розетку');
}

// Выключение плиты
function stovePowerOff(stove) {
    stove.isPowered = false;

    // Для каждой конфорки выключается вся плита
    for (const key in stove.burners) {
        burnerOff(stove.burners[key]);
    }

    console.log('Плита выключена из розетки');
}

// Включение конфорки на плите
function stoveBurnerOn(stove, burnerName, power) {
    // Если плита не включена то комфорка не включается тоже
    if (!stove.isPowered) {
        console.log('Нужно включить в розетку');
        return;
    }

    if (!stove.burners[burnerName]) return;

    setBurnerPower(stove.burners[burnerName], power);
}


//  статус
let log = null;

function startLogging(stove) {
    if (!stove.isPowered) return;

    console.log('-- лог');

    log = setInterval(() => {
        if (!stove.isPowered) {
            stopLogging();
            return;
        }

        console.log(`Плита: ${stove.isPowered ? 'вкл' : 'выкл'}`);

        for (const key in stove.burners) {
            const b = stove.burners[key];
            console.log(`${b.name}: ${b.isOn ? `вкл (${b.power})` : 'выкл'}`);
        }
    }, 5000);
}

function stopLogging() {
    if (log) {
        clearInterval(log);
        console.log('-- стоп лога');
    }
}

// функция проверки высокой температуры и защиты от перегрева
function checkOverheat(stove) {
    for (const key in stove.burners) {
        const burner = stove.burners[key];

        // если конфорка включена на макс
        if (burner.isOn && burner.power === 10 && !burner.isOverheated) {
            console.log(`${burner.name}: риск перегрева`);


            setTimeout(() => {
                burner.isOverheated = true;
                burnerOff(burner);
                console.log(`${burner.name}: перегрев`);

                // срабатывает остываение
                setTimeout(() => {
                    burner.isOverheated = false;
                    console.log(`${burner.name}: остывает`);

                    // Если плита включена, и мощность комфорки была задана, то включаем ее снова
                    if (stove.isPowered && burner.power > 0) {
                        console.log(`${burner.name}: повторное включение`);
                        burnerOn(burner);
                    }
                }, 2000);
            }, 3000);
        }
    }
}

// модуль эмуляции датчиков

// Температура каждой конфорки
let burnerTemperatures = {};

// Эмуляция датчика температуры для конфорки
function emulateTemperatureSensor(burner, stove) {
    // Если это первый раз для этой конфорки, установка начальной температуры
    if (!burnerTemperatures[burner.name]) {
        burnerTemperatures[burner.name] = 25; // комнатная температура
    }

    let currentTemp = burnerTemperatures[burner.name];

    // Если плита включена в розетку
    if (stove.isPowered) {
        // Если конфорка включена
        if (burner.isOn && !burner.isOverheated) {
            // Нагреваем конфорку
            currentTemp = currentTemp + (burner.power * 3);
        } else {
            // Остывает
            currentTemp = currentTemp - 2;
            if (currentTemp < 25) currentTemp = 25; // не ниже комнатной
        }
    } else {
        // Плита не включена в розетку - быстро остывает
        currentTemp = currentTemp - 5;
        if (currentTemp < 25) currentTemp = 25;
    }

    // Запоминаем новую температуру
    burnerTemperatures[burner.name] = currentTemp;

    return Math.round(currentTemp);
}

// Проверка перегрева по датчику температуры
function checkTemperatureOverheat(burner, stove) {
    const temperature = emulateTemperatureSensor(burner, stove);

    // Перергрев если температура больше 300 градусов
    if (temperature > 300) {
        console.log(`ДАТЧИК: ${burner.name} перегрет. Температура: ${temperature}°C`);
        burner.isOverheated = true;
        burnerOff(burner);
    }

    //  Снимаем перегрев если остыл ниже 250 градусов 
    if (burner.isOverheated && temperature < 250) {
        console.log(`ДАТЧИК: ${burner.name} остыл до ${temperature}°C`);
        burner.isOverheated = false;
    }

    return temperature;
}

// Проверка если плита не включена, но кто-то пытается готовить
function checkNoFireWarning(burner, stove) {
    const temperature = burnerTemperatures[burner.name] || 25;

    // Если конфорка включена, но плита не в розетке
    if (burner.isOn && stove.isPowered === false) {
        console.log(`${burner.name} включена, но плита не в розетке`);
        console.log('Нужно включить плиту в розетку');
        return true;
    }

    // Если конфорка включена на высокую мощность, но температура низкая
    if (burner.isOn && burner.power > 5 && temperature < 50) {
        console.log(`${burner.name} включена, но нет нагрева`);
        console.log('Проблема с конфоркой или плитой не включена');
        return true;
    }

    return false;
}

// Запуск мониторинга датчиков
function startSensorMonitoring(stove) {
    console.log('запускаем датчики');

    // Проверяем каждые 2 секунды
    const sensorInterval = setInterval(() => {
        // останавливаем мониторинг при выключенной плите
        if (!stove.isPowered) {
            clearInterval(sensorInterval);
            console.log('Мониторинг датчиков остановлен, плита выключена');
            return;
        }

        // Проверка каждой конфорки
        for (const key in stove.burners) {
            const burner = stove.burners[key];

            // Эмулируем датчик температуры и проверяем перегрев
            const temp = checkTemperatureOverheat(burner, stove);

            // Проверка презупреждений
            checkNoFireWarning(burner, stove);
            console.log(`${burner.name}: ${temp}°C`);
        }

    }, 2000); // проверка каждые 2 секунды

    return sensorInterval;
}



// проверка работы
const stove = createStove();

// Запускаем мониторинг датчиков сразу при создании плиты
let sensorMonitor = startSensorMonitoring(stove);

console.log('--- Включение комфорки без включения плиты---');
stoveBurnerOn(stove, 'leftFront', 7);

console.log('--- Включение плиты');
stovePowerOn(stove);

// Перезапускаем мониторинг датчиков после включения плиты
clearInterval(sensorMonitor);
sensorMonitor = startSensorMonitoring(stove);

startLogging(stove);

console.log('--- Включаем разные комфорки, в тч с перегревом');
stoveBurnerOn(stove, 'leftFront', 7);
stoveBurnerOn(stove, 'rightBack', 10);

// Проверка перегрева
checkOverheat(stove);

setTimeout(() => {
    console.log('--Выключаем плиту');
    stovePowerOff(stove);

    // Останавливаем мониторинг датчиков
    clearInterval(sensorMonitor);
}, 10000);