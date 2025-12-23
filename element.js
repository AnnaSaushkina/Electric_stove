// Конфорка
function createBurner(name) {
    return { name, isOn: false, power: 0 };
}

function burnerOn(burner, power = 5) {
    if (power < 0 || power > 10) return;
    burner.isOn = true;
    burner.power = power;
    console.log(`${burner.name}: включена на ${power}`);
}

function burnerOff(burner) {
    burner.isOn = false;
    burner.power = 0;
    console.log(`${burner.name}: выключена`);
}

function changePower(burner, newPower) {
    if (!burner.isOn || newPower < 0 || newPower > 10) return;
    burner.power = newPower;
    console.log(`${burner.name}: мощность ${newPower}`);
}

// Плита
function createStove() {
    return {
        isOn: false,
        burners: {
            leftFront: createBurner('Левая передняя'),
            rightFront: createBurner('Правая передняя'),
            leftBack: createBurner('Левая задняя'),
            rightBack: createBurner('Правая задняя')
        }
    };
}

function stoveOn(stove) {
    stove.isOn = true;
    console.log('Плита включена');
}

function stoveOff(stove) {
    stove.isOn = false;
    for (const key in stove.burners) {
        if (stove.burners[key].isOn) burnerOff(stove.burners[key]);
    }
    console.log('Плита выключена');
}

function stoveBurnerOn(stove, burnerName, power) {
    if (!stove.isOn || !stove.burners[burnerName]) return;
    burnerOn(stove.burners[burnerName], power);
}

// Проверки
const stove = createStove();

stoveOn(stove);
stoveBurnerOn(stove, 'leftFront', 7);
stoveBurnerOn(stove, 'rightBack', 3);

console.log('Состояние:');
console.log(`Плита: ${stove.isOn ? 'вкл' : 'выкл'}`);
for (const key in stove.burners) {
    const status = stove.burners[key];
    console.log(`${status.name}: ${status.isOn ? `вкл (${status.power})` : 'выкл'}`);
}

stoveOff(stove);