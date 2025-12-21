class Burner {
    constructor(name) {
        this.name = name;       // "Левая передняя", "Правая задняя" и т.д.
        this.isOn = false;      // включена ли конфорка
        this.power = 0;         // текущая мощность (0-10)
        this.maxPower = 10;     // максимальная мощность
    }

    // Включить конфорку
    turnOn(powerLevel = 5) {
        if (powerLevel < 0 || powerLevel > this.maxPower) {
            console.log(`Ошибка: мощность должна быть от 0 до ${this.maxPower}`);
            return;
        }
        this.isOn = true;
        this.power = powerLevel;
        console.log(`${this.name} включена на мощность ${this.power}`);
    }

    // Выключить конфорку
    turnOff() {
        this.isOn = false;
        this.power = 0;
        console.log(`${this.name} выключена`);
    }

    // Изменить мощность (если конфорка включена)
    setPower(newPower) {
        if (!this.isOn) {
            console.log(`Сначала включите ${this.name}`);
            return;
        }
        if (newPower < 0 || newPower > this.maxPower) {
            console.log(`Ошибка: мощность должна быть от 0 до ${this.maxPower}`);
            return;
        }
        this.power = newPower;
        console.log(`${this.name}: мощность изменена на ${this.power}`);
    }

    // Получить текущую мощность в ваттах (просто умножаем на 1000)
    getPowerInWatts() {
        return this.power * 1000;
    }

    // Простой метод для вывода состояния
    getStatus() {
        return `${this.name}: ${this.isOn ? 'ВКЛ' : 'ВЫКЛ'} (${this.power}/10)`;
    }
}