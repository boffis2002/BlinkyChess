import { Chess } from 'chess.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Board from '../components/Board';
import Footer from '../components/Footer';
import Header from '../components/Header';
import MoveHistory from '../components/MoveHistory';
import OfflineSetupPopup, { DIFFICULTY_OPTIONS } from '../components/OfflineSetupPopup';
import PromotionPopup from '../components/PromotionPopup';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { getBestMove } from '../engine/stockfish';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const REASON_TEXT = {
  checkmate: 'checkmate',
  stalemate: 'stalemate',
  insufficient_material: 'insufficient material',
  threefold_repetition: 'threefold repetition',
  fifty_move: 'the fifty-move rule',
  resignation: 'resignation',
};

// Mirrors src/engine/chessEngine.js's describeGameOver — duplicated rather
// than shared because that module is written for the Node/CommonJS backend
// and isn't meant to ship to the browser bundle.
function describeGameOver(chess) {
  if (chess.isCheckmate()) {
    const winner = chess.turn() === 'w' ? 'black' : 'white';
    return { over: true, reason: 'checkmate', winner };
  }
  if (chess.isStalemate()) return { over: true, reason: 'stalemate', winner: null };
  if (chess.isInsufficientMaterial()) return { over: true, reason: 'insufficient_material', winner: null };
  if (chess.isThreefoldRepetition()) return { over: true, reason: 'threefold_repetition', winner: null };
  if (chess.isDraw()) return { over: true, reason: 'fifty_move', winner: null };
  return { over: false, reason: null, winner: null };
}

export default function OfflineGame() {
  const navigate = useNavigate();
  const { username } = useAuth();

  const chessRef = useRef(new Chess());
  const [fen, setFen] = useState(START_FEN);
  const [moveHistory, setMoveHistory] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [pendingMove, setPendingMove] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [resigned, setResigned] = useState(false);

  const [status, setStatus] = useState('setup'); // 'setup' | 'playing'
  const [playerColor, setPlayerColor] = useState('white');
  const [difficulty, setDifficulty] = useState(DIFFICULTY_OPTIONS[1]);

  const chess = useMemo(() => new Chess(fen), [fen]);
  const gameOverInfo = useMemo(() => describeGameOver(chess), [chess]);

  const isOver = resigned || gameOverInfo.over;
  const reason = resigned ? 'resignation' : gameOverInfo.reason;
  const winner = resigned ? (playerColor === 'white' ? 'black' : 'white') : gameOverInfo.winner;

  const myTurn = status === 'playing' && !isOver && chess.turn() === (playerColor === 'white' ? 'w' : 'b');

  // The engine's move, whenever it's actually its turn.
  useEffect(() => {
    if (status !== 'playing' || resigned) return;
    const current = new Chess(fen);
    if (current.isGameOver()) return;
    const engineTurn = playerColor === 'white' ? 'b' : 'w';
    if (current.turn() !== engineTurn) return;

    let cancelled = false;
    setThinking(true);
    getBestMove(fen, { skillLevel: difficulty.skillLevel, movetimeMs: difficulty.movetimeMs })
      .then((move) => {
        if (cancelled || !move) return;
        const applied = chessRef.current.move(move);
        if (applied) {
          setMoveHistory((h) => [...h, applied]);
          setFen(chessRef.current.fen());
        }
      })
      .finally(() => {
        if (!cancelled) setThinking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fen, status, playerColor, difficulty, resigned]);

  const verboseMoves = useMemo(() => {
    if (!selectedSquare || !myTurn) return [];
    return chess.moves({ square: selectedSquare, verbose: true });
  }, [chess, selectedSquare, myTurn]);

  const legalDestinations = useMemo(() => [...new Set(verboseMoves.map((m) => m.to))], [verboseMoves]);

  function commitPlayerMove({ from, to, promotion }) {
    setSelectedSquare(null);
    setPendingMove(null);
    const applied = chessRef.current.move({ from, to, promotion });
    if (!applied) return;
    setMoveHistory((h) => [...h, applied]);
    setFen(chessRef.current.fen());
  }

  function handleSquareClick(square, piece) {
    if (!myTurn) return;
    if (legalDestinations.includes(square)) {
      const movesToSquare = verboseMoves.filter((m) => m.to === square);
      if (movesToSquare.some((m) => m.promotion)) {
        setPendingMove({ from: selectedSquare, to: square });
      } else {
        commitPlayerMove({ from: selectedSquare, to: square });
      }
      return;
    }
    if (piece && piece.color === chess.turn()) {
      setSelectedSquare(square);
    }
  }

  function handlePromotionSelect(promotion) {
    if (!pendingMove) return;
    commitPlayerMove({ ...pendingMove, promotion });
  }

  function handlePlay({ color, difficulty: chosenDifficulty }) {
    chessRef.current = new Chess();
    setFen(chessRef.current.fen());
    setMoveHistory([]);
    setSelectedSquare(null);
    setPendingMove(null);
    setResigned(false);
    setPlayerColor(color);
    setDifficulty(chosenDifficulty);
    setStatus('playing');
  }

  function handleResign() {
    if (status !== 'playing' || isOver) return;
    setResigned(true);
  }

  let endPopup = null;
  if (status === 'playing' && isOver) {
    const reasonText = REASON_TEXT[reason] || reason;
    if (winner === null) {
      endPopup = { variant: 'draw', message: `It's a draw — ${reasonText}.` };
    } else {
      const iWon = winner === playerColor;
      endPopup = iWon
        ? { variant: 'win', message: `You won — ${reasonText}.` }
        : { variant: 'lose', message: `You lost — ${reasonText}.` };
    }
  }

  const engineActive = status === 'playing' && !isOver && !myTurn;

  return (
    <>
      <Header />
      <main className="main-index game-main">
        <OfflineSetupPopup visible={status === 'setup'} onClose={() => navigate('/')} onPlay={handlePlay} />
        <Modal open={Boolean(endPopup)} onClose={() => setStatus('setup')} title="Game over">
          {endPopup && (
            <>
              <p className={`result-message result-${endPopup.variant}`}>{endPopup.message}</p>
              <div className="match-options-row">
                <Button variant="primary" onClick={() => setStatus('setup')}>
                  Rematch
                </Button>
                <Button variant="secondary" onClick={() => navigate('/')}>
                  Home
                </Button>
              </div>
            </>
          )}
        </Modal>
        <PromotionPopup visible={Boolean(pendingMove)} onSelect={handlePromotionSelect} />
        <div className="game-board-column">
          <div className={`player-info${engineActive ? ' player-info-active' : ''}`}>
            <div className="username">Stockfish — {difficulty.label}</div>
            <div>{thinking ? 'Thinking…' : 'Waiting for your move'}</div>
          </div>
          <Board
            chess={chess}
            color={playerColor}
            interactive={myTurn}
            selectedSquare={selectedSquare}
            legalDestinations={legalDestinations}
            onSquareClick={handleSquareClick}
          />
          <div className={`player-info${myTurn ? ' player-info-active' : ''}`}>
            <div className="username">{username}</div>
          </div>
          {status === 'playing' && !isOver && (
            <Button variant="danger" onClick={handleResign}>
              Resign
            </Button>
          )}
        </div>
        <MoveHistory moves={moveHistory} />
      </main>
      <Footer />
    </>
  );
}
