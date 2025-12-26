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
    // Если плита е включена то комфорка не включается тоже
    if (!stove.isPowered) {
        console.log('Нужно включить в розетку');
        return;
    }

    if (!stove.burners[burnerName]) return;

    setBurnerPower(stove.burners[burnerName], power);
}


// Логи статуса
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

        // Если конфорка включена на макс
        if (burner.isOn && burner.power === 10 && !burner.isOverheated) {
            console.log(`${burner.name}: риск перегрева`);


            setTimeout(() => {
                burner.isOverheated = true;
                burnerOff(burner);
                console.log(`${burner.name}: перегрев`);

                // Срабатывает остываение
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

// проверка работы
const stove = createStove();


console.log('--- Включение комфорки без  без включения плиты---');
stoveBurnerOn(stove, 'leftFront', 7);


console.log('--- Включение плиты');
stovePowerOn(stove);

startLogging(stove);

console.log('--- Включаем разные комфорки, в тч с перегревом');
stoveBurnerOn(stove, 'leftFront', 7);
stoveBurnerOn(stove, 'rightBack', 10);

// Проверка перегрева
checkOverheat(stove);

setTimeout(() => {
    console.log('--Выключаем плиту');
    stovePowerOff(stove);
}, 10000);