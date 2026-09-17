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
        <Link
          className={`game-list-row leaderboard-row${player.username === currentUsername ? ' leaderboard-row-me' : ''}`}
          to={`/profile/${player.username}`}
          key={player.username}
        >
          <span className="leaderboard-rank">{i + 1}</span>
          <span className="leaderboard-username">{player.username}</span>
          <span className="leaderboard-elo">{player.elo}</span>
        </Link>
      ))}
    </Card>
  );
}
