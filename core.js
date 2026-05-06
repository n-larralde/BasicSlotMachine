// *********************
// ******* CORE *******
// *********************

const app = new PIXI.Application({
    resizeTo: window,
    backgroundColor: 0xFFFFFF
});

document.body.appendChild(app.view);

// Containers
const container = new PIXI.Container();
const uiContainer = new PIXI.Container();
const reelsContainer = new PIXI.Container();
const buttonsContainer = new PIXI.Container();

container.addChild(reelsContainer);
container.addChild(uiContainer);
container.addChild(buttonsContainer);
app.stage.addChild(container);

// Resize handling
resize();
app.renderer.on("resize", resize);

// Texts
const loadingText = addText(LOADING_TEXT, LOADING_TEXT_COLOR, LOADING_TEXT_FONT_SIZE, 0, 0);
let winText = null;

// Assets Loading
PIXI.Assets.addBundle("game-symbols", ASSETS);

let textures = {};
let reelsTable = [];

init();

// *********************
// ***** FUNCTIONS *****
// *********************

// ******* ASYNC *******

async function init() {
    try {
        textures = await PIXI.Assets.loadBundle("game-symbols", (progress) => {
            updateText(loadingText, LOADING_TEXT + `${Math.round(progress * 100)}%`);
        });

        await new Promise(resolve => setTimeout(resolve, USE_FAKE_LOADER? FAKE_LOADER_TIMER : 0));
    }
    catch (e) {
        updateText(loadingText, ERROR_LOADING_ASSETS_TEXT);
        console.error(e);
        return;
    }

    if (DEBUG) console.log(ASSETS_LOADED_TEXT);

    loadingText.destroy();

    winText = addText("", WIN_TEXT_COLOR, WIN_TEXT_FONT_SIZE, 0, 285);

    initButtons();
    updateDisplayReels(SPINS);
    checkWinConditions();

    if (RUN_UNIT_TESTS) {
        const script = document.createElement("script");
        script.src = "test.js";
        document.body.appendChild(script);
    }

    if (DEBUG) console.log(REELS_INITIALIZED_TEXT);

    addText(MAIN_TITLE, MAIN_TITLE_COLOR, MAIN_TITLE_FONT_SIZE, 0, -250);
}

// ******* SYNC *******

function initButtons(){
    const positionX = 0;
    const positionY = OFFSET_Y + ROWS * REEL_SIZE + BUTTON_HEIGHT / 2 + 10;
    const button = addButton(positionX, positionY);
    buttonsContainer.addChild(button);
}

function addButton(positionX = 0, positionY = 0) {
    const button = new PIXI.Sprite(textures["spin_button"]);
    button.anchor.set(0.5);
    button.width = BUTTON_WIDTH;
    button.height = BUTTON_HEIGHT;
    button.x = positionX;
    button.y = positionY;

    button.eventMode = 'static';
    button.cursor = 'pointer';

    // Events
    button.on('pointerdown', () => {
        randomizeAllReels();
        checkWinConditions();
    });

    return button;
}

function updateDisplayReels(positions) {
    // Reset reels
    reelsContainer.removeChildren();
    reelsTable.length = 0;

    for (let c = 0; c < COLS; c++) {
        const colSymbols = [];

        for (let r = 0; r < ROWS; r++){
            const index = (positions[c] + r) % REELSET[c].length;
            const symbol = REELSET[c][index];
            const sprite = new PIXI.Sprite(textures[symbol]);
            sprite.width = REEL_SIZE;
            sprite.height = REEL_SIZE;
            sprite.x = OFFSET_X + c * REEL_SIZE;
            sprite.y = OFFSET_Y + r * REEL_SIZE;
            reelsContainer.addChild(sprite);
            colSymbols.push(symbol);
        }

        reelsTable.push(colSymbols);
    }
}

function resize() {
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    const scaleX = app.screen.width / DESIGN_WIDTH;
    const scaleY = app.screen.height / DESIGN_HEIGHT;
    const scale = Math.min(scaleX, scaleY);

    container.scale.set(scale);

    if (DEBUG) console.log(SCREEN_RESIZED_TEXT, app.screen.width, app.screen.height);
}

function addText(text, color, fontSize, positionX, positionY, centered = true) {
    const pixiText = new PIXI.Text(text, {
        fill: color,
        fontSize: fontSize
    });

    pixiText.x = centered ? -pixiText.width / 2 + positionX : positionX;
    pixiText.y = positionY;
    uiContainer.addChild(pixiText);
    
    return pixiText;
}

function updateText(pixiText, newText) {
    pixiText.text = newText;
    pixiText.x = -pixiText.width / 2;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkWinConditions(){
    const wins = checkAllPaylines();
    updateWinTexts(wins);
}

function randomizeAllReels() {
    for (let c = 0; c < COLS; c++) {
        SPINS[c] = randomInt(0, REELSET[c].length - 1);
    }
    updateDisplayReels(SPINS);
}

function checkAllPaylines() {
    const wins = [];
    
    for (const [paylineId, pattern] of Object.entries(PAYCOMBINATIONS)) {
        const symbols = [];
        
        for (let col = 0; col < COLS; col++) {
            const row = pattern[col];
            symbols.push(reelsTable[col][row]);
        }
        
        const win = checkWinCombination(symbols, paylineId);
        if (win) {
            wins.push(win);
        }
    }

    return wins;
}

function checkWinCombination(symbols, paylineId) {
    const symbol = symbols[0];

    let count = 1;
    for (let i = 1; i < symbols.length; i++) {
        if (symbols[i] === symbol) {
            count++;
        } 
        else {
            break;
        }
    }

    if (count >= 3 && PAYTABLE[symbol]) {
        const payout = PAYTABLE[symbol][count - 3];  // index: 3=0, 4=1, 5=2
        
        return {
            paylineId: parseInt(paylineId),
            symbol: symbol,
            count: count,
            payout: payout
        };
    }
    
    return null;
}

function updateWinTexts(wins) {
    const totalPayout = wins.reduce((total, win) => total + win.payout, 0);
    let fullText = `${WIN_TEXT}${totalPayout}`;
    wins.forEach(win => {
        fullText += `${PAYLINE_TEXT} ${win.paylineId}, ${win.symbol} x${win.count}, ${win.payout}`;
    });
    updateText(winText, fullText);

    const availableHeight = (DESIGN_HEIGHT / 2) - winText.y;
    if (winText.height > availableHeight) {
        const scale = availableHeight / winText.height;
        winText.scale.set(scale);
    }
    else {
        winText.scale.set(1);
    }
}