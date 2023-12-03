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
    smile.addEventListener('click', () => {
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
        console.log(checkSolution(switchMap));
    });
});

function generateSwitchMap() {

    const maxAttempts = 100;
    let attempts      = 0;

    while (attempts < maxAttempts) {

        attempts++;

        const allPairs = controls === 2 ? generatePair() : generateTriple();

        let currentSwitchMap  = Array.from({ length: switchesElems.length }, (_, index) => []);
        const allLightIndices = Array.from({ length: lightsElems.length }, (_, index) => index);

        for (let i = 0; i < currentSwitchMap.length; i++) {
            const currentPair = allPairs.pop();
            currentSwitchMap[i].push(...currentPair);
            currentPair.forEach(lightIndex => {
                const indexToRemove = allLightIndices.indexOf(lightIndex);
                if (indexToRemove !== -1) {
                    allLightIndices.splice(indexToRemove, 1);
                }
            });
        }

        if (checkSolution(currentSwitchMap)) {
            console.log('Soluzione valida trovata in', attempts, 'tentativi');
            return currentSwitchMap.map(pair => pair.sort((a, b) => a - b));
        }
    }

    location.href = '/';
}

function checkSolution(switchMap) {

    const combinations = 2 ** switchMap.length;

    for (let i = 0; i < combinations; i++) {
        const binaryString    = i.toString(2).split('').reverse();
        const currentSwitches = binaryString.map(char => char === '1');
        let currentLights     = new Array(lightsElems.length).fill(false);

        for (let j = 0; j < switchMap.length; j++) {
            if (currentSwitches[j]) {
                switchMap[j].forEach(lightIndex => {
                    currentLights[lightIndex] = !currentLights[lightIndex];
                });
            }
        }

        if (currentLights.every(light => light)) {
            if (currentSwitches.length < switchMap.length) {
                return [...currentSwitches, ...new Array(switchMap.length - currentSwitches.length).fill(false)];
            }

            return currentSwitches;
        }
    }

    return false;
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
                    $one('.game h1').remove();
                    $one('.game .container').innerHTML = '';
                    $one('svg').style.display = 'block';
                    $one('.blank').classList.remove('active');
                    $one('.blank').classList.add('fade');
                    wishSound.play();
                    christmas.play();
                });
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