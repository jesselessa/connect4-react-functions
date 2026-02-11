import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

// Components
import Row from "./components/Row.jsx";
import Rules from "./components/Rules.jsx";
import Speaker from "./components/Speaker.jsx";

// Audio files
import winnerSound from "./assets/audio/winning.mp3";
import drawOrFailure from "./assets/audio/draw-or-failure.mp3";
import tokenSound from "./assets/audio/token.mp3";

const App = () => {
  // --- State variables ---
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [winningCombination, setWinningCombination] = useState([]); // Coordinates of winning tokens
  const [lastMove, setLastMove] = useState(null); // Last played token for animation purposes
  const [isSoundEnabled, setIsSoundEnabled] = useState(true); // Token sound toggle

  // --- Game global constants ---
  const player1 = 1; // Human 
  const player2 = 2; // AI 
  const isVsCPU = true; // Always AI mode

  // --- Ref for Speaker component ---
  // Targets Speaker component and allows App to access its methods like stopMusic()
  const speakerRef = useRef();

  // --- Board Initialization ---
  // Generates a 6-row by 7-column grid filled with null
  const createEmptyBoard = () => Array(6).fill(null).map(() => Array(7).fill(null));

  const initBoard = (playerStarting = null) => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(playerStarting);
    setGameOver(false);
    setMessage(playerStarting === null ? "Sélectionnez le premier joueur." : "");
    setWinningCombination([]);
    setLastMove(null);
  };

  // Initial setup (equivalent to componentDidMount)
  useEffect(() => {
    initBoard();
  }, []);

  // --- Sound Functions ---
  const playSound = (audioFile) => {
    const audio = new Audio(audioFile);
    audio.play();
  };

  const stopBackgroundMusic = () => {
    // Safely call the child method if it exists
    if (speakerRef.current?.stopMusic) {
      speakerRef.current.stopMusic();
    }
  };

  // --- Win Detection Logic ---
  // Parameters: 'b' = board, 'r' = row index, 'c' = column index

  const checkVerticalMoves = (b) => {
    for (let r = 3; r < 6; r++) { // Start from row 3 to check 3 cells above
      for (let c = 0; c < 7; c++) {
        if (b[r][c] && b[r][c] === b[r - 1][c] && b[r][c] === b[r - 2][c] && b[r][c] === b[r - 3][c])
          return { winner: b[r][c], coords: [[r, c], [r - 1, c], [r - 2, c], [r - 3, c]] };
      }
    }
  };
  //? Explanation: The checkVerticalMoves function iterates through the game board starting from row index 3 to 5 (the bottom three rows) and checks each column for four consecutive identical non-null values (representing player moves). If such a sequence is found, it returns the value (player identifier) of the winning player.

  const checkHorizontalMoves = (b) => {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 4; c++) { // Stop at col 3 to avoid out-of-bounds
        if (b[r][c] && b[r][c] === b[r][c + 1] && b[r][c] === b[r][c + 2] && b[r][c] === b[r][c + 3])
          return { winner: b[r][c], coords: [[r, c], [r, c + 1], [r, c + 2], [r, c + 3]] };
      }
    }
  };
  //? Explanation: The checkHorizontalMoves function scans each row of the game board from row index 0 to 5 and checks for four consecutive identical non-null values in each row. It iterates through columns 0 to 3 (the first four columns) to ensure it can check the next three columns for a potential horizontal win. If it finds such a sequence, it returns the value (player identifier) of the winning player.

  const checkRightDiagonalMoves = (b) => {
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] && b[r][c] === b[r - 1][c + 1] && b[r][c] === b[r - 2][c + 2] && b[r][c] === b[r - 3][c + 3])
          return { winner: b[r][c], coords: [[r, c], [r - 1, c + 1], [r - 2, c + 2], [r - 3, c + 3]] };
      }
    }
  };
  //? Explanation: The checkRightDiagonalMoves function checks for diagonal wins that slope from the bottom-left to the top-right. It iterates through the board starting from row index 3 to 5 and column index 0 to 3, checking for four consecutive identical non-null values in a right diagonal direction. If such a sequence is found, it returns the value (player identifier) of the winning player.

  const checkLeftDiagonalMoves = (b) => {
    for (let r = 3; r < 6; r++) {
      for (let c = 3; c < 7; c++) {
        if (b[r][c] && b[r][c] === b[r - 1][c - 1] && b[r][c] === b[r - 2][c - 2] && b[r][c] === b[r - 3][c - 3])
          return { winner: b[r][c], coords: [[r, c], [r - 1, c - 1], [r - 2, c - 2], [r - 3, c - 3]] };
      }
    }
  };
  //? Explanation: The checkLeftDiagonalMoves function checks for diagonal wins that slope from the bottom-right to the top-left. It iterates through the board starting from row index 3 to 5 and column index 3 to 6, checking for four consecutive identical non-null values in a left diagonal direction. If such a sequence is found, it returns the value (player identifier) of the winning player.

  const checkDraw = (b) => {
    // Check if every cell is filled
    return b.every(row => row.every(cell => cell !== null)) ? "draw" : null;
  };
  //? Explanation: The checkDraw function checks if the game board is completely filled without any empty cells (null values). It iterates through each cell of the board, and if it finds any empty cell, it returns null, indicating that the game is still ongoing. If no empty cells are found after checking the entire board, it returns "draw", indicating that the game has ended in a tie.

  const checkAllMoves = (b) => {
    return checkVerticalMoves(b) || checkHorizontalMoves(b) ||
      checkRightDiagonalMoves(b) || checkLeftDiagonalMoves(b) || checkDraw(b);
  };
  //? Explanation: The checkAllMoves function consolidates the results of all individual move-checking functions (vertical, horizontal, right diagonal, left diagonal, and draw). It sequentially calls each of these functions and returns the result of the first one that indicates a win or a draw. If none of the functions find a winning condition or a draw, it returns undefined, indicating that the game is still in progress.

  // Simulation function for AI to "think" ahead
  const checkWinningMove = (currentBoard, column, player) => {
    const boardCopy = currentBoard.map(row => [...row]); // Deep copy of the board (we don't want to mutate the original)
    for (let r = 5; r >= 0; r--) {
      if (!boardCopy[r][column]) {
        boardCopy[r][column] = player;
        break;
      }
    }
    const result = checkAllMoves(boardCopy);
    return result?.winner === player;
  };

  // Handles state updates when the game finishes
  const endGame = (finalBoard, resultMessage, soundFile) => {
    stopBackgroundMusic();
    // Choose specific sound for loss vs win
    const soundToPlay = resultMessage.includes("perdu") ? drawOrFailure : soundFile;
    playSound(soundToPlay);
    setBoard(finalBoard);
    setGameOver(true);
    setMessage(resultMessage);
  };

  // Core gameplay function memoized to prevent re-renders of child components
  const play = useCallback((c) => {
    if (currentPlayer === null) {
      setMessage("Choisissez d'abord qui commence !");
      return;
    }

    if (!gameOver) {
      const newBoard = board.map(row => [...row]); // Create a shallow copy of the board
      let moveMade = false;

      // Find the lowest available row in the selected column
      for (let r = 5; r >= 0; r--) {
        if (!newBoard[r][c]) {
          newBoard[r][c] = currentPlayer;
          if (isSoundEnabled) playSound(tokenSound);
          setLastMove({ row: r, column: c });
          moveMade = true;
          break;
        }
      }

      if (!moveMade) return; // Column is full, do nothing

      const result = checkAllMoves(newBoard);

      if (result?.winner) {
        const msg = result.winner === player1 ? "Vous avez gagné !!!" : "Vous avez perdu !!!";
        setWinningCombination(result.coords);
        endGame(newBoard, msg, winnerSound);
      } else if (result === "draw") {
        endGame(newBoard, "Egalité.", drawOrFailure);
      } else {
        // Continue game: switch player
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === player1 ? player2 : player1);
        setMessage("");
      }
    } else {
      // If game is over and user clicks, remind them to reset
      stopBackgroundMusic();
      playSound(drawOrFailure);
      setMessage("Cliquez sur 'Reset' pour commencer une nouvelle partie.");
    }
  }, [board, currentPlayer, gameOver, isSoundEnabled]);

  // --- AI Logic (CPU Turn) ---
  useEffect(() => {
    if (isVsCPU && currentPlayer === player2 && !gameOver) {
      const cpuTimer = setTimeout(() => {
        const availableColumns = [];
        // Detect all playable columns
        for (let c = 0; c < 7; c++) {
          if (board[0][c] === null) availableColumns.push(c);
        }

        if (availableColumns.length > 0) {
          // AI Strategy 1 - Check if AI can win in the next move
          for (let c of availableColumns) {
            if (checkWinningMove(board, c, player2)) { play(c); return; }
          }
          // AI Strategy 2 - Check if AI needs to block human win
          for (let c of availableColumns) {
            if (checkWinningMove(board, c, player1)) { play(c); return; }
          }
          // AI Strategy 3 - Play a random available column
          const randomCol = availableColumns[Math.floor(Math.random() * availableColumns.length)];
          play(randomCol);
        }
      }, 1000); // 1-second delay for a natural feel
      return () => clearTimeout(cpuTimer); // Cleanup timeout on unmount or player change
    }
  }, [currentPlayer, gameOver, board]);

  return (
    <div className="App">
      <Rules />
      <div className="titleAndBoard" id="titleAndBoard">
        <Speaker ref={speakerRef} />
        <div className="titleDiv"><h1>Puissance 4</h1></div>
        <div className="boardAndButton">
          {/* Render player selector only before game starts */}
          {currentPlayer === null && (
            <div className="mode-selector">
              <button onClick={() => initBoard(1)}>Je commence</button>
              <button onClick={() => initBoard(2)}>L'IA commence</button>
            </div>
          )}

          {/* Message (instructions/game status) */}
          <p className={gameOver ? "message animated-text" : "message"}>{message}</p>

          <table>
            <tbody>
              {board.map((row, i) => (
                <Row
                  key={i}
                  row={row}
                  rowIndex={i}
                  play={play}
                  winningCombination={winningCombination}
                  lastMove={lastMove}
                />
              ))}
            </tbody>
          </table>

          {/* Render reset and token sound buttons only when game has started */}
          {currentPlayer !== null && (
            <div className="btn-group">
              <button className="reset-btn" onClick={() => initBoard()}>RESET</button>
              <button className="token-sound-btn" onClick={() => setIsSoundEnabled(!isSoundEnabled)}>
                {isSoundEnabled ? "Désactiver le son des jetons" : "Activer le son des jetons"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;