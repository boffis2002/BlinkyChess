import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Card from './ui/Card';

function RankingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M5 20V10" />
      <path d="M12 20V4" />
      <path d="M19 20v-7" />
    </svg>
  );
}

export default function Leaderboard({ currentUsername }) {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    api.getLeaderboard().then(setBoard).catch(() => setBoard([]));
  }, []);

  return (
    <Card className="game-list leaderboard">
      <h2 className="game-list-title">
        <RankingIcon />
        Leaderboard
      </h2>
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
