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