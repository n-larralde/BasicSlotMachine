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
const uiContainer  = new PIXI.Container();
const reelsContainer = new PIXI.Container();

container.addChild(reelsContainer);
container.addChild(uiContainer );
app.stage.addChild(container);

// Resize handling
resize();
app.renderer.on("resize", resize);

// Texts
const loadingText = addText(LOADING_TEXT, LOADING_TEXT_COLOR, LOADING_TEXT_FONT_SIZE, 0, 0);
const winText = addText("", WIN_TEXT_COLOR, WIN_TEXT_FONT_SIZE, 0, 275);
const paylineText = addText("", WIN_TEXT_COLOR, WIN_TEXT_FONT_SIZE, 0, 285);

// Assets Loading
PIXI.Assets.addBundle("game-symbols", ASSETS);

let textures = [];
let reelsTable = [];

init();

// *********************
// ***** FUNCTIONS *****
// *********************

// ******* ASYNC *******

async function init() {
    textures = await PIXI.Assets.loadBundle("game-symbols", (progress) => {
        updateText(loadingText, `Loading... ${Math.round(progress * 100)}%`);

        if(USE_FAKE_LOADER){
            for(let t = 0; t < FAKE_LOADER_LOOP_COUNT; t++){
                Math.random();
            }
        }
    });

    console.log("All Assets loaded");

    loadingText.destroy();

    updateDisplayReels(SPINS);
    checkWinConditions();

    console.log("Reels initialized");

    addText(MAIN_TITLE, MAIN_TITLE_COLOR, MAIN_TITLE_FONT_SIZE, 0, -275);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ******* SYNC *******

function updateDisplayReels(positions) {
    // Reset reels
    reelsContainer.removeChildren();
    reelsTable.length = 0;

    const offsetX = -(COLS * REEL_SIZE) / 2;
    const offsetY = -(ROWS * REEL_SIZE) / 2;

    for (let c = 0; c < COLS; c++) {
        const col = [];
        let symbol = "";
        let colSymbols = [];

        for (let r = 0; r < ROWS; r++){
            const index = (positions[c] + r) % REELSET[c].length;
            symbol = REELSET[c][index];
            const sprite = new PIXI.Sprite(textures[symbol]);
            sprite.width = REEL_SIZE;
            sprite.height = REEL_SIZE;
            sprite.x = offsetX + c * REEL_SIZE;
            sprite.y = offsetY + r * REEL_SIZE;
            reelsContainer.addChild(sprite);
            col.push(sprite);
            colSymbols.push(symbol);
        }

        const positionX = offsetX + c * REEL_SIZE + (REEL_SIZE - SPIN_BUTTON_WIDTH) / 2;
        const positionY = offsetY + ROWS * REEL_SIZE + 10;
        const button = addButton(c, SPIN_BUTTON_TEXT, positionX, positionY);
        reelsContainer.addChild(button);

        reelsTable.push(colSymbols);
    }
}

function resize() {
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;
    console.log("Screen resized:", app.screen.width, app.screen.height);
}

function addText(text, color, fontSize, positionX, positionY) {
    const pixiText = new PIXI.Text(text, {
        fill: color,
        fontSize: fontSize
    });

    pixiText.x = positionX == 0 ? -pixiText.width / 2 : positionX;
    pixiText.y = positionY;
    uiContainer.addChild(pixiText);
    
    return pixiText;
}

function updateText(pixiText, newText) {
    pixiText.text = newText;
    pixiText.x = -pixiText.width / 2;
}

function addButton(columnIndex, text, positionX = 0, positionY = 0) {
    const button = new PIXI.Graphics();
    button.beginFill(SPIN_BUTTON_FILL_COLOR);
    button.drawRoundedRect(0, 0, SPIN_BUTTON_WIDTH, SPIN_BUTTON_HEIGHT, 10);
    button.endFill();

    button.x = positionX;
    button.y = positionY;

    button.eventMode = 'static';
    button.cursor = 'pointer';

    const genericText = new PIXI.Text(text, {
        fontSize: SPIN_BUTTON_TEXT_FONT_SIZE,
        fill: SPIN_BUTTON_TEXT_COLOR
    });

    genericText.anchor.set(0.5);
    genericText.x = SPIN_BUTTON_WIDTH / 2;
    genericText.y = SPIN_BUTTON_HEIGHT / 2;

    button.addChild(genericText);

    // Events
    button.on('pointerdown', () => {
        button.tint = 0x2980b9; // Visual feedback for click
        randomizeReels(columnIndex);
        checkWinConditions();

        setTimeout(() => {
            button.tint = 0xffffff; // Reset after click
        }, 100);
    });

    button.on('pointerover', () => {
        button.tint = 0x5dade2; // Hover
    });

    button.on('pointerout', () => {
        button.tint = 0xffffff; // Reset
    });

    return button;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkWinConditions(){
    const wins = checkAllPaylines();
    if(wins.length > 0){
        console.log("Wins:", wins);
    }

    updateWinTexts(wins);
}

function randomizeReels(columnIndex) {
    const newIndex = randomInt(0, REELSET[columnIndex].length - 1);
    SPINS[columnIndex] = newIndex;
    updateDisplayReels(SPINS);
}

function checkAllPaylines() {
    const wins = [];
    
    for (const [paylineId, pattern] of Object.entries(PAYCOMBINATIONS )) {
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
            payout: payout,
            positions: symbols.slice(0, count)
        };
    }
    
    return null;
}

function updateWinTexts(wins) {
    const totalPayout = wins.reduce((total, win) => total + win.payout, 0);

    updateText(winText, `Total wins: ${totalPayout}`);

    updateText(paylineText, "");

    wins.forEach((win, index) => {
        updateText(paylineText, paylineText.text + `\n- payline ${win.paylineId}, ${win.symbol} x${win.count}, ${win.payout}`);
    });
}