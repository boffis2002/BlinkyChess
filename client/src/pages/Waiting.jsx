import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Header from '../components/Header';

const START_BOARD = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export default function Waiting() {
  const navigate = useNavigate();
  const navigated = useRef(false);

  useEffect(() => {
    let interval;
    const username = sessionStorage.getItem('username');
    const time = sessionStorage.getItem('time');
    const ranked = sessionStorage.getItem('ranked');
    sessionStorage.removeItem('id');

    function goToGame(id, color) {
      if (navigated.current) return;
      navigated.current = true;
      sessionStorage.setItem('id', id);
      navigate(`/game/${id}/${color}`);
    }

    api.getGames().then((games) => {
      let found = false;
      for (const game of games) {
        if (game.white === username) {
          sessionStorage.setItem('id', game._id);
          interval = window.setInterval(() => {
            api.getGame(game._id).then((updated) => {
              if (updated.black !== '') goToGame(updated._id, 'w');
            });
          }, 1000);
          found = true;
          break;
        }
        if ((game.black === '' && game.btime === time && game.ranked === ranked) || game.black === username) {
          api.insertBlack(game._id, { black: username }).then(() => {
            goToGame(game._id, 'b');
          });
          found = true;
          break;
        }
      }
      if (!found) {
        const newGame = {
          white: username,
          black: '',
          board: START_BOARD,
          ranked,
          wtime: time,
          btime: time,
        };
        api.addGame(newGame).then((game) => {
          sessionStorage.setItem('id', game._id);
          interval = window.setInterval(() => {
            api.getGame(game._id).then((updated) => {
              if (updated.black !== '') goToGame(updated._id, 'w');
            });
          }, 1000);
        });
      }
    });

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [navigate]);

  return (
    <>
      <Header homeIcon="/images/logo.png" />
      <main className="main-index">
        <div className="loader"></div>
      </main>
      <footer>
        <p>Made By Sergio Boffi ©</p>
        <p>For any need, contact me at → boffis@usi.ch</p>
      </footer>
    </>
  );
}
