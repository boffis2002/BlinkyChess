import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Header from '../components/Header';
import Leaderboard from '../components/Leaderboard';
import MatchOptionsPopup from '../components/MatchOptionsPopup';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { username } = useAuth();
  const [games, setGames] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    api.getGames().then(setGames).catch(() => setGames([]));
  }, []);

  function handlePlay({ time, ranked }) {
    sessionStorage.setItem('time', time);
    sessionStorage.setItem('ranked', ranked);
    navigate('/waiting');
  }

  return (
    <>
      <Header title="BlinkyChess" homeIcon="/images/casabianca.png" />
      <main className="main-index home-page">
        <section className="home-hero">
          <Button variant="primary" className="hero-cta" onClick={() => setPopupVisible(true)}>
            Look for a game
          </Button>
        </section>
        <div className="home-lists">
          <Card className="game-list">
            <h2 className="game-list-title">Live games</h2>
            {games.length === 0 && <p className="game-list-empty">No games in progress right now.</p>}
            {games.map((game) => (
              <div className="game-list-row" key={game._id}>
                <div className="game-list-players">
                  <span>{game.players.white}</span>
                  <span className="game-list-vs">vs</span>
                  <span>{game.players.black}</span>
                </div>
                <Button variant="secondary" onClick={() => navigate(`/game/${game._id}/w`)}>
                  Spectate
                </Button>
              </div>
            ))}
          </Card>
          <Leaderboard currentUsername={username} />
        </div>
        <MatchOptionsPopup
          visible={popupVisible}
          onClose={() => setPopupVisible(false)}
          onPlay={handlePlay}
        />
      </main>
      <footer>
        <p>Made By Sergio Boffi ©</p>
        <p>For any need, contact me at → boffis@usi.ch</p>
      </footer>
    </>
  );
}
