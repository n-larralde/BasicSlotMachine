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

// Loading Text
const loadingText =addText(LOADING_TEXT, LOADING_TEXT_COLOR, LOADING_TEXT_FONT_SIZE, 0, 0);

// Assets Loading
PIXI.Assets.addBundle("game-symbols", ASSETS);

const textures = [];
const reelTable = [];

init();

// *********************
// ***** FUNCTIONS *****
// *********************

// ******* ASYNC *******

async function init() {
    const textures = await PIXI.Assets.loadBundle("game-symbols", (progress) => {
        loadingText.text = `Loading... ${Math.round(progress * 100)}%`;
        if(USE_FAKE_LOADER){
            for(let t = 0; t < FAKE_LOADER_LOOP_COUNT; t++){
                Math.random();
            }
        }
    });

    console.log("All Assets loaded");

    loadingText.destroy();

    displayReels(textures, [0, 0, 0, 0, 0]);

    addText(MAIN_TITLE, MAIN_TITLE_COLOR, MAIN_TITLE_FONT_SIZE, 0, -300);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ******* SYNC *******

function displayReels(textures, positions) {
    const offsetX = -(COLS * REEL_SIZE) / 2;
    const offsetY = -(ROWS * REEL_SIZE) / 2;
    let tempPositions = positions;

    for (let c = 0; c < COLS; c++) {
        
        const col = [];

        for (let r = 0; r < ROWS; r++){
            console.log(tempPositions);

            const sprite = new PIXI.Sprite(textures[REELSET[tempPositions[c]][r]]);
            sprite.width = REEL_SIZE;
            sprite.height = REEL_SIZE;
            sprite.x = offsetX + c * REEL_SIZE;
            sprite.y = offsetY + r * REEL_SIZE;
            reelsContainer.addChild(sprite);
            col.push(sprite);
        }

        tempPositions = tempPositions.map(pos => (pos + 1) % REELSET[c].length);
        
        reelTable.push(col);
    }

    console.log("Reels initialized");
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