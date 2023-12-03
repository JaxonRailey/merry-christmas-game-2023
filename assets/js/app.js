const $one = document.querySelector.bind(document);
const $all = document.querySelectorAll.bind(document);

const url           = window.location.search;
const params        = new URLSearchParams(url);
const switchSound   = new Audio('assets/sound/switch.wav');
const winnerSound   = new Audio('assets/sound/winner.wav');
const wishSound     = new Audio('assets/sound/christmas.mp3');
const christmas     = bodymovin.loadAnimation({
    container: $one('.game'),
    path: 'assets/js/christmas.json',
    renderer: 'svg',
    loop: false,
    name: 'christmas',
    autoplay: false
});

let user          = params.get('user');
let level         = null;
let winner        = false;
let clicks        = 0;
let totalElems    = 0;
let controls      = 0;
let switches      = [];
let lights        = [];
let switchesElems = [];
let lightsElems   = [];
let switchMap     = [];

// open intro
$one('.intro').setAttribute('visible', true);

// set user
if (user) {
    try {
        user = atob(user);
        $one('.intro h1').innerText += ' ' + user;
    } catch {}
}

// close intro
$all('.intro span').forEach(smile => {
    smile.addEventListener('click', (e) => {
        $one('.intro').classList.add('active');

        level = smile.classList[0];

        switch (level) {
            case 'easy':   totalElems = 5; controls = 3; break;
            case 'medium': totalElems = 6; controls = 2; break;
            case 'hard':   totalElems = 7; controls = 3; break;
            case 'crazy':  totalElems = 8; controls = 2; break;
        }

        switches = createElems(totalElems, 'switches', '.container');
        lights   = createElems(totalElems, 'lights', '.container');

        switchesElems = $all('.switches > div');
        lightsElems   = $all('.lights > div');

        startGame();
        findSolution();
    });
});

// Funzione per mescolare casualmente un array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Funzione per generare switchMap con requisiti specifici
function generateSwitchMap() {
    let currentSwitchMap;
    let attempts = 0;
    const maxAttempts = 1000; // Numero massimo di tentativi prima di arrendersi

    while (attempts < maxAttempts) {
        attempts++;

        const allTriplets = controls == 2 ? generatePair() : generateTriple();
        shuffleArray(allTriplets);

        currentSwitchMap = Array.from({
            length: switchesElems.length
        }, (_, index) => []);

        // Assicura che ogni indice delle lampadine sia presente almeno una volta
        const allLightIndices = Array.from({
            length: lightsElems.length
        }, (_, index) => index);
        const remainingTriplets = [...allTriplets];

        while (allLightIndices.length > 0 && remainingTriplets.length > 0) {
            for (let i = 0; i < currentSwitchMap.length; i++) {
                const currentTriplet = remainingTriplets.pop();
                currentSwitchMap[i].push(...currentTriplet);
                currentTriplet.forEach(lightIndex => {
                    const indexToRemove = allLightIndices.indexOf(lightIndex);
                    if (indexToRemove !== -1) {
                        allLightIndices.splice(indexToRemove, 1);
                    }
                });
            }
        }

        // Se ci sono ancora indici delle lampadine rimanenti, sostituisci casualmente negli switchMap
        while (allLightIndices.length > 0) {
            const randomIndex = Math.floor(Math.random() * currentSwitchMap.length);
            const targetTriplet = currentSwitchMap[randomIndex];
            const randomLightIndex = allLightIndices.pop();
            const duplicateIndices = targetTriplet.filter(lightIndex => allLightIndices.includes(lightIndex));
            const indexToReplace = duplicateIndices.length > 0 ? duplicateIndices[0] : targetTriplet[0];
            const replaceIndex = targetTriplet.indexOf(indexToReplace);
            targetTriplet[replaceIndex] = randomLightIndex;
        }

        // Verifica se la soluzione è valida
        if (checkSolution(currentSwitchMap)) {
            console.log('Soluzione valida trovata in', attempts, 'tentativi');
            return currentSwitchMap.map(triplet => triplet.sort((a, b) => a - b));
        }
    }

    console.log('Nessuna soluzione valida trovata in', maxAttempts, 'tentativi. Rieseguire la generazione.');
    return generateSwitchMap(); // Riesegui la generazione se non viene trovata una soluzione valida
}

function checkSolution(switchMap) {
    const totalSwitches = switchMap.length;
    for (let i = 0; i < 2 ** totalSwitches; i++) {
        const binaryString = i.toString(2).padStart(totalSwitches, '0').split('').reverse();
        const currentSwitches = binaryString.map(char => char === '1');

        let currentLights = new Array(lightsElems.length).fill(false);

        for (let j = 0; j < totalSwitches; j++) {
            if (currentSwitches[j]) {
                const associatedLights = switchMap[j];
                associatedLights.forEach(lightIndex => {
                    currentLights[lightIndex] = !currentLights[lightIndex];
                });
            }
        }

        if (currentLights.every(light => light)) {
            return true; // La soluzione è valida
        }
    }

    return false; // Nessuna soluzione valida trovata
}

function startGame() {
    switchMap = generateSwitchMap();
    console.table(switchMap);

    switchesElems.forEach((elem, index) => {
        elem.addEventListener('click', () => {

            if (winner) return;

            clicks++;

            switchSound.play();

            switches[index] = !switches[index];

            const associatedLights = switchMap[index];

            associatedLights.forEach(lightIndex => {
                lights[lightIndex] = !lights[lightIndex];
            });

            updateUI();

            if (lights.every(light => light)) {
                winner = true;
                winnerSound.play();
                $one('.blank').classList.add('active');
                console.log('Hai vinto usando '+ clicks + ' mosse!');
                $one('.blank.active:not(.fade)').addEventListener('animationend', () => {
                    console.log('animazione finita');
                    $one('.game .container').innerHTML = '';
                    $one('svg').style.display = 'block';
                    $one('.blank').classList.remove('active');
                    $one('.blank').classList.add('fade');
                    wishSound.play();
                    christmas.setSpeed(0.40);
                    christmas.play();
                });

            } else {
                console.log('Non tutte le lampadine sono accese. Riprova!');
            }
        });
    });

    updateUI();
}


function updateUI() {
    switchesElems.forEach((switchElement, index) => {
        const lightElement = lightsElems[index];

        switchElement.classList.toggle('on', switches[index]);
        switchElement.classList.toggle('off', !switches[index]);

        lightElement.classList.toggle('on', lights[index]);
        lightElement.classList.toggle('off', !lights[index]);
    });
}

function findSolution() {
    const totalSwitches = switchesElems.length;

    for (let i = 0; i < 2 ** totalSwitches; i++) {
        const binaryString = i.toString(2).padStart(totalSwitches, '0').split('').reverse();
        const currentSwitches = binaryString.map(char => char === '1');

        let currentLights = new Array(lightsElems.length).fill(false);

        for (let j = 0; j < totalSwitches; j++) {
            if (currentSwitches[j]) {
                const associatedLights = switchMap[j];
                associatedLights.forEach(lightIndex => {
                    currentLights[lightIndex] = !currentLights[lightIndex];
                });
            }
        }

        if (currentLights.every(light => light)) {
            console.log('Soluzione trovata:', currentSwitches);
            return currentSwitches;
        }
    }

    console.log('Nessuna soluzione trovata.');
    return null;
}