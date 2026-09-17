import { Chess } from 'chess.js';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import Board from '../components/Board';
import Footer from '../components/Footer';
import Header from '../components/Header';
import MoveHistory from '../components/MoveHistory';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Replay() {
  const { id } = useParams();
  const { username } = useAuth();
  const [game, setGame] = useState(null);
  const [notFound, setNotFound] = useState(false);
  // 0 = starting position, i = position after moveHistory[i - 1].
  const [step, setStep] = useState(0);

  useEffect(() => {
    setGame(null);
    setNotFound(false);
    setStep(0);
    api
      .getGame(id)
      .then((g) => {
        setGame(g);
        setStep(g.moveHistory.length);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  const fenAtStep = useMemo(() => {
    if (!game) return undefined;
    if (step === 0) return undefined;
    return game.moveHistory[step - 1].fen;
  }, [game, step]);

  const chess = useMemo(() => new Chess(fenAtStep), [fenAtStep]);

  if (notFound) {
    return (
      <>
        <Header />
        <main className="main-index"><p>Game not found.</p></main>
      </>
    );
  }

  if (!game) {
    return (
      <>
        <Header />
        <main className="main-index"><div className="loader"></div></main>
      </>
    );
  }

  const color = username === game.players.black ? 'black' : 'white';
  const lastMove = step > 0 ? game.moveHistory[step - 1] : null;

  return (
    <>
      <Header />
      <main className="main-index game-main">
        <div className="game-board-column">
          <Card className="replay-players">
            <span>{game.players.white}</span>
            <span className="game-list-vs">vs</span>
            <span>{game.players.black}</span>
          </Card>
          <Board chess={chess} color={color} interactive={false} selectedSquare={null} legalDestinations={[]} onSquareClick={() => {}} />
          <Card className="replay-controls">
            <Button variant="secondary" onClick={() => setStep(0)} disabled={step === 0}>
              ⏮
            </Button>
            <Button variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              ◀
            </Button>
            <span className="replay-step">
              {step} / {game.moveHistory.length}
              {lastMove ? ` — ${lastMove.san}` : ''}
            </span>
            <Button
              variant="secondary"
              onClick={() => setStep((s) => Math.min(game.moveHistory.length, s + 1))}
              disabled={step === game.moveHistory.length}
            >
              ▶
            </Button>
            <Button variant="secondary" onClick={() => setStep(game.moveHistory.length)} disabled={step === game.moveHistory.length}>
              ⏭
            </Button>
          </Card>
        </div>
        <MoveHistory moves={game.moveHistory} onMoveSelect={(i) => setStep(i + 1)} currentMoveIndex={step - 1} />
      </main>
      <Footer />
    </>
  );
}
