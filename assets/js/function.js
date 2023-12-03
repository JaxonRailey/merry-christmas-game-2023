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

function generatePair() {

    const array = [];

    for (let i = 0; i < lightsElems.length; i++) {
        for (let j = i + 1; j < lightsElems.length; j++) {
            array.push([i, j]);
        }
    }

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

    return array;
}