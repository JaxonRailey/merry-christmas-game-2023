function createElems(quantity, className, selector) {

    const array = [];
    const container = document.createElement('div');
    container.classList.add(className);

    for (let i = 0; i < quantity; i++) {

        const elem = document.createElement('div');
        container.append(elem);
        array.push(false);
    }

    $one(selector).append(container);

    return array;
}

function shuffleArray(array) {

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generatePair() {

    const array = [];

    for (let i = 0; i < lightsElems.length; i++) {
        for (let j = i + 1; j < lightsElems.length; j++) {
            array.push([i, j]);
        }
    }

    shuffleArray(array);

    return array;
}

function generateTriple() {

    const array = [];

    for (let i = 0; i < lightsElems.length; i++) {
        for (let j = i + 1; j < lightsElems.length; j++) {
            for (let k = j + 1; k < lightsElems.length; k++) {
                array.push([i, j, k]);
            }
        }
    }

    shuffleArray(array);

    return array;
}

function randomColor() {

    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    return '#' + ('000000' + randomColor).slice(-6);
}

function greetings() {

    setInterval(() => {
        console.clear();
        console.log("%c\r\n  ____                              _   _           _             _        \r\n |  _ \\                            | \\ | |         | |           | |       \r\n | |_) |  _   _    ___    _ __     |  \\| |   __ _  | |_    __ _  | |   ___ \r\n |  _ <  | | | |  \/ _ \\  | \'_ \\    | . ` |  \/ _` | | __|  \/ _` | | |  \/ _ \\\r\n | |_) | | |_| | | (_) | | | | |   | |\\  | | (_| | | |_  | (_| | | | |  __\/\r\n |____\/   \\__,_|  \\___\/  |_| |_|   |_| \\_|  \\__,_|  \\__|  \\__,_| |_|  \\___|\r\n                                                                           \r\n                                                                           \r\n                _             _                       _                    \r\n               | |           | |                     (_)                   \r\n             __| |   __ _    | |        ___    _ __   _   ___              \r\n            \/ _` |  \/ _` |   | |       \/ _ \\  | \'__| | | \/ __|             \r\n           | (_| | | (_| |   | |____  | (_) | | |    | | \\__ \\             \r\n            \\__,_|  \\__,_|   |______|  \\___\/  |_|    |_| |___\/             \r\n                                                                           \r\n                                                                           \r\n", 'color: ' + randomColor());
    }, 500);
}

