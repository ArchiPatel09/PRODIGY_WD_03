// Game state variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let aiDifficulty = 'medium'; // Default difficulty
let gameMode = 'ai'; // 'ai' or 'human'
let player1Symbol = 'X';
let player2Symbol = 'O';

// DOM elements
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart');
const easyButton = document.getElementById('easy');
const mediumButton = document.getElementById('medium');
const hardButton = document.getElementById('hard');
const vsAIButton = document.getElementById('vsAI');
const vsHumanButton = document.getElementById('vsHuman');
const difficultySettings = document.getElementById('difficultySettings');

// Defining winning conditions (indices of winning combinations)
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
];

// Initializing the game
function initializeGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    
    // Clearing the board
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winning-cell');
    });
    
    updateStatus();
}

// Updating game status display
function updateStatus() {
    if (gameActive) {
        if (gameMode === 'ai') {
            statusDisplay.textContent = currentPlayer === player1Symbol ? 'Your turn (X)' : 'AI is thinking...';
        } else {
            statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        }
    }
}

// Handling cell click
function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // If cell is already filled or game is not active, ignore the click
    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // In AI mode, only allow human player to click when it's their turn
    if (gameMode === 'ai' && currentPlayer !== player1Symbol) {
        return;
    }

    // Making the move
    makeMove(clickedCell, clickedCellIndex, currentPlayer);
    
    // Checking for win or draw
    checkResult();
    
    // If game is still active and in AI mode, let AI make a move
    if (gameActive && gameMode === 'ai' && currentPlayer === player2Symbol) {
        setTimeout(() => {
            aiMove();
            checkResult();
        }, 500);
    }
}

// Make a move on the board
function makeMove(cell, index, symbol) {
    board[index] = symbol;
    cell.textContent = symbol;
    cell.classList.add(symbol.toLowerCase());
    
    // Switching the player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
}

// Checking game result (win/draw)
function checkResult() {
    let roundWon = false;
    
    // Checking all winning conditions
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            // Highlighting winning cells
            cells[a].classList.add('winning-cell');
            cells[b].classList.add('winning-cell');
            cells[c].classList.add('winning-cell');
            break;
        }
    }
    
    // If someone won
    if (roundWon) {
            gameActive = false;
            const winner = currentPlayer === 'O' ? 'X' : 'O'; // We switched player already, so need to reverse
            if (gameMode === 'ai') {
                statusDisplay.textContent = winner === player1Symbol ? '🎉 You won! 🎉' : '🤖 AI won! 🤖';
            } else {
                statusDisplay.textContent = `🎊 Player ${winner} wins! 🎊`;
            }
            return;
        }
        
        // If it's a draw
        if (!board.includes('')) {
            gameActive = false;
            statusDisplay.textContent = '😅 Game ended in a draw! 😅';
            return;
        }
    }

// AI move logic
function aiMove() {
    let move;
    
    switch (aiDifficulty) {
        case 'easy':
            move = getRandomMove();
            break;
        case 'medium':
            // 50% chance to make a smart move, 50% random
            move = Math.random() < 0.5 ? getSmartMove() : getRandomMove();
            break;
        case 'hard':
            move = getSmartMove() || getBestMove();
            break;
        default:
            move = getRandomMove();
    }
    
    if (move !== null) {
        const cell = cells[move];
        makeMove(cell, move, player2Symbol);
    }
}

// Getting a random available move
function getRandomMove() {
    const availableMoves = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    return availableMoves.length > 0 ? availableMoves[Math.floor(Math.random() * availableMoves.length)] : null;
}

// Getting a smart move (looks for immediate wins or blocks)
function getSmartMove() {
    // Checking for winning move
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        // Checking if AI can win
        if (board[a] === player2Symbol && board[b] === player2Symbol && board[c] === '') return c;
        if (board[a] === player2Symbol && board[c] === player2Symbol && board[b] === '') return b;
        if (board[b] === player2Symbol && board[c] === player2Symbol && board[a] === '') return a;
    }
    
    // Checking for blocking move
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        // Checking if player is about to win
        if (board[a] === player1Symbol && board[b] === player1Symbol && board[c] === '') return c;
        if (board[a] === player1Symbol && board[c] === player1Symbol && board[b] === '') return b;
        if (board[b] === player1Symbol && board[c] === player1Symbol && board[a] === '') return a;
    }
    
    return null;
}

// Minimax algorithm for hard difficulty (best move)
function getBestMove() {
    // Simple implementation - prioritize center, then corners, then edges
    if (board[4] === '') return 4; // Center
    
    const corners = [0, 2, 6, 8];
    for (let i = 0; i < corners.length; i++) {
        if (board[corners[i]] === '') return corners[i];
    }
    
    const edges = [1, 3, 5, 7];
    for (let i = 0; i < edges.length; i++) {
        if (board[edges[i]] === '') return edges[i];
    }
    
    return getRandomMove();
}

// Setting game mode
function setGameMode(mode) {
    gameMode = mode;
    vsAIButton.classList.remove('active');
    vsHumanButton.classList.remove('active');
    
    if (mode === 'ai') {
        vsAIButton.classList.add('active');
        difficultySettings.classList.remove('hidden');
    } else {
        vsHumanButton.classList.add('active');
        difficultySettings.classList.add('hidden');
    }
    
    initializeGame();
}

// Setting difficulty level
function setDifficulty(difficulty) {
    aiDifficulty = difficulty;
    easyButton.classList.remove('active');
    mediumButton.classList.remove('active');
    hardButton.classList.remove('active');
    
    if (difficulty === 'easy') {
        easyButton.classList.add('active');
    } else if (difficulty === 'medium') {
        mediumButton.classList.add('active');
    } else {
        hardButton.classList.add('active');
    }
    
    initializeGame();
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', initializeGame);
easyButton.addEventListener('click', () => setDifficulty('easy'));
mediumButton.addEventListener('click', () => setDifficulty('medium'));
hardButton.addEventListener('click', () => setDifficulty('hard'));
vsAIButton.addEventListener('click', () => setGameMode('ai'));
vsHumanButton.addEventListener('click', () => setGameMode('human'));

// Staring the game
initializeGame();