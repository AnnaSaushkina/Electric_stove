// Создаем плиту
const myStove = new ElectricStove();

// Включаем плиту
myStove.turnOn();

// Включаем конфорки
myStove.turnOnBurner('frontLeft', 7);
myStove.turnOnBurner('frontRight', 3);
myStove.turnOnBurner('backLeft', 5);

// Пытаемся включить несуществующую конфорку
myStove.turnOnBurner('middle', 10); // Ошибка

// Меняем мощность
myStove.burners.frontLeft.setPower(9);

// Проверяем статус
myStove.getStatus();

// Выключаем конфорку
myStove.turnOffBurner('frontRight');

// Снова проверяем статус
myStove.getStatus();

// Выключаем плиту полностью
myStove.turnOff();

// Пытаемся включить конфорку при выключенной плите
myStove.turnOnBurner('backLeft', 2); // Не даст