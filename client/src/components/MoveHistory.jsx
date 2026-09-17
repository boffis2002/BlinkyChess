import Card from './ui/Card';

// `onMoveSelect`/`currentMoveIndex` are optional: passed by the Replay page to
// let clicking a move jump to that position; Game.jsx omits them and gets the
// plain read-only list it always had.
export default function MoveHistory({ moves, onMoveSelect, currentMoveIndex }) {
  const pairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({ number: i / 2 + 1, whiteIndex: i, blackIndex: i + 1, white: moves[i]?.san, black: moves[i + 1]?.san });
  }

  function moveClass(index) {
    return index === currentMoveIndex ? 'move-history-current' : undefined;
  }

  function renderMove(san, index) {
    if (!san) return null;
    if (!onMoveSelect) return san;
    return (
      <button type="button" className="move-history-move" onClick={() => onMoveSelect(index)}>
        {san}
      </button>
    );
  }

  return (
    <Card className="move-history">
      <h2 className="move-history-title">Moves</h2>
      {pairs.length === 0 ? (
        <p className="move-history-empty">No moves yet.</p>
      ) : (
        <ol className="move-history-list">
          {pairs.map((pair) => (
            <li key={pair.number}>
              <span className="move-history-number">{pair.number}.</span>
              <span className={moveClass(pair.whiteIndex)}>{renderMove(pair.white, pair.whiteIndex)}</span>
              <span className={moveClass(pair.blackIndex)}>{renderMove(pair.black, pair.blackIndex)}</span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
