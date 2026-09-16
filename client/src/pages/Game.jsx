import { Chess } from 'chess.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../api';
import Board from '../components/Board';
import PlayerInfo from '../components/PlayerInfo';
import PromotionPopup from '../components/PromotionPopup';
import { useAuth } from '../context/AuthContext';

function shiftLasts(lasts, resultChar) {
  const chars = (lasts || 'nnnnnnnnnn').split('');
  for (let i = 1; i < 10; i++) chars[i - 1] = chars[i];
  chars[9] = resultChar;
  return chars.join('');
}

function popupColor(variant) {
  if (variant === 'win') return 'rgba(0,255,0,0.8)';
  if (variant === 'lose') return 'rgba(255,21,0,0.8)';
  return 'rgba(100,100,100,0.8)';
}

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
  const [endPopup, setEndPopup] = useState(null);

  const socketRef = useRef(null);
  const gameOverRef = useRef(false);
  const timeoutSentRef = useRef(false);

  const chess = useMemo(() => new Chess(game ? game.board : undefined), [game]);
  const turnColor = chess.turn();

  const loadGame = useCallback(async () => {
    const g = await api.getGame(id);
    const [wUser, bUser] = await Promise.all([
      api.getUser(g.white),
      g.black ? api.getUser(g.black) : Promise.resolve(null),
    ]);
    setWhiteUser(wUser);
    setBlackUser(bUser);
    setLiveWtime(Number(g.wtime));
    setLiveBtime(Number(g.btime));
    timeoutSentRef.current = false;
    setGame(g);
  }, [id]);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  useEffect(() => {
    setSelectedSquare(null);
    setPendingMove(null);
  }, [game]);

  useEffect(() => {
    const socket = io();
    socketRef.current = socket;
    socket.emit('join room', { room: id, user: username });
    socket.on('update board', () => {
      loadGame();
    });
    return () => socket.disconnect();
  }, [id, username, loadGame]);

  const activeUsername = game ? (turnColor === 'w' ? game.white : game.black) : null;
  const opponentActiveUsername = game ? (turnColor === 'w' ? game.black : game.white) : null;
  const myTurn = Boolean(game && username === activeUsername);
  const isParticipant = Boolean(game && (username === game.white || username === game.black));

  // Detect checkmate / draw / timeout and report the outcome.
  useEffect(() => {
    if (!game || gameOverRef.current) return;

    async function finish(result, cause) {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      if (!isParticipant) return;

      const isRanked = game.ranked === true || game.ranked === 'true';
      const user = await api.getUser(username);

      if (result === 'win') {
        setEndPopup({ variant: 'win', message: 'You won the match!' });
        await api.patchAfterGame(username, true, isRanked ? 15 : 0, shiftLasts(user.lasts, 'w'));
      } else if (result === 'lose') {
        setEndPopup({ variant: 'lose', message: 'You lost the match!' });
        await api.patchAfterGame(username, false, isRanked ? 15 : 0, shiftLasts(user.lasts, 'l'));
        window.setTimeout(() => api.deleteGame(id).catch(() => {}), 1000);
      } else {
        setEndPopup({ variant: 'draw', message: `It's a draw! a ${cause} happened` });
        await api.patchAfterGame(username, false, 0, shiftLasts(user.lasts, 'd'));
        api.deleteGame(id).catch(() => {});
      }
    }

    if (chess.isStalemate()) { finish('draw', 'stalemate'); return; }
    if (chess.isInsufficientMaterial()) { finish('draw', 'insufficient material'); return; }
    if (chess.isThreefoldRepetition()) { finish('draw', 'threefold repetition'); return; }

    const activeTime = chess.isCheckmate() ? 0 : (turnColor === 'w' ? game.wtime : game.btime);
    if (activeTime <= 0) {
      if (username === activeUsername) finish('lose');
      else if (username === opponentActiveUsername) finish('win');
    }
  }, [game, chess, turnColor, activeUsername, opponentActiveUsername, isParticipant, username, id]);

  // Tick the clock for whichever color is currently to move.
  useEffect(() => {
    if (!game || gameOverRef.current) return;
    const interval = window.setInterval(() => {
      if (turnColor === 'w') setLiveWtime((t) => Math.max(0, (t ?? 0) - 1));
      else setLiveBtime((t) => Math.max(0, (t ?? 0) - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [game, turnColor]);

  // If it's my turn and my live clock hits zero, persist the timeout.
  useEffect(() => {
    if (!game || gameOverRef.current || timeoutSentRef.current) return;
    const liveActiveTime = turnColor === 'w' ? liveWtime : liveBtime;
    if (myTurn && liveActiveTime === 0) {
      timeoutSentRef.current = true;
      const wtime = turnColor === 'w' ? 0 : game.wtime;
      const btime = turnColor === 'b' ? 0 : game.btime;
      api.patchBoard(id, game.board, wtime, btime).then(() => {
        socketRef.current?.emit('move', { room: id, fen: game.board });
      });
    }
  }, [liveWtime, liveBtime, turnColor, myTurn, game, id]);

  const verboseMoves = useMemo(() => {
    if (!selectedSquare || !myTurn) return [];
    return chess.moves({ square: selectedSquare, verbose: true });
  }, [chess, selectedSquare, myTurn]);

  const legalDestinations = useMemo(() => [...new Set(verboseMoves.map((m) => m.to))], [verboseMoves]);

  function commitMove({ from, to, promotion }) {
    const move = chess.move({ from, to, promotion });
    if (!move) return;
    setSelectedSquare(null);
    setPendingMove(null);

    const activeTime = (turnColor === 'w' ? liveWtime : liveBtime) ?? 0;
    const increment = activeTime + 15;
    const wtime = turnColor === 'w' ? increment : game.wtime;
    const btime = turnColor === 'b' ? increment : game.btime;
    const fen = chess.fen();

    api.patchBoard(id, fen, wtime, btime).then(() => {
      socketRef.current?.emit('move', { room: id, fen });
    });
  }

  function handleSquareClick(square, piece) {
    if (!myTurn || gameOverRef.current) return;
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
      <main className="main-index">
        {endPopup && (
          <div className="popup" style={{ display: 'block', position: 'fixed', backgroundColor: popupColor(endPopup.variant) }}>
            <div id="popup-message">{endPopup.message}</div>
            <button className="home-button" onClick={() => navigate('/')}>Home</button>
          </div>
        )}
        <PromotionPopup visible={Boolean(pendingMove)} onSelect={handlePromotionSelect} />
        <div>
          {opponentUser && <PlayerInfo user={opponentUser} time={opponentLiveTime ?? 0} timeClassName="timeHis" />}
          <Board
            chess={chess}
            color={color}
            interactive={myTurn && !endPopup}
            selectedSquare={selectedSquare}
            legalDestinations={legalDestinations}
            onSquareClick={handleSquareClick}
          />
        </div>
        {myUser && <PlayerInfo user={myUser} time={myLiveTime ?? 0} timeClassName="timeMine" />}
      </main>
      <footer>
        <p>Made By Sergio Boffi ©</p>
        <p>For any need, contact me at → boffis@usi.ch</p>
      </footer>
    </>
  );
}
