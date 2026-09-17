import { Chess } from 'chess.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import Board from '../components/Board';
import PlayerInfo from '../components/PlayerInfo';
import PromotionPopup from '../components/PromotionPopup';
import MoveHistory from '../components/MoveHistory';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const POLL_INTERVAL_MS = 1500;

const REASON_TEXT = {
  checkmate: 'checkmate',
  stalemate: 'stalemate',
  insufficient_material: 'insufficient material',
  threefold_repetition: 'threefold repetition',
  fifty_move: 'the fifty-move rule',
  timeout: 'timeout',
};

export default function Game() {
  const { id, color: colorParam } = useParams();
  const color = colorParam === 'w' ? 'white' : 'black';
  const navigate = useNavigate();
  const { username } = useAuth();

  const [game, setGame] = useState(null);
  const [whiteUser, setWhiteUser] = useState(null);
  const [blackUser, setBlackUser] = useState(null);
  const [liveWtime, setLiveWtime] = useState(null);
  const [liveBtime, setLiveBtime] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [pendingMove, setPendingMove] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const chess = useMemo(() => new Chess(game ? game.fen : undefined), [game?.fen]);

  const loadGame = useCallback(async () => {
    try {
      const g = await api.getGame(id);
      const [w, b] = await Promise.all([api.getUser(g.players.white), api.getUser(g.players.black)]);
      setGame(g);
      setWhiteUser(w);
      setBlackUser(b);
      setLiveWtime(g.liveClock.white);
      setLiveBtime(g.liveClock.black);
    } catch {
      setNotFound(true);
    }
  }, [id]);

  // Poll instead of a socket connection — pause while the tab isn't visible.
  useEffect(() => {
    let cancelled = false;
    function tick() {
      if (document.hidden || cancelled) return;
      loadGame();
    }
    tick();
    const interval = window.setInterval(tick, POLL_INTERVAL_MS);
    document.addEventListener('visibilitychange', tick);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [loadGame]);

  useEffect(() => {
    setSelectedSquare(null);
    setPendingMove(null);
  }, [game?.fen]);

  // Smooth per-second countdown between polls; each poll resyncs it from the server.
  useEffect(() => {
    if (!game || game.status !== 'active') return;
    const interval = window.setInterval(() => {
      if (game.turn === 'w') setLiveWtime((t) => Math.max(0, (t ?? 0) - 1));
      else setLiveBtime((t) => Math.max(0, (t ?? 0) - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [game]);

  const isParticipant = Boolean(game && username && (username === game.players.white || username === game.players.black));
  const myTurn = Boolean(
    game &&
      game.status === 'active' &&
      username === (game.turn === 'w' ? game.players.white : game.players.black)
  );

  const verboseMoves = useMemo(() => {
    if (!selectedSquare || !myTurn) return [];
    return chess.moves({ square: selectedSquare, verbose: true });
  }, [chess, selectedSquare, myTurn]);

  const legalDestinations = useMemo(() => [...new Set(verboseMoves.map((m) => m.to))], [verboseMoves]);

  async function commitMove({ from, to, promotion }) {
    setSelectedSquare(null);
    setPendingMove(null);
    try {
      await api.submitMove(id, { from, to, promotion });
    } finally {
      // Resync either way: on success this picks up the new position; on a
      // rejected move (e.g. the opponent's move arrived first) it corrects
      // whatever the client had guessed.
      loadGame();
    }
  }

  function handleSquareClick(square, piece) {
    if (!myTurn) return;
    if (legalDestinations.includes(square)) {
      const movesToSquare = verboseMoves.filter((m) => m.to === square);
      if (movesToSquare.some((m) => m.promotion)) {
        setPendingMove({ from: selectedSquare, to: square });
      } else {
        commitMove({ from: selectedSquare, to: square });
      }
      return;
    }
    if (piece && piece.color === chess.turn()) {
      setSelectedSquare(square);
    }
  }

  function handlePromotionSelect(promotion) {
    if (!pendingMove) return;
    commitMove({ ...pendingMove, promotion });
  }

  if (notFound) {
    return (
      <>
        <header id="header-index">
          <div id="header-right">
            <a className="logo" href="#"><img src="/images/logo.png" alt="" /></a>
          </div>
        </header>
        <main className="main-index"><p>Game not found.</p></main>
      </>
    );
  }

  if (!game || !whiteUser) {
    return (
      <>
        <header id="header-index">
          <div id="header-right">
            <a className="logo" href="#"><img src="/images/logo.png" alt="" /></a>
          </div>
        </header>
        <main className="main-index"><div className="loader"></div></main>
      </>
    );
  }

  let endPopup = null;
  if (game.status === 'finished') {
    const { winner, reason } = game.result;
    const reasonText = REASON_TEXT[reason] || reason;
    if (winner === null) {
      endPopup = { variant: 'draw', message: `It's a draw — ${reasonText}.` };
    } else if (isParticipant) {
      const iWon = winner === (username === game.players.white ? 'white' : 'black');
      endPopup = iWon ? { variant: 'win', message: 'You won the match!' } : { variant: 'lose', message: 'You lost the match.' };
    } else {
      const winnerName = winner === 'white' ? game.players.white : game.players.black;
      endPopup = { variant: winner === 'white' ? 'win' : 'lose', message: `${winnerName} won the match.` };
    }
  }

  const myUser = color === 'white' ? whiteUser : blackUser;
  const opponentUser = color === 'white' ? blackUser : whiteUser;
  const myLiveTime = color === 'white' ? liveWtime : liveBtime;
  const opponentLiveTime = color === 'white' ? liveBtime : liveWtime;

  return (
    <>
      <header id="header-index">
        <div id="header-right">
          <a className="logo" href="#"><img src="/images/logo.png" alt="" /></a>
        </div>
      </header>
      <main className="main-index game-main">
        <Modal open={Boolean(endPopup)} onClose={() => navigate('/')} title="Game over">
          {endPopup && (
            <>
              <p className={`result-message result-${endPopup.variant}`}>{endPopup.message}</p>
              <Button variant="primary" onClick={() => navigate('/')}>Home</Button>
            </>
          )}
        </Modal>
        <PromotionPopup visible={Boolean(pendingMove)} onSelect={handlePromotionSelect} />
        <div className="game-board-column">
          {opponentUser && <PlayerInfo user={opponentUser} time={opponentLiveTime ?? 0} timeClassName="timeHis" />}
          <Board
            chess={chess}
            color={color}
            interactive={myTurn && !endPopup}
            selectedSquare={selectedSquare}
            legalDestinations={legalDestinations}
            onSquareClick={handleSquareClick}
          />
          {myUser && <PlayerInfo user={myUser} time={myLiveTime ?? 0} timeClassName="timeMine" />}
        </div>
        <MoveHistory moves={game.moveHistory} />
      </main>
      <footer>
        <p>Made By Sergio Boffi ©</p>
        <p>For any need, contact me at → boffis@usi.ch</p>
      </footer>
    </>
  );
}
