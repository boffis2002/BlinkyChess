import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Header from '../components/Header';
import MatchOptionsPopup from '../components/MatchOptionsPopup';

export default function Home() {
  const navigate = useNavigate();
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
      <main className="main-index">
        <button className="button-container" onClick={() => setPopupVisible(true)}><b>Look for a game</b></button>
        <div className="table-container">
          <table>
            <tbody>
              <tr>
                <th>Spectate</th>
                <th>Black</th>
                <th>White</th>
              </tr>
              {games.map((game) => (
                <tr key={game._id}>
                  <td><button id="spectate" onClick={() => navigate(`/game/${game._id}/w`)}>Spectate</button></td>
                  <td>{game.black}</td>
                  <td>{game.white}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
