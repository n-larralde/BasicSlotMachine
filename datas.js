// *********************
// ******* DATAS *******
// *********************

// Slot Machine Configuration
const COLS = 5;
const ROWS = 3;
const REEL_SIZE = 125;
let NB_WINS = 0;

// Screen
const DESIGN_WIDTH = 500;
const DESIGN_HEIGHT = 800;

// Spins = CHANGE VALUES HERE TO TEST DIRECTLY THE WIN CONDITIONS
const SPINS = [5, 14, 9, 9, 16]; // Initial spins (can be randomized)

// Assets URLs
const ASSETS = Object.freeze({
    lv1: "https://raw.githubusercontent.com/n-larralde/BasicSlotMachine/refs/heads/main/assets/lv1_symbol.png",
    lv2: "https://raw.githubusercontent.com/n-larralde/BasicSlotMachine/refs/heads/main/assets/lv2_symbol.png",
    lv3: "https://raw.githubusercontent.com/n-larralde/BasicSlotMachine/refs/heads/main/assets/lv3_symbol.png",
    lv4: "https://raw.githubusercontent.com/n-larralde/BasicSlotMachine/refs/heads/main/assets/lv4_symbol.png",
    hv1: "https://raw.githubusercontent.com/n-larralde/BasicSlotMachine/refs/heads/main/assets/hv1_symbol.png",
    hv2: "https://raw.githubusercontent.com/n-larralde/BasicSlotMachine/refs/heads/main/assets/hv2_symbol.png",
    hv3: "https://raw.githubusercontent.com/n-larralde/BasicSlotMachine/refs/heads/main/assets/hv3_symbol.png",
    hv4: "https://raw.githubusercontent.com/n-larralde/BasicSlotMachine/refs/heads/main/assets/hv4_symbol.png",
    spin_button: "https://raw.githubusercontent.com/n-larralde/BasicSlotMachine/refs/heads/main/assets/spin_button.png"
});

// Reelset
const REELSET = [
    ["hv2", "lv3", "lv3", "hv1", "hv1", "lv1", "hv1", "hv4", "lv1", "hv3", "hv2", "hv3", "lv4", "hv4", "lv1", "hv2", "lv4", "lv1", "lv3", "hv2"],
    ["hv1", "lv2", "lv3", "lv2", "lv1", "lv1", "lv4", "lv1", "lv1", "hv4", "lv3", "hv2", "lv1", "lv3", "hv1", "lv1", "lv2", "lv4", "lv3", "lv2"],
    ["lv1", "hv2", "lv3", "lv4", "hv3", "hv2", "lv2", "hv2", "hv2", "lv1", "hv3", "lv1", "hv1", "lv2", "hv3", "hv2", "hv4", "hv1", "lv2", "lv4"],
    ["hv2", "lv2", "hv3", "lv2", "lv4", "lv4", "hv3", "lv2", "lv4", "hv1", "lv1", "hv1", "lv2", "hv3", "lv2", "lv3", "hv2", "lv1", "hv3", "lv2"],
    ["lv3", "lv4", "hv2", "hv3", "hv4", "hv1", "hv3", "hv2", "hv2", "hv4", "hv4", "hv2", "lv2", "hv4", "hv1", "lv2", "hv1", "lv2", "hv4", "lv4"]
];

// Loading fake loop count (to simulate loading time)
const USE_FAKE_LOADER = false;
const FAKE_LOADER_LOOP_COUNT = 50000000;

// Texts
const MAIN_TITLE = "Basic Slot Machine";
const MAIN_TITLE_COLOR = "black";
const MAIN_TITLE_FONT_SIZE = 40;

const LOADING_TEXT = "Loading... 0%";
const LOADING_TEXT_COLOR = "black";
const LOADING_TEXT_FONT_SIZE = 40;  

const SPIN_BUTTON_TEXT = "Spin";
const SPIN_BUTTON_TEXT_COLOR = "black";
const SPIN_BUTTON_TEXT_FONT_SIZE = 20;
const SPIN_BUTTON_WIDTH = 100;
const SPIN_BUTTON_HEIGHT = 50;
const SPIN_BUTTON_FILL_COLOR = "lightgray";

// Win Parameters
const WIN_TEXT = "Total wins: ";
const WIN_TEXT_COLOR = "green";
const WIN_TEXT_FONT_SIZE = 20;

// [3 of a kind, 4 of a kind, 5 of a kind]
const PAYTABLE = { 
    hv1: [10, 20, 50],
    hv2: [5, 10, 20],
    hv3: [5, 10, 15],
    hv4: [5, 10, 15],
    lv1: [2, 5, 10],
    lv2: [1, 2, 5],
    lv3: [1, 2, 3],
    lv4: [1, 2, 3]
};

const PAYCOMBINATIONS = {
    1: [1, 1, 1, 1, 1],
    2: [0, 0, 0, 0, 0],
    3: [2, 2, 2, 2, 2],
    4: [0, 0, 1, 2, 2],
    5: [2, 2, 1, 0, 0],
    6: [0, 1, 2, 1, 0],
    7: [2, 1, 0, 1, 2]
};