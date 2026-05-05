// *********************
// ***** CORE *****
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
const loadingText = new PIXI.Text("Loading...", {
    fill: "black",
    fontSize: 40
});
loadingText.x = -loadingText.width / 2;
uiContainer.addChild(loadingText);

// Assets Loading
PIXI.Assets.addBundle("game-symbols", {
    hv1_symbol: "https://raw.githubusercontent.com/n-larralde/BasicSlotMachine/refs/heads/main/assets/hv1_symbol.png",
    hv2_symbol: "https://raw.githubusercontent.com/n-larralde/BasicSlotMachine/refs/heads/main/assets/hv2_symbol.png",
    hv3_symbol: "https://raw.githubusercontent.com/n-larralde/BasicSlotMachine/refs/heads/main/assets/hv3_symbol.png",
    hv4_symbol: "https://raw.githubusercontent.com/n-larralde/BasicSlotMachine/refs/heads/main/assets/hv4_symbol.png",
    lv1_symbol: "https://raw.githubusercontent.com/n-larralde/BasicSlotMachine/refs/heads/main/assets/lv1_symbol.png",
    lv2_symbol: "https://raw.githubusercontent.com/n-larralde/BasicSlotMachine/refs/heads/main/assets/lv2_symbol.png",
    lv3_symbol: "https://raw.githubusercontent.com/n-larralde/BasicSlotMachine/refs/heads/main/assets/lv3_symbol.png",
    lv4_symbol: "https://raw.githubusercontent.com/n-larralde/BasicSlotMachine/refs/heads/main/assets/lv4_symbol.png",
    spin_button: "https://raw.githubusercontent.com/n-larralde/BasicSlotMachine/refs/heads/main/assets/spin_button.png"
});

const textures = [];
const reelTable = [];

// Launch Init
init();

// *********************
// ***** FUNCTIONS *****
// *********************

// ***** ASYNC *****
async function init() {
    const textures = await PIXI.Assets.loadBundle("game-symbols", (progress) => {
        loadingText.text = `Loading... ${Math.round(progress * 100)}%`;
        for(let t = 0; t < 100000000; t++){
            Math.random();
        }
    });

    console.log("All Assets loaded");

    loadingText.destroy();

    // Slot Machine Text
    const slotMachineText = new PIXI.Text("Basic Slot Machine", {
        fill: "black",
        fontSize: 40
    });
    slotMachineText.x = -slotMachineText.width / 2;
    slotMachineText.y = -250;
    uiContainer.addChild(slotMachineText);

    initReels(textures);
}

// ***** SYNC *****
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

    console.log("Reels initialized");
}

function resize() {
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    console.log("Screen resized:", app.screen.width, app.screen.height);
}