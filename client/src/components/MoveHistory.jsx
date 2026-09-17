import Card from './ui/Card';

export default function MoveHistory({ moves }) {
  const pairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({ number: i / 2 + 1, white: moves[i]?.san, black: moves[i + 1]?.san });
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
              <span>{pair.white}</span>
              <span>{pair.black || ''}</span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
