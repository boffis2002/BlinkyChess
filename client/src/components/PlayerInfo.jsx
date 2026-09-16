function secsToMins(secs) {
  const s = Math.max(0, Math.floor(secs));
  return Math.floor(s / 60).toString() + ':' + String(s % 60).padStart(2, '0');
}

export default function PlayerInfo({ user, time, timeClassName }) {
  const wins = user.wins || 0;
  const losses = user.losses || 0;
  const wr = losses === 0 ? '100' : ((wins / (wins + losses)) * 100).toFixed(2);

  return (
    <div className="player-info">
      <div className="username">{user.username}</div>
      <div>ELO: {user.elo}</div>
      <div>WR: {wr}%</div>
      <div className={timeClassName}>Time left: {secsToMins(time)}</div>
    </div>
  );
}
