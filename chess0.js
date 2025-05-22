// Game state
let points = 0;
let income = 1;
let pawnUpgrades = 0;
let knightUpgrades = 0;
let relicCollected = false;
let relicBonus = 1;

// Track how many of each piece you own
let owned = {
  pawn: 0,
  knight: 0,
  bishop: 0,
  rook: 0,
  queen: 0,
  king: 0,
  grandmaster: 0,
  ai: 0,
  god: 0
};


// Pawn income multiplier
let pawnIncome = 1;

// Manual move bonus multiplier (percentage of income per move)
let moveBonusPercent = 0;

// Combine all upgrades and pieces into one list
const allUpgrades = [
  // Pieces
  { name: "Buy Pawn", effect: "+1 pawn", apply: () => { owned.pawn++; }, price: 50, bought: false, repeatable: true, type: "pawn" },
  { name: "Upgrade Pawn", effect: "x2 pawn income", apply: () => { pawnIncome *= 2; }, price: 200, bought: false, repeatable: true, type: "pawnUpgrade" },
  { name: "Knight", effect: "+5/sec", apply: () => { owned.knight++; }, price: 250, bought: false, repeatable: true, type: "knight" },
  { name: "Bishop", effect: "+15/sec", apply: () => { owned.bishop++; }, price: 1000, bought: false, repeatable: true, type: "bishop" },
  { name: "Rook", effect: "+50/sec", apply: () => { owned.rook++; }, price: 5000, bought: false, repeatable: true, type: "rook" },
  { name: "Queen", effect: "+200/sec", apply: () => { owned.queen++; }, price: 20000, bought: false, repeatable: true, type: "queen" },
  { name: "King", effect: "+1000/sec", apply: () => { owned.king++; }, price: 100000, bought: false, repeatable: true, type: "king" },
  { name: "Grandmaster", effect: "+5000/sec", apply: () => { owned.grandmaster++; }, price: 500000, bought: false, repeatable: true, type: "grandmaster" },
  { name: "AI Engine", effect: "+20000/sec", apply: () => { owned.ai++; }, price: 2000000, bought: false, repeatable: true, type: "ai" },
  { name: "Chess God", effect: "+100000/sec", apply: () => { owned.god++; }, price: 10000000, bought: false, repeatable: true, type: "god" },
  // Upgrades
  { name: "Double Move", effect: "+100% income", apply: () => { income *= 2; }, price: 25000, bought: false, repeatable: false },
  { name: "Auto Relic", effect: "Auto-collect relic", apply: () => { relicCollected = true; relicBonus = 1.1; relicMsg.textContent = "Relic Collected! +10% total income."; }, price: 100000, bought: false, repeatable: false },
  { name: "Chess Clock", effect: "+10% income", apply: () => { relicBonus *= 1.1; }, price: 500000, bought: false, repeatable: false },
  { name: "Infinite Board", effect: "+500% income", apply: () => { income *= 5; }, price: 5000000, bought: false, repeatable: false },
  // Move upgrades
  { name: "Move Bonus I", effect: "+1% income per move", apply: () => { moveBonusPercent += 0.01; }, price: 1000, bought: false, repeatable: true, type: "moveBonus" },
  { name: "Move Bonus II", effect: "+5% income per move", apply: () => { moveBonusPercent += 0.05; }, price: 10000, bought: false, repeatable: true, type: "moveBonus" },
  { name: "Move Bonus III", effect: "+10% income per move", apply: () => { moveBonusPercent += 0.10; }, price: 100000, bought: false, repeatable: true, type: "moveBonus" }
];

// UI elements
const pointsEl = document.getElementById('points');
const incomeEl = document.getElementById('income');
const moveBtn = document.getElementById('moveBtn');
const pawnBtn = document.getElementById('pawnBtn');
const knightBtn = document.getElementById('knightBtn');
const relicBtn = document.getElementById('relicBtn');
const relicMsg = document.getElementById('relicMsg');
const achv100 = document.getElementById('achv100');
const openShopScreen = document.getElementById('openShopScreen');
const upgradeList = document.getElementById('upgradeList');
const modalShopList = document.getElementById('modalShopList');
const cheatBtn = document.getElementById('cheatBtn');
const chessBoardEl = document.getElementById('chessBoard');
const ownedEl = document.getElementById('ownedBar'); // new element for owned display
const statsBox = document.getElementById('displayStats'); // new stats box
const pawnBtn5 = document.getElementById('pawnBtn5');
const pawnBtn25 = document.getElementById('pawnBtn25');
const pawnBtnMax = document.getElementById('pawnBtnMax');
const knightBtn5 = document.getElementById('knightBtn5');
const knightBtn25 = document.getElementById('knightBtn25');
const knightBtnMax = document.getElementById('knightBtnMax');
const bishopBtn = document.getElementById('bishopBtn');
const bishopBtn5 = document.getElementById('bishopBtn5');
const bishopBtn25 = document.getElementById('bishopBtn25');
const bishopBtnMax = document.getElementById('bishopBtnMax');
const rookBtn = document.getElementById('rookBtn');
const rookBtn5 = document.getElementById('rookBtn5');
const rookBtn25 = document.getElementById('rookBtn25');
const rookBtnMax = document.getElementById('rookBtnMax');
const queenBtn = document.getElementById('queenBtn');
const queenBtn5 = document.getElementById('queenBtn5');
const queenBtn25 = document.getElementById('queenBtn25');
const queenBtnMax = document.getElementById('queenBtnMax');
const kingBtn = document.getElementById('kingBtn');
const kingBtn5 = document.getElementById('kingBtn5');
const kingBtn25 = document.getElementById('kingBtn25');
const kingBtnMax = document.getElementById('kingBtnMax');
const grandmasterBtn = document.getElementById('grandmasterBtn');
const grandmasterBtn5 = document.getElementById('grandmasterBtn5');
const grandmasterBtn25 = document.getElementById('grandmasterBtn25');
const grandmasterBtnMax = document.getElementById('grandmasterBtnMax');
const aiBtn = document.getElementById('aiBtn');
const aiBtn5 = document.getElementById('aiBtn5');
const aiBtn25 = document.getElementById('aiBtn25');
const aiBtnMax = document.getElementById('aiBtnMax');
const godBtn = document.getElementById('godBtn');
const godBtn5 = document.getElementById('godBtn5');
const godBtn25 = document.getElementById('godBtn25');
const godBtnMax = document.getElementById('godBtnMax');
const click10xBtn = document.getElementById('click10xBtn');

// Track unlocked pieces for board display
let unlockedPieces = {
  pawn: true,
  knight: false,
  bishop: false,
  rook: false,
  queen: false,
  king: false
};

// Unicode symbols for chess pieces
const pieceSymbols = {
  pawn: '♙',
  knight: '♘',
  bishop: '♗',
  rook: '♖',
  queen: '♕',
  king: '♔'
};

// Format number with commas or shorten if large
function formatNum(n) {
  n = Math.floor(n);
  if (n < 1e4) return n.toLocaleString();

  // Extended suffixes for large numbers
  const suffixes = [
    { value: 1e303, symbol: "Ve" }, // Vecillion
    { value: 1e300, symbol: "Xo" }, // Xonillion
    { value: 1e297, symbol: "Yo" }, // Yoctillion
    { value: 1e294, symbol: "Ze" }, // Zeptillion
    { value: 1e291, symbol: "At" }, // Attilion
    { value: 1e288, symbol: "Fe" }, // Femtillion
    { value: 1e285, symbol: "Pi" }, // Picillion
    { value: 1e282, symbol: "Na" }, // Nanillion
    { value: 1e279, symbol: "Mc" }, // Micrillion

    { value: 1e276, symbol: "CeMi" }, // Centimillillion
    { value: 1e273, symbol: "DCeMi" }, // Ducentimillillion
    { value: 1e270, symbol: "TCeMi" }, // Trecentimillillion
    { value: 1e267, symbol: "VgMi" }, // Vigintimillillion
    { value: 1e264, symbol: "DeMi" }, // Decimillillion
    { value: 1e261, symbol: "TMi" }, // Tremillillion
    { value: 1e258, symbol: "DMi" }, // Duomillillion
    { value: 1e255, symbol: "Mi-T" }, // Milli-Trillion
    { value: 1e252, symbol: "Mi-B" }, // Milli-billion
    { value: 1e249, symbol: "Mi-M" }, // Milli-million
    { value: 1e246, symbol: "Mi" }, // Millillion

    { value: 1e243, symbol: "NoC" }, // Nongentillion
    { value: 1e240, symbol: "OcC" }, // Octingentillion
    { value: 1e237, symbol: "SpC" }, // Septingentillion
    { value: 1e234, symbol: "SxC" }, // Sescentillion
    { value: 1e231, symbol: "QnC" }, // Quincentillion
    { value: 1e228, symbol: "QdC" }, // Quadringentillion
    { value: 1e225, symbol: "TCe" }, // Trecentillion
    { value: 1e222, symbol: "DCe" }, // Ducentillion
    { value: 1e219, symbol: "Ce" }, // Centillion

    { value: 1e216, symbol: "Ng" }, // Nonagintillion
    { value: 1e213, symbol: "Og" }, // Octogintillion
    { value: 1e210, symbol: "Sg" }, // Septuagintillion
    { value: 1e207, symbol: "Se" }, // Sexagintillion
    { value: 1e204, symbol: "Qi" }, // Quinquagintillion
    { value: 1e201, symbol: "Qa" }, // Quadragintillion
    { value: 1e198, symbol: "Tg" }, // Trigintillion
    { value: 1e195, symbol: "Vg" }, // Vigintillion

    { value: 1e192, symbol: "DeMi" }, // Decimillillion (repeat for completeness)
    { value: 1e189, symbol: "TDe" }, // Tredecillion
    { value: 1e186, symbol: "DDe" }, // Duodecillion
    { value: 1e183, symbol: "UDe" }, // Undecillion
    { value: 1e180, symbol: "De" }, // Decillion
    { value: 1e177, symbol: "No" }, // Nonillion
    { value: 1e174, symbol: "Oc" }, // Octillion
    { value: 1e171, symbol: "Sp" }, // Septillion
    { value: 1e168, symbol: "Sx" }, // Sextillion
    { value: 1e165, symbol: "Qn" }, // Quintillion
    { value: 1e162, symbol: "Qd" }, // Quadrillion
    { value: 1e159, symbol: "T" }, // Trillion (repeat for completeness)
    { value: 1e156, symbol: "B" }, // Billion (repeat for completeness)
    { value: 1e153, symbol: "M" }, // Million (repeat for completeness)
    { value: 1e150, symbol: "K" }, // Thousand (repeat for completeness)

    { value: 1e15, symbol: "Qd" }, // Quadrillion
    { value: 1e12, symbol: "T" }, // Trillion
    { value: 1e9, symbol: "B" }, // Billion
    { value: 1e6, symbol: "M" }, // Million
    { value: 1e3, symbol: "K" } // Thousand
  ];

  for (let i = 0; i < suffixes.length; i++) {
    if (n >= suffixes[i].value) {
      let num = n / suffixes[i].value;
      // Always show at most two digits before the decimal dot
      let digits = num >= 100 ? 0 : (num >= 10 ? 1 : 2);
      let str = num.toFixed(digits);
      // Remove trailing .0 or .00
      str = str.replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1');
      return str + ' <b>' + suffixes[i].symbol + '</b>';
    }
  }
  return n.toLocaleString();
}

let clickMultiplier = 1;
let click10xUnlocked = false;

function getMoveBtnText() {
  let moveBonus = income * moveBonusPercent;
  let total = clickMultiplier * (1 + moveBonus);
  return `Make a Move (+${formatNum(total)})`;
}

// Update UI
function updateUI() {
  pointsEl.textContent = formatNum(points);
  // Calculate total income
  let totalIncome = owned.pawn * pawnIncome
    + owned.knight * 5
    + owned.bishop * 15
    + owned.rook * 50
    + owned.queen * 200
    + owned.king * 1000
    + owned.grandmaster * 5000
    + owned.ai * 20000
    + owned.god * 100000;
  income = totalIncome;
  incomeEl.textContent = formatNum(income * relicBonus);
  pawnBtn.disabled = points < allUpgrades[0].price;
  knightBtn.disabled = points < allUpgrades[2].price;
  relicBtn.disabled = relicCollected;
  moveBtn.textContent = getMoveBtnText();
  click10xBtn.disabled = click10xUnlocked || points < 10000;
  if (points >= 100) achv100.classList.remove('d-none');
  updateUpgradeList(upgradeList);
  checkUnlocks();
  renderChessBoard();
  renderOwnedBar();
  renderStatsBox();
  updatePieceBuyButtons();
}

// Helper to update piece-buy button labels with current prices
function updatePieceBuyButtons() {
  // Pawn
  pawnBtn.innerHTML = `♙ Buy Pawn (+1) - ${formatNum(allUpgrades[0].price)} pts`;
  pawnBtn5.innerHTML = `5x ♙ - ${formatNum(getBulkCost(allUpgrades[0], 5))} pts`;
  pawnBtn25.innerHTML = `25x ♙ - ${formatNum(getBulkCost(allUpgrades[0], 25))} pts`;
  pawnBtnMax.innerHTML = `∞ ♙ - ${formatNum(getBulkCost(allUpgrades[0], getMaxBuy(allUpgrades[0])))} pts`;

  // Knight
  knightBtn.innerHTML = `♘ Buy Knight (+5/sec) - ${formatNum(allUpgrades[2].price)} pts`;
  knightBtn5.innerHTML = `5x ♘ - ${formatNum(getBulkCost(allUpgrades[2], 5))} pts`;
  knightBtn25.innerHTML = `25x ♘ - ${formatNum(getBulkCost(allUpgrades[2], 25))} pts`;
  knightBtnMax.innerHTML = `∞ ♘ - ${formatNum(getBulkCost(allUpgrades[2], getMaxBuy(allUpgrades[2])))} pts`;

  // Bishop
  bishopBtn.innerHTML = `♗ Buy Bishop (+15/sec) - ${formatNum(allUpgrades[3].price)} pts`;
  bishopBtn5.innerHTML = `5x ♗ - ${formatNum(getBulkCost(allUpgrades[3], 5))} pts`;
  bishopBtn25.innerHTML = `25x ♗ - ${formatNum(getBulkCost(allUpgrades[3], 25))} pts`;
  bishopBtnMax.innerHTML = `∞ ♗ - ${formatNum(getBulkCost(allUpgrades[3], getMaxBuy(allUpgrades[3])))} pts`;

  // Rook
  rookBtn.innerHTML = `♖ Buy Rook (+50/sec) - ${formatNum(allUpgrades[4].price)} pts`;
  rookBtn5.innerHTML = `5x ♖ - ${formatNum(getBulkCost(allUpgrades[4], 5))} pts`;
  rookBtn25.innerHTML = `25x ♖ - ${formatNum(getBulkCost(allUpgrades[4], 25))} pts`;
  rookBtnMax.innerHTML = `∞ ♖ - ${formatNum(getBulkCost(allUpgrades[4], getMaxBuy(allUpgrades[4])))} pts`;

  // Queen
  queenBtn.innerHTML = `♕ Buy Queen (+200/sec) - ${formatNum(allUpgrades[5].price)} pts`;
  queenBtn5.innerHTML = `5x ♕ - ${formatNum(getBulkCost(allUpgrades[5], 5))} pts`;
  queenBtn25.innerHTML = `25x ♕ - ${formatNum(getBulkCost(allUpgrades[5], 25))} pts`;
  queenBtnMax.innerHTML = `∞ ♕ - ${formatNum(getBulkCost(allUpgrades[5], getMaxBuy(allUpgrades[5])))} pts`;

  // King
  kingBtn.innerHTML = `♔ Buy King (+1000/sec) - ${formatNum(allUpgrades[6].price)} pts`;
  kingBtn5.innerHTML = `5x ♔ - ${formatNum(getBulkCost(allUpgrades[6], 5))} pts`;
  kingBtn25.innerHTML = `25x ♔ - ${formatNum(getBulkCost(allUpgrades[6], 25))} pts`;
  kingBtnMax.innerHTML = `∞ ♔ - ${formatNum(getBulkCost(allUpgrades[6], getMaxBuy(allUpgrades[6])))} pts`;

  // Grandmaster
  grandmasterBtn.innerHTML = `GM Buy Grandmaster (+5000/sec) - ${formatNum(allUpgrades[7].price)} pts`;
  grandmasterBtn5.innerHTML = `5x GM - ${formatNum(getBulkCost(allUpgrades[7], 5))} pts`;
  grandmasterBtn25.innerHTML = `25x GM - ${formatNum(getBulkCost(allUpgrades[7], 25))} pts`;
  grandmasterBtnMax.innerHTML = `∞ GM - ${formatNum(getBulkCost(allUpgrades[7], getMaxBuy(allUpgrades[7])))} pts`;

  // AI
  aiBtn.innerHTML = `🤖 Buy AI Engine (+20000/sec) - ${formatNum(allUpgrades[8].price)} pts`;
  aiBtn5.innerHTML = `5x 🤖 - ${formatNum(getBulkCost(allUpgrades[8], 5))} pts`;
  aiBtn25.innerHTML = `25x 🤖 - ${formatNum(getBulkCost(allUpgrades[8], 25))} pts`;
  aiBtnMax.innerHTML = `∞ 🤖 - ${formatNum(getBulkCost(allUpgrades[8], getMaxBuy(allUpgrades[8])))} pts`;

  // God
  godBtn.innerHTML = `👑 Buy Chess God (+100000/sec) - ${formatNum(allUpgrades[9].price)} pts`;
  godBtn5.innerHTML = `5x 👑 - ${formatNum(getBulkCost(allUpgrades[9], 5))} pts`;
  godBtn25.innerHTML = `25x 👑 - ${formatNum(getBulkCost(allUpgrades[9], 25))} pts`;
  godBtnMax.innerHTML = `∞ 👑 - ${formatNum(getBulkCost(allUpgrades[9], getMaxBuy(allUpgrades[9])))} pts`;
}

// Helper to calculate the total cost for buying n of an upgrade (geometric progression)
function getBulkCost(upg, n) {
  let total = 0;
  let price = upg.price;
  for (let i = 0; i < n; i++) {
    total += price;
    price = Math.floor(price * 2.5);
  }
  return total;
}

// Helper to calculate max buyable amount for a given upgrade
function getMaxBuy(upg) {
  let price = upg.price;
  let count = 0;
  let pts = points;
  while (pts >= price) {
    pts -= price;
    count++;
    price = Math.floor(price * 2.5);
  }
  return count;
}

// Helper to buy n of a repeatable upgrade/piece
function bulkBuy(upg, n) {
  let totalCost = getBulkCost(upg, n);
  if (points < totalCost) return;
  points -= totalCost;
  for (let i = 0; i < n; i++) {
    upg.apply();
    upg.price = Math.floor(upg.price * 2.5);
  }
  buyEffect();
  chessboardFX('buy');
  updateUI();
}

// Helper to buy as many as possible
function buyMax(upg) {
  let max = getMaxBuy(upg);
  if (max > 0) {
    bulkBuy(upg, max);
  }
}

// Render all upgrades/pieces in a given container
function updateUpgradeList(container) {
  container.innerHTML = '';
  allUpgrades.forEach((upg, idx) => {
    // Hide the blue "Chess God" button (index 9)
    if (idx === 9) return;
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-dark w-100 mb-2 upgrade-btn';
    btn.textContent = `${upg.name} (${upg.effect}) - ${formatNum(upg.price)} pts`;
    btn.disabled = points < upg.price || (!upg.repeatable && upg.bought);
    btn.onclick = () => {
      if (points >= upg.price && (upg.repeatable || !upg.bought)) {
        points -= upg.price;
        upg.apply();
        if (upg.repeatable) {
          upg.price = Math.floor(upg.price * 2.5);
        } else {
          upg.bought = true;
        }
        buyEffect();
        chessboardFX('buy');
        updateUI();
      }
    };
    container.appendChild(btn);
  });
}

// Render chessboard with unlocked pieces
function renderChessBoard() {
  if (!chessBoardEl) return;
  chessBoardEl.innerHTML = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      square.className = 'chess-square ' + ((row + col) % 2 === 0 ? 'light' : 'dark');
      // Place pieces on starting squares if unlocked
      if (row === 1 && unlockedPieces.pawn) square.innerHTML = `<span class="chess-piece">${pieceSymbols.pawn}</span>`;
      if (row === 0) {
        if (col === 0 || col === 7) square.innerHTML = unlockedPieces.rook ? `<span class="chess-piece">${pieceSymbols.rook}</span>` : '';
        if (col === 1 || col === 6) square.innerHTML = unlockedPieces.knight ? `<span class="chess-piece">${pieceSymbols.knight}</span>` : '';
        if (col === 2 || col === 5) square.innerHTML = unlockedPieces.bishop ? `<span class="chess-piece">${pieceSymbols.bishop}</span>` : '';
        if (col === 3) square.innerHTML = unlockedPieces.queen ? `<span class="chess-piece">${pieceSymbols.queen}</span>` : '';
        if (col === 4) square.innerHTML = unlockedPieces.king ? `<span class="chess-piece">${pieceSymbols.king}</span>` : '';
      }
      chessBoardEl.appendChild(square);
    }
  }
}

// --- Chessboard FX helpers ---
function chessboardFX(type) {
  if (!chessBoardEl) return;
  const squares = chessBoardEl.querySelectorAll('.chess-square');
  if (type === 'move') {
    // Highlight random pawn row
    for (let i = 8; i < 16; i++) {
      squares[i]?.classList.add('fx-move');
      setTimeout(() => squares[i]?.classList.remove('fx-move'), 500);
    }
  } else if (type === 'buy') {
    // Highlight back rank
    for (let i = 0; i < 8; i++) {
      squares[i]?.classList.add('fx-buy');
      setTimeout(() => squares[i]?.classList.remove('fx-buy'), 700);
    }
  }
}

// Update unlocked pieces when upgrades are bought
function checkUnlocks() {
  // Unlock based on price increase (indicating at least one purchase), or you can use a separate counter if needed
  unlockedPieces.knight = allUpgrades[2].price > 250;
  unlockedPieces.bishop = allUpgrades[3].price > 1000;
  unlockedPieces.rook = allUpgrades[4].price > 5000;
  unlockedPieces.queen = allUpgrades[5].price > 20000;
  unlockedPieces.king = allUpgrades[6].price > 100000;
}

// Idle income
setInterval(() => {
  points += income * relicBonus;
  updateUI();
}, 1000);

// Manual action
moveBtn.addEventListener('click', () => {
  let moveBonus = income * moveBonusPercent;
  points += clickMultiplier * (1 + moveBonus);
  moveEffect();
  chessboardFX('move');
  updateUI();
});

// Pawn and Knight quick buttons (for convenience, use the same logic as in allUpgrades)
pawnBtn.addEventListener('click', () => {
  const upg = allUpgrades[0];
  if (points >= upg.price) {
    points -= upg.price;
    upg.apply();
    upg.price = Math.floor(upg.price * 2.5);
    buyEffect();
    chessboardFX('buy');
    updateUI();
  }
});
pawnBtn5.addEventListener('click', () => bulkBuy(allUpgrades[0], 5));
pawnBtn25.addEventListener('click', () => bulkBuy(allUpgrades[0], 25));
pawnBtnMax.addEventListener('click', () => buyMax(allUpgrades[0]));

knightBtn.addEventListener('click', () => {
  const upg = allUpgrades[2];
  if (points >= upg.price) {
    points -= upg.price;
    upg.apply();
    upg.price = Math.floor(upg.price * 2.5);
    buyEffect();
    chessboardFX('buy');
    updateUI();
  }
});
knightBtn5.addEventListener('click', () => bulkBuy(allUpgrades[2], 5));
knightBtn25.addEventListener('click', () => bulkBuy(allUpgrades[2], 25));
knightBtnMax.addEventListener('click', () => buyMax(allUpgrades[2]));

bishopBtn.addEventListener('click', () => {
  const upg = allUpgrades[3];
  if (points >= upg.price) {
    points -= upg.price;
    upg.apply();
    upg.price = Math.floor(upg.price * 2.5);
    buyEffect();
    chessboardFX('buy');
    updateUI();
  }
});
bishopBtn5.addEventListener('click', () => bulkBuy(allUpgrades[3], 5));
bishopBtn25.addEventListener('click', () => bulkBuy(allUpgrades[3], 25));
bishopBtnMax.addEventListener('click', () => buyMax(allUpgrades[3]));

rookBtn.addEventListener('click', () => {
  const upg = allUpgrades[4];
  if (points >= upg.price) {
    points -= upg.price;
    upg.apply();
    upg.price = Math.floor(upg.price * 2.5);
    buyEffect();
    chessboardFX('buy');
    updateUI();
  }
});
rookBtn5.addEventListener('click', () => bulkBuy(allUpgrades[4], 5));
rookBtn25.addEventListener('click', () => bulkBuy(allUpgrades[4], 25));
rookBtnMax.addEventListener('click', () => buyMax(allUpgrades[4]));

queenBtn.addEventListener('click', () => {
  const upg = allUpgrades[5];
  if (points >= upg.price) {
    points -= upg.price;
    upg.apply();
    upg.price = Math.floor(upg.price * 2.5);
    buyEffect();
    chessboardFX('buy');
    updateUI();
  }
});
queenBtn5.addEventListener('click', () => bulkBuy(allUpgrades[5], 5));
queenBtn25.addEventListener('click', () => bulkBuy(allUpgrades[5], 25));
queenBtnMax.addEventListener('click', () => buyMax(allUpgrades[5]));

kingBtn.addEventListener('click', () => {
  const upg = allUpgrades[6];
  if (points >= upg.price) {
    points -= upg.price;
    upg.apply();
    upg.price = Math.floor(upg.price * 2.5);
    buyEffect();
    chessboardFX('buy');
    updateUI();
  }
});
kingBtn5.addEventListener('click', () => bulkBuy(allUpgrades[6], 5));
kingBtn25.addEventListener('click', () => bulkBuy(allUpgrades[6], 25));
kingBtnMax.addEventListener('click', () => buyMax(allUpgrades[6]));

grandmasterBtn.addEventListener('click', () => {
  const upg = allUpgrades[7];
  if (points >= upg.price) {
    points -= upg.price;
    upg.apply();
    upg.price = Math.floor(upg.price * 2.5);
    buyEffect();
    chessboardFX('buy');
    updateUI();
  }
});
grandmasterBtn5.addEventListener('click', () => bulkBuy(allUpgrades[7], 5));
grandmasterBtn25.addEventListener('click', () => bulkBuy(allUpgrades[7], 25));
grandmasterBtnMax.addEventListener('click', () => buyMax(allUpgrades[7]));

aiBtn.addEventListener('click', () => {
  const upg = allUpgrades[8];
  if (points >= upg.price) {
    points -= upg.price;
    upg.apply();
    upg.price = Math.floor(upg.price * 2.5);
    buyEffect();
    chessboardFX('buy');
    updateUI();
  }
});
aiBtn5.addEventListener('click', () => bulkBuy(allUpgrades[8], 5));
aiBtn25.addEventListener('click', () => bulkBuy(allUpgrades[8], 25));
aiBtnMax.addEventListener('click', () => buyMax(allUpgrades[8]));

godBtn.addEventListener('click', () => {
  const upg = allUpgrades[9];
  if (points >= upg.price) {
    points -= upg.price;
    upg.apply();
    upg.price = Math.floor(upg.price * 2.5);
    buyEffect();
    chessboardFX('buy');
    updateUI();
  }
});
godBtn5.addEventListener('click', () => bulkBuy(allUpgrades[9], 5));
godBtn25.addEventListener('click', () => bulkBuy(allUpgrades[9], 25));
godBtnMax.addEventListener('click', () => buyMax(allUpgrades[9]));

click10xBtn.addEventListener('click', () => {
  if (!click10xUnlocked && points >= 10000) { // Example cost, adjust as needed
    points -= 10000;
    clickMultiplier = 10;
    click10xUnlocked = true;
    click10xBtn.disabled = true;
    click10xBtn.textContent = "Click 10x Active!";
    updateUI();
  }
});

// Cheat button
cheatBtn.addEventListener('click', () => {
  points += 100000000000; // Add 1,000,000 points instantly
  updateUI();
});

// Open shop screen
let shopModalInterval = null;

openShopScreen.addEventListener('click', () => {
  updateUpgradeList(modalShopList);
  const modal = new bootstrap.Modal(document.getElementById('shopModal'));
  modal.show();

  // Start interval to update buyable highlights
  if (shopModalInterval) clearInterval(shopModalInterval);
  shopModalInterval = setInterval(() => {
    updateUpgradeList(modalShopList);
  }, 500);

  // Stop interval when modal closes
  document.getElementById('shopModal').addEventListener('hidden.bs.modal', () => {
    clearInterval(shopModalInterval);
    shopModalInterval = null;
  }, { once: true });
});

// Render owned pieces and upgrades bar
function renderOwnedBar() {
  if (!ownedEl) return;
  ownedEl.innerHTML = `
    <div class="resource-bar">
      <span>♙ x${formatNum(owned.pawn)} (x${formatNum(pawnIncome)} each)</span>
      <span>♘ x${formatNum(owned.knight)}</span>
      <span>♗ x${formatNum(owned.bishop)}</span>
      <span>♖ x${formatNum(owned.rook)}</span>
      <span>♕ x${formatNum(owned.queen)}</span>
      <span>♔ x${formatNum(owned.king)}</span>
      <span>GM x${formatNum(owned.grandmaster)}</span>
      <span>AI x${formatNum(owned.ai)}</span>
      <span>God x${formatNum(owned.god)}</span>
    </div>
  `;
}

// Display stats box at the top
function renderStatsBox() {
  if (!statsBox) return;
  statsBox.innerHTML = `
    <div class="stats-box">
      <div><b>Points:</b> <span class="stat-points">${formatNum(points)}</span></div>
      <div><b>Income/sec:</b> <span class="stat-income">${formatNum(income * relicBonus)}</span></div>
      <div><b>Pawns:</b> <span class="stat-pawn">${formatNum(owned.pawn)}</span> <b>Pawn Multiplier:</b> x${formatNum(pawnIncome)}</div>
      <div><b>Move Bonus:</b> <span class="stat-movebonus">${(moveBonusPercent * 100).toFixed(1)}%</span> of income per move</div>
      <div><b>Relic Bonus:</b> <span class="stat-relic">${((relicBonus - 1) * 100).toFixed(1)}%</span></div>
      <div><b>Other Pieces:</b>
        <span>♘ ${formatNum(owned.knight)}</span>
        <span>♗ ${formatNum(owned.bishop)}</span>
        <span>♖ ${formatNum(owned.rook)}</span>
        <span>♕ ${formatNum(owned.queen)}</span>
        <span>♔ ${formatNum(owned.king)}</span>
        <span>GM ${formatNum(owned.grandmaster)}</span>
        <span>AI ${formatNum(owned.ai)}</span>
        <span>God ${formatNum(owned.god)}</span>
      </div>
      <div><b>Upgrades:</b> ${allUpgrades.filter(u => u.bought || (u.repeatable && u.price > u.type === "pawn" ? 50 : 0)).map(u => u.name).join(", ")}</div>
    </div>
  `;
}

// Visual effect for buying
function buyEffect() {
  document.body.classList.add('buy-flash');
  setTimeout(() => document.body.classList.remove('buy-flash'), 700);
}

// Visual effect for move
function moveEffect() {
  document.body.classList.add('move-flash');
  setTimeout(() => document.body.classList.remove('move-flash'), 200);
}

// Initial UI update
updateUI();
