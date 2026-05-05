const app = new PIXI.Application({
    resizeTo: window,
    backgroundColor: 0xFFFFFF
});

document.body.appendChild(app.view);

const container = new PIXI.Container();
const uiContainer  = new PIXI.Container();
const reelsContainer = new PIXI.Container();

container.addChild(uiContainer );
container.addChild(reelsContainer);
app.stage.addChild(container);

resize();
app.renderer.on("resize", resize);

const text = new PIXI.Text("Basic Slot Machine", {
    fill: "black",
    fontSize: 40
});
text.x = -text.width / 2;
text.y = -250;

uiContainer.addChild(text);

const reelTable = [];
init();

// ***** FUNCTIONS *****

// ***** ASYNC *****
async function init() {
    const reelSymbols = ["hv1_symbol", "hv2_symbol", "hv3_symbol", "hv4_symbol", "lv1_symbol", "lv2_symbol", "lv3_symbol", "lv4_symbol", "spin_button"];
    const textures = await loadAssets(reelSymbols);
    initReels(textures);
}

async function loadAssets(symbols){
    const textures = {};

    for (let symbol of symbols) {
        const texture = await PIXI.Assets.load(
            `https://raw.githubusercontent.com/n-larralde/BasicSlotMachine/refs/heads/main/assets/${symbol}.png`
        );
        textures[symbol] = texture;
    }

    console.log("Assets loaded");
    return textures;
}

// ***** SYNC *****

function initReels(textures) {
    const COLS = 5;
    const ROWS = 3;
    const REEL_SIZE = 125;

    const offsetX = -(COLS * REEL_SIZE) / 2;
    const offsetY = -(ROWS * REEL_SIZE) / 2;

    for (let c = 0; c < COLS; c++) {
        const col = [];

        for (let r = 0; r < ROWS; r++){
            const sprite = new PIXI.Sprite(textures["hv1_symbol"]);
            sprite.width = REEL_SIZE;
            sprite.height = REEL_SIZE;
            sprite.x = offsetX + c * REEL_SIZE;
            sprite.y = offsetY + r * REEL_SIZE;
            col.push(sprite);
            reelsContainer.addChild(sprite);
        }

        reelTable.push(col);
    }
}

function resize() {
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;
}