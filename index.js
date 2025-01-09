window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const announcer = document.querySelector('.announcer');
    const resetButton = document.getElementById('reset');
    const playTogetherButton = document.getElementById('play-together');
    const playAIButton = document.getElementById('play-ai');
    const menu = document.querySelector('.menu');
    const game = document.querySelector('.game');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;
    let isAI = false;

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    // Function to validate game result
    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') continue;
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }

        if (!board.includes('')) announce(TIE);
    }

    const announce = (type) => {
        switch (type) {
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won!';
                break;
            case PLAYERO_WON:
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won!';
                break;
            case TIE:
                announcer.innerText = 'Tie!';
        }
        announcer.classList.remove('hide');
    };

    const isValidAction = (tile) => tile.innerText === '';

    const updateBoard = (index) => {
        board[index] = currentPlayer;
    };

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    };

    const userAction = (tile, index) => {
        if (isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            if (isGameActive) {
                changePlayer();
                if (isAI && currentPlayer === 'O') {
                    setTimeout(aiMove, 500);
                }
            }
        }
    };

    const aiMove = () => {
        let bestScore = -Infinity;
        let bestMove;

        board.forEach((cell, index) => {
            if (cell === '') {
                board[index] = 'O';
                let score = minimax(board, 0, false);
                board[index] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = index;
                }
            }
        });

        if (bestMove !== undefined) {
            tiles[bestMove].innerText = 'O';
            tiles[bestMove].classList.add('playerO');
            updateBoard(bestMove);
            handleResultValidation();
            if (isGameActive) changePlayer();
        }
    };

    const minimax = (board, depth, isMaximizing) => {
        const winner = checkWinner();
        if (winner === 'O') return 10 - depth;
        if (winner === 'X') return depth - 10;
        if (!board.includes('')) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            board.forEach((cell, index) => {
                if (cell === '') {
                    board[index] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[index] = '';
                    bestScore = Math.max(score, bestScore);
                }
            });
            return bestScore;
        } else {
            let bestScore = Infinity;
            board.forEach((cell, index) => {
                if (cell === '') {
                    board[index] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[index] = '';
                    bestScore = Math.min(score, bestScore);
                }
            });
            return bestScore;
        }
    };

    const checkWinner = () => {
        for (const condition of winningConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
        }
        return null;
    };

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');
        if (currentPlayer === 'O' && isAI) changePlayer();
        tiles.forEach((tile) => {
            tile.innerText = '';
            tile.classList.remove('playerX', 'playerO');
        });
    };

    // Event Listeners
    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', resetBoard);

    playTogetherButton.addEventListener('click', () => {
        isAI = false;
        menu.classList.add('hide');
        game.classList.remove('hide');
    });

    playAIButton.addEventListener('click', () => {
        isAI = true;
        menu.classList.add('hide');
        game.classList.remove('hide');
    });
});
