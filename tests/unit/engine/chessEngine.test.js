import { describe, it, expect } from 'vitest';
const { applyMove, gameStatus } = require('../../../src/engine/chessEngine');

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

describe('applyMove — basic legality', () => {
  it('accepts a legal opening move', () => {
    const result = applyMove(START_FEN, { from: 'e2', to: 'e4' });
    expect(result.ok).toBe(true);
    expect(result.san).toBe('e4');
  });

  it('rejects an illegal move without touching the position', () => {
    const result = applyMove(START_FEN, { from: 'e2', to: 'e5' });
    expect(result.ok).toBe(false);
  });

  it('rejects moving a piece that is not there', () => {
    const result = applyMove(START_FEN, { from: 'e4', to: 'e5' });
    expect(result.ok).toBe(false);
  });
});

describe('applyMove — castling (bug #1: was unreachable via SAN substring parsing)', () => {
  it('performs white kingside castling (king and rook both move)', () => {
    const fen = 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1';
    const result = applyMove(fen, { from: 'e1', to: 'g1' });
    expect(result.ok).toBe(true);
    expect(result.san).toBe('O-O');
    expect(result.fen.split(' ')[0]).toBe('r3k2r/8/8/8/8/8/8/R4RK1');
  });

  it('performs white queenside castling', () => {
    const fen = 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1';
    const result = applyMove(fen, { from: 'e1', to: 'c1' });
    expect(result.ok).toBe(true);
    expect(result.san).toBe('O-O-O');
  });

  it('performs black kingside castling', () => {
    const fen = 'r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1';
    const result = applyMove(fen, { from: 'e8', to: 'g8' });
    expect(result.ok).toBe(true);
    expect(result.san).toBe('O-O');
  });

  it('performs black queenside castling', () => {
    const fen = 'r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1';
    const result = applyMove(fen, { from: 'e8', to: 'c8' });
    expect(result.ok).toBe(true);
    expect(result.san).toBe('O-O-O');
  });

  it('rejects castling once rights are lost (rook already moved)', () => {
    const fen = 'r3k2r/8/8/8/8/8/8/R3K2R w Kkq - 0 1'; // white lost queenside rights
    const result = applyMove(fen, { from: 'e1', to: 'c1' });
    expect(result.ok).toBe(false);
  });
});

describe('applyMove — en passant', () => {
  it('captures en passant when available', () => {
    // White just played e4-e5, black played d7-d5: white can capture en passant on d6.
    const fen = 'rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3';
    const result = applyMove(fen, { from: 'e5', to: 'd6' });
    expect(result.ok).toBe(true);
    expect(result.san).toBe('exd6');
  });
});

describe('applyMove — promotion (bug #2: manual SAN insertion was fragile)', () => {
  const fen = '8/P7/8/8/8/8/8/k1K5 w - - 0 1';

  it.each(['q', 'r', 'b', 'n'])('promotes a pawn to %s', (piece) => {
    const result = applyMove(fen, { from: 'a7', to: 'a8', promotion: piece });
    expect(result.ok).toBe(true);
    expect(result.fen.split(' ')[0].startsWith(piece.toUpperCase())).toBe(true);
  });

  it('promotes correctly even on a capturing move (checkmate here, hence the #)', () => {
    const captureFen = 'r7/1P6/8/8/8/8/8/k1K5 w - - 0 1';
    const result = applyMove(captureFen, { from: 'b7', to: 'a8', promotion: 'q' });
    expect(result.ok).toBe(true);
    expect(result.san).toBe('bxa8=Q#');
    expect(result.over).toBe(true);
    expect(result.reason).toBe('checkmate');
  });

  it('rejects a promotion move missing the required promotion piece', () => {
    const result = applyMove(fen, { from: 'a7', to: 'a8' });
    expect(result.ok).toBe(false);
  });
});

describe('applyMove — game end detection', () => {
  it("detects checkmate (fool's mate) and reports the winner", () => {
    const fen = 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3';
    const status = gameStatus(fen);
    expect(status.over).toBe(true);
    expect(status.reason).toBe('checkmate');
    expect(status.winner).toBe('black');
  });

  it('detects stalemate', () => {
    const fen = 'k7/8/1Q6/8/8/8/8/7K b - - 0 1';
    const status = gameStatus(fen);
    expect(status.over).toBe(true);
    expect(status.reason).toBe('stalemate');
    expect(status.winner).toBeNull();
  });

  it('detects insufficient material (king vs king)', () => {
    const fen = '8/8/8/4k3/8/8/8/4K3 w - - 0 1';
    const status = gameStatus(fen);
    expect(status.over).toBe(true);
    expect(status.reason).toBe('insufficient_material');
  });

  it('detects the fifty-move rule (bug #5: never checked before)', () => {
    // Enough material that this isn't also an insufficient-material draw.
    const fen = '8/8/4k3/8/8/4K3/8/R6r w - - 100 60';
    const status = gameStatus(fen);
    expect(status.over).toBe(true);
    expect(status.reason).toBe('fifty_move');
  });
});
