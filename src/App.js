import { useState } from 'react';

function Square({ value, onSquareClick, className }) {
  return (
    <button className={className || "square"} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares, i); 
  }

  const result = calculateWinner(squares);
  const winner = result ? result.winner : null;
  const winningLine = result ? result.line : [];

  function renderSquare(i) {
    // Câu 4: Highlight khi ô vuông thuộc tập ô giành chiến thắng.
    const squareClass = winningLine.includes(i) ? 'square square-winner' : 'square';
    return (
      <Square
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        className={squareClass}
      />
    );
  }

  // Câu 2,tạo bàn cờ với 2 vòng lặp
  function createBoard({nRow, nCol}) {
    const board = [];
    for (let row = 0; row < 3; row++) {
      const cols = [];
      cols.push(<div key={`row-num-${row}`} className="row-number">{row + 1}</div>); 
      for (let col = 0; col < nCol; col++) {
        cols.push(renderSquare(row * nRow + col));
      }
      board.push(<div key={row} className="board-row">{cols}</div>);
    }
    return board;
  }

  
  // Câu 4: Tính cả trường hợp hòa.
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (!squares.includes(null)) {
    status = 'Draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

 
  const board = createBoard({nRow: 3, nCol: 3});


  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <div className="corner"></div> 
        <div className="col-number">1</div>
        <div className="col-number">2</div>
        <div className="col-number">3</div>
      </div>
      {board}
    </>
  );
}



 
export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), lastMove: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, lastMove) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, lastMove }
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((step, move) => {
    const lastMove = step.lastMove;
    const row = lastMove !== null ? Math.floor(lastMove / 3) + 1 : null;
    const col = lastMove !== null ? (lastMove % 3) + 1 : null;
    const player = move % 2 === 0 ? 'O' : 'X'; 
  
    // Câu 5: Có hiển thị vị trí dòng, cột trong lịch sử nước đi.
    const description = move
      ? `Go to move #${move} - ${player} at (${row}, ${col})`
      : 'Go to game start';
  

    // Câu 1: Hiển thị thông tin bước hiện tại thay vì button.
    if (move === currentMove) {
      return (
        <li key={move}>
          {(move !== 0) ? (<span>You are at move #{move} ({player})</span>) : (<span>You are at move #{move}</span>)}
          
        </li>
      );
    }
  
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  
  // Câu 3: Tiến hành sắp xếp theo lựa chọn của người dùng
  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}>
          {isAscending ? 'Sắp xếp các nước đi giảm dần' : 'Sắp xếp các nước đi tăng dần'}
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
      [0, 1, 2],
      [3, 4, 5], 
      [6, 7, 8],
      [0, 3, 6], 
      [1, 4, 7], 
      [2, 5, 8],
      [0, 4, 8], 
      [2, 4, 6]
    ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] }; 
    }
  }
  return null;
}
