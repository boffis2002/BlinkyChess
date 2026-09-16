function secsToMins(secs) {
  const s = Math.max(0, Math.floor(secs));
  return Math.floor(s / 60).toString() + ':' + String(s % 60).padStart(2, '0');
}

export default function PlayerInfo({ user, time, timeClassName }) {
  const won = parseInt(user.won, 10) || 0;
  const lost = parseInt(user.lost, 10) || 0;
  const wr = lost === 0 ? '100' : ((won / (won + lost)) * 100).toFixed(2);

  return (
    <div className="player-info">
      <div className="username">{user.username}</div>
      <div>ELO: {user.elo}</div>
      <div>WR: {wr}%</div>
      <div className={timeClassName}>Time left: {secsToMins(time)}</div>
    </div>
  );
}
