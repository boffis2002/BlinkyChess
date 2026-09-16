function squareName(row, col) {
  return String.fromCharCode(97 + col) + (8 - row);
}

export default function Board({ chess, color, interactive, selectedSquare, legalDestinations, onSquareClick }) {
  const boardArray = chess.board();
  const turn = chess.turn();
  const rows = [];

  for (let displayRow = 0; displayRow < 8; displayRow++) {
    const cells = [];
    for (let displayCol = 0; displayCol < 8; displayCol++) {
      const row = color === 'white' ? displayRow : 7 - displayRow;
      const col = color === 'white' ? displayCol : 7 - displayCol;
      const piece = boardArray[row][col];
      const square = squareName(row, col);
      const cellColorClass = (row + col) % 2 === 0 ? 'whitecell' : 'browncell';
      const isLegalTarget = legalDestinations.includes(square);
      const isSelected = selectedSquare === square;
      const clickable = interactive && (isLegalTarget || (piece && piece.color === turn));

      let img = null;
      if (isLegalTarget) {
        img = (
          <img
            id={square}
            alt="selectable"
            src="/images/whites/selected.png"
            style={{ opacity: 0.5, width: '45%', height: '45%' }}
            onClick={clickable ? () => onSquareClick(square, piece) : undefined}
          />
        );
      } else if (piece) {
        img = (
          <img
            id={square}
            className="pedina"
            alt="nothing"
            src={`/images/${piece.color === 'w' ? 'whites' : 'blacks'}/${piece.type}.png`}
            style={isSelected ? { border: '2px solid #FF7F26' } : undefined}
            onClick={clickable ? () => onSquareClick(square, piece) : undefined}
          />
        );
      }

      cells.push(
        <div key={square} className={cellColorClass}>
          {img}
        </div>
      );
    }
    rows.push(<div className="row" key={displayRow}>{cells}</div>);
  }

  return <div className="chessboard">{rows}</div>;
}
