const { Chess } = require('chess.js');

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

function applyMove(fen, { from, to, promotion }) {
  const chess = new Chess(fen);
  let move;
  try {
    move = chess.move({ from, to, promotion });
  } catch {
    move = null;
  }
  if (!move) {
    return { ok: false, error: 'illegal move' };
  }
  return {
    ok: true,
    fen: chess.fen(),
    san: move.san,
    flags: move.flags,
    isCheck: chess.isCheck(),
    ...describeGameOver(chess),
  };
}

function gameStatus(fen) {
  const chess = new Chess(fen);
  return { turn: chess.turn(), isCheck: chess.isCheck(), ...describeGameOver(chess) };
}

module.exports = { applyMove, gameStatus };
