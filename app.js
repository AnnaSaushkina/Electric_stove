// Плита - содержит 4 конфорки и общий выключатель
class ElectricStove {
    constructor() {
        this.isStoveOn = false; // общее состояние плиты

        // Создаем 4 конфорки с понятными именами
        this.burners = {
            frontLeft: new Burner('Левая передняя'),
            frontRight: new Burner('Правая передняя'),
            backLeft: new Burner('Левая задняя'),
            backRight: new Burner('Правая задняя')
        };

        console.log('Плита создана. Все конфорки выключены.');
    }

    // Включить плиту
    turnOn() {
        this.isStoveOn = true;
        console.log('Плита включена. Конфорки готовы к использованию.');
    }

    // Выключить плиту (и все конфорки)
    turnOff() {
        this.isStoveOn = false;

        // Выключаем все конфорки
        for (const burnerKey in this.burners) {
            this.burners[burnerKey].turnOff();
        }

        console.log('Плита выключена. Все конфорки выключены.');
    }

    // Включить конкретную конфорку
    turnOnBurner(burnerName, power = 5) {
        if (!this.isStoveOn) {
            console.log('Сначала включите плиту!');
            return;
        }

        const burner = this.burners[burnerName];
        if (burner) {
            burner.turnOn(power);
        } else {
            console.log(`Конфорки "${burnerName}" не существует`);
        }
    }

    // Выключить конкретную конфорку
    turnOffBurner(burnerName) {
        const burner = this.burners[burnerName];
        if (burner) {
            burner.turnOff();
        } else {
            console.log(`Конфорки "${burnerName}" не существует`);
        }
    }

    // Получить общую потребляемую мощность
    getTotalPower() {
        let total = 0;
        for (const burnerKey in this.burners) {
            total += this.burners[burnerKey].getPowerInWatts();
        }
        return total;
    }

    // Вывести статус всей плиты
    getStatus() {
        console.log(`=== Статус плиты ===`);
        console.log(`Плита: ${this.isStoveOn ? 'ВКЛЮЧЕНА' : 'ВЫКЛЮЧЕНА'}`);
        console.log(`Общая мощность: ${this.getTotalPower()} Вт`);
        console.log('');

        for (const burnerKey in this.burners) {
            console.log(this.burners[burnerKey].getStatus());
        }

        console.log('====================');
    }
}