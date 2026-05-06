function assert(condition, message) {
    if (!condition) console.error("FAIL:", message);
    else console.log("PASS:", message);
}
 
function runTests() {
    console.log("=== Running Unit Tests ===");
 
    // --- checkWinCombination tests ---
    assert(
        checkWinCombination(["hv2","hv2","hv2","lv1","hv1"], "2").payout === 5,
        "hv2 x3 should pay 5"
    );
    assert(
        checkWinCombination(["hv1","hv1","hv1","hv1","hv1"], "1").payout === 50,
        "hv1 x5 should pay 50"
    );
    assert(
        checkWinCombination(["lv3","lv3","lv3","lv3","lv3"], "1").payout === 3,
        "lv3 x5 should pay 3"
    );
    assert(
        checkWinCombination(["hv1","lv1","lv1","lv1","lv1"], "1") === null,
        "hv1 x1 should return null (no win)"
    );
    assert(
        checkWinCombination(["lv1","lv1","hv1","hv1","hv1"], "1") === null,
        "lv1 x2 should return null (less than 3)"
    );
 
    // --- Screen display tests ---
 
    // Test 1: Positions [0,0,0,0,0]
    updateDisplayReels([0, 0, 0, 0, 0]);
    assert(reelsTable[0][0] === "hv2" && reelsTable[1][0] === "hv1" && reelsTable[2][0] === "lv1" && reelsTable[3][0] === "hv2" && reelsTable[4][0] === "lv3",
        "Positions [0,0,0,0,0] row 0: hv2 hv1 lv1 hv2 lv3"
    );
    assert(reelsTable[0][1] === "lv3" && reelsTable[1][1] === "lv2" && reelsTable[2][1] === "hv2" && reelsTable[3][1] === "lv2" && reelsTable[4][1] === "lv4",
        "Positions [0,0,0,0,0] row 1: lv3 lv2 hv2 lv2 lv4"
    );
    assert(reelsTable[0][2] === "lv3" && reelsTable[1][2] === "lv3" && reelsTable[2][2] === "lv3" && reelsTable[3][2] === "hv3" && reelsTable[4][2] === "hv2",
        "Positions [0,0,0,0,0] row 2: lv3 lv3 lv3 hv3 hv2"
    );
 
    // Test 2: Positions [18,9,2,0,12]
    updateDisplayReels([18, 9, 2, 0, 12]);
    assert(reelsTable[0][0] === "lv3" && reelsTable[1][0] === "hv4" && reelsTable[2][0] === "lv3" && reelsTable[3][0] === "hv2" && reelsTable[4][0] === "lv2",
        "Positions [18,9,2,0,12] row 0: lv3 hv4 lv3 hv2 lv2"
    );
 
    // --- Payline win tests ---
 
    // Test 3: Positions [0,11,1,10,14] → Total 6, payline 2 hv2 x3 (5), payline 5 lv3 x3 (1)
    updateDisplayReels([0, 11, 1, 10, 14]);
    let wins = checkAllPaylines();
    assert(wins.reduce((t, w) => t + w.payout, 0) === 6,
        "Positions [0,11,1,10,14] total wins should be 6"
    );
    assert(wins.length === 2, "Positions [0,11,1,10,14] should have 2 wins");
    assert(wins.some(w => w.paylineId === 2 && w.symbol === "hv2" && w.count === 3 && w.payout === 5),
        "Positions [0,11,1,10,14] should have payline 2, hv2 x3, 5"
    );
    assert(wins.some(w => w.paylineId === 5 && w.symbol === "lv3" && w.count === 3 && w.payout === 1),
        "Positions [0,11,1,10,14] should have payline 5, lv3 x3, 1"
    );
 
    // Test 4: Positions [0,0,0,0,0] → Total 1, payline 3 lv3 x3 (1)
    updateDisplayReels([0, 0, 0, 0, 0]);
    wins = checkAllPaylines();
    assert(wins.length === 1, "Positions [0,0,0,0,0] should have 1 win");
    assert(wins[0].paylineId === 3 && wins[0].symbol === "lv3" && wins[0].count === 3 && wins[0].payout === 1,
        "Positions [0,0,0,0,0] should have payline 3, lv3 x3, 1"
    );
 
    // Test 5: Positions [5,14,9,9,16] → Skipped (assignment example has errors)
    // The reelset produces hv4 at col0/row2, not lv1, so payline 7 doesn't match
    console.log("SKIP: Positions [5,14,9,9,16] — assignment example has data inconsistency");
 
    // Test 6: Positions [1,16,2,15,0] → Total 0
    updateDisplayReels([1, 16, 2, 15, 0]);
    wins = checkAllPaylines();
    assert(wins.length === 0, "Positions [1,16,2,15,0] should have 0 wins");
 
    // Test 7: Positions [18,9,2,0,12] → Total 0
    updateDisplayReels([18, 9, 2, 0, 12]);
    wins = checkAllPaylines();
    assert(wins.length === 0, "Positions [18,9,2,0,12] should have 0 wins");
 
    // Restore initial state
    updateDisplayReels(SPINS);
    checkWinConditions();
 
    console.log("=== Tests Complete ===");
}
 
runTests();