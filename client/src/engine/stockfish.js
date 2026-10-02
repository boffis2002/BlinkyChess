// Thin UCI wrapper around the Stockfish WASM engine, run as a classic Web
// Worker — the "lite single-threaded" build: strong enough for a casual
// opponent, ~1.8MB, and (unlike the multi-threaded build) doesn't need
// SharedArrayBuffer or special cross-origin-isolation response headers.
//
// The worker is a module-level singleton so the engine only spins up once
// per tab and stays warm across multiple offline games, instead of paying
// the WASM init cost every time a game starts.

let worker = null;
let readyPromise = null;
let searchQueue = Promise.resolve();

function getWorker() {
  if (!worker) {
    worker = new Worker('/stockfish/stockfish-19-lite-single.js');
  }
  return worker;
}

function whenReady() {
  if (!readyPromise) {
    const w = getWorker();
    readyPromise = new Promise((resolve) => {
      function onMessage(e) {
        if (e.data === 'uciok') {
          w.postMessage('isready');
        } else if (e.data === 'readyok') {
          w.removeEventListener('message', onMessage);
          resolve();
        }
      }
      w.addEventListener('message', onMessage);
      w.postMessage('uci');
    });
  }
  return readyPromise;
}

// uciMove is a UCI long-algebraic string like "e2e4" or "e7e8q" (promotion).
function parseUciMove(uciMove) {
  return {
    from: uciMove.slice(0, 2),
    to: uciMove.slice(2, 4),
    promotion: uciMove.length > 4 ? uciMove[4] : undefined,
  };
}

// skillLevel: 0 (weakest) to 20 (strongest, full engine strength).
// movetimeMs: how long the engine is allowed to think per move.
// depth (optional): cap on search depth. Skill Level alone only weakens
// play probabilistically — even at 0 the lite net still sees most tactics
// if given time — so the lowest levels also limit how far ahead it looks,
// which is what actually makes it blunder like a beginner.
export function getBestMove(fen, options) {
  // One engine, one search at a time: a new request (e.g. a rematch started
  // while the previous game's search is still running) would otherwise send
  // ucinewgame/position/go into a search in flight, which traps the WASM
  // module ("RuntimeError: unreachable"). Queue instead; a cancelled search
  // just finishes within its movetime and its result is ignored by the caller.
  const run = () => search(fen, options);
  const result = searchQueue.then(run, run);
  searchQueue = result.catch(() => {});
  return result;
}

async function search(fen, { skillLevel = 10, movetimeMs = 800, depth } = {}) {
  const w = getWorker();
  await whenReady();

  return new Promise((resolve) => {
    function onMessage(e) {
      const line = e.data;
      if (typeof line === 'string' && line.startsWith('bestmove')) {
        w.removeEventListener('message', onMessage);
        const uciMove = line.split(' ')[1];
        resolve(uciMove && uciMove !== '(none)' ? parseUciMove(uciMove) : null);
      }
    }
    w.addEventListener('message', onMessage);
    w.postMessage('ucinewgame');
    w.postMessage(`setoption name Skill Level value ${skillLevel}`);
    w.postMessage(`position fen ${fen}`);
    w.postMessage(depth ? `go depth ${depth} movetime ${movetimeMs}` : `go movetime ${movetimeMs}`);
  });
}
