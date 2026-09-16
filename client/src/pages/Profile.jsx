import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import Header from '../components/Header';

const RESULT_IMAGE = {
  w: { src: '/images/vittoria.png', alt: 'Win' },
  l: { src: '/images/sconfitta.png', alt: 'Loss' },
  d: { src: '/images/bilancia.png', alt: 'Draw' },
};

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setUser(null);
    setError(false);
    api.getUser(username).then(setUser).catch(() => setError(true));
  }, [username]);

  if (error) return null;
  if (!user) return null;

  const won = parseInt(user.won, 10) || 0;
  const lost = parseInt(user.lost, 10) || 0;
  const wr = lost === 0 ? '100' : ((won / (won + lost)) * 100).toFixed(2);
  const lasts = (user.lasts || 'nnnnnnnnnn').split('').slice(0, 10);

  return (
    <>
      <Header title="BlinkyChess" homeIcon="/images/casa.png" accountIcon="/images/accountbianco.png" />
      <main className="main-index">
        <div id="profile-view">
          <h2 id="username-title">{user.username}</h2>
          <p><strong>Win Rate:</strong> <span id="win-rate">{wr}%</span></p>
          <p><strong>ELO:</strong> <span id="elo">{user.elo}</span></p>
          <p><strong>Won Games:</strong> <span id="won-games">{user.won}</span></p>
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
        </div>
      </main>
      <footer>
        <p>Made By Sergio Boffi ©</p>
        <p>For any need, contact me at → boffis@usi.ch</p>
      </footer>
    </>
  );
}
