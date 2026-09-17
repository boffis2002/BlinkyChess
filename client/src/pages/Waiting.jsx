import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Button from '../components/ui/Button';

const POLL_INTERVAL_MS = 1500;

export default function Waiting() {
  const navigate = useNavigate();
  const { username } = useAuth();

  useEffect(() => {
    // `ignore` guards against React StrictMode's dev-only double-invoke of
    // effects (mount -> cleanup -> mount): if this run gets torn down before
    // joinQueue resolves, we still have to undo the join instead of leaving
    // an orphaned queue entry that nothing is polling.
    let ignore = false;
    let interval;
    let myQueueEntryId = null;

    async function goToGame(gameId) {
      if (ignore) return;
      const game = await api.getGame(gameId);
      if (ignore) return;
      const color = game.players.white === username ? 'w' : 'b';
      navigate(`/game/${gameId}/${color}`);
    }

    async function start() {
      const timeControl = { initial: Number(sessionStorage.getItem('time')), increment: 15 };
      const ranked = sessionStorage.getItem('ranked') === 'true';

      const result = await api.joinQueue({ timeControl, ranked });
      if (ignore) {
        if (!result.matched) api.leaveQueue(result.queueEntryId).catch(() => {});
        return;
      }

      if (result.matched) {
        await goToGame(result.gameId);
        return;
      }

      myQueueEntryId = result.queueEntryId;
      interval = window.setInterval(async () => {
        if (ignore) return;
        const status = await api.queueStatus(myQueueEntryId);
        if (ignore) return;
        if (status.matched) {
          window.clearInterval(interval);
          await goToGame(status.gameId);
        }
      }, POLL_INTERVAL_MS);
    }

    start();

    return () => {
      ignore = true;
      if (interval) window.clearInterval(interval);
      if (myQueueEntryId) api.leaveQueue(myQueueEntryId).catch(() => {});
    };
  }, [navigate, username]);

  return (
    <>
      <Header homeIcon="/images/logo.png" />
      <main className="main-index">
        <div className="waiting-content">
          <div className="loader"></div>
          <p className="waiting-message">Looking for an opponent…</p>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Cancel
          </Button>
        </div>
      </main>
      <footer>
        <p>Made By Sergio Boffi ©</p>
        <p>For any need, contact me at → boffis@usi.ch</p>
      </footer>
    </>
  );
}
