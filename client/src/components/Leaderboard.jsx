import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Card from './ui/Card';

export default function Leaderboard({ currentUsername }) {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    api.getLeaderboard().then(setBoard).catch(() => setBoard([]));
  }, []);

  return (
    <Card className="game-list leaderboard">
      <h2 className="game-list-title">Leaderboard</h2>
      {board.length === 0 && <p className="game-list-empty">No ranked players yet.</p>}
      {board.map((player, i) => (
        <div
          className={`game-list-row leaderboard-row${player.username === currentUsername ? ' leaderboard-row-me' : ''}`}
          key={player.username}
        >
          <span className="leaderboard-rank">{i + 1}</span>
          <Link className="leaderboard-username" to={`/profile/${player.username}`}>
            {player.username}
          </Link>
          <span className="leaderboard-elo">{player.elo}</span>
        </div>
      ))}
    </Card>
  );
}
