import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import Header from '../components/Header';
import Card from '../components/ui/Card';

const RESULT_IMAGE = {
  w: { src: '/images/vittoria.png', alt: 'Win' },
  l: { src: '/images/sconfitta.png', alt: 'Loss' },
  d: { src: '/images/bilancia.png', alt: 'Draw' },
};

function outcomeFor(game, username) {
  const { winner } = game.result;
  if (winner === null) return 'd';
  const myColor = game.players.white === username ? 'white' : 'black';
  return winner === myColor ? 'w' : 'l';
}

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setUser(null);
    setError(false);
    setHistory([]);
    api.getUser(username).then(setUser).catch(() => setError(true));
    api.getUserHistory(username).then(setHistory).catch(() => setHistory([]));
  }, [username]);

  if (error) return null;
  if (!user) return null;

  const wins = user.wins || 0;
  const losses = user.losses || 0;
  const wr = losses === 0 ? '100' : ((wins / (wins + losses)) * 100).toFixed(2);
  const lasts = (user.lastResults || 'nnnnnnnnnn').split('').slice(0, 10);

  return (
    <>
      <Header title="BlinkyChess" homeIcon="/images/casa.png" accountIcon="/images/accountbianco.png" />
      <main className="main-index">
        <Card className="profile-view">
          <h2 id="username-title">{user.username}</h2>
          <p><strong>Win Rate:</strong> <span id="win-rate">{wr}%</span></p>
          <p><strong>ELO:</strong> <span id="elo">{user.elo}</span></p>
          <p><strong>Won Games:</strong> <span id="won-games">{user.wins}</span></p>
          <h3>Score of Last 10 Games</h3>
          <div id="last-10-games">
            {Array.from({ length: 10 }, (_, i) => lasts[i]).map((result, i) => {
              const image = RESULT_IMAGE[result] ?? { src: '/images/notplayed.png', alt: 'Notp' };
              return (
                <div className="game-result" key={i}>
                  <img src={image.src} alt={image.alt} />
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="game-list match-history">
          <h2 className="game-list-title">Match history</h2>
          {history.length === 0 && <p className="game-list-empty">No finished games yet.</p>}
          {history.map((game) => {
            const opponent = game.players.white === username ? game.players.black : game.players.white;
            const image = RESULT_IMAGE[outcomeFor(game, username)];
            return (
              <Link className="game-list-row match-history-row" to={`/replay/${game._id}`} key={game._id}>
                <img className="match-history-result" src={image.src} alt={image.alt} />
                <span className="match-history-opponent">vs {opponent}</span>
                <span className="match-history-date">{new Date(game.updatedAt).toLocaleDateString()}</span>
              </Link>
            );
          })}
        </Card>
      </main>
      <footer>
        <p>Made By Sergio Boffi ©</p>
        <p>For any need, contact me at → boffis@usi.ch</p>
      </footer>
    </>
  );
}
