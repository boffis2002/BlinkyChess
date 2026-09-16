const DEFAULT_K_FACTOR = 32;

function expectedScore(rating, opponentRating) {
  return 1 / (1 + 10 ** ((opponentRating - rating) / 400));
}

// result is from A's perspective: 'A' (A won), 'B' (B won), or 'draw'.
function calculateEloChange(ratingA, ratingB, result, kFactor = DEFAULT_K_FACTOR) {
  const scoreA = result === 'A' ? 1 : result === 'B' ? 0 : 0.5;
  const scoreB = 1 - scoreA;
  const deltaA = Math.round(kFactor * (scoreA - expectedScore(ratingA, ratingB)));
  const deltaB = Math.round(kFactor * (scoreB - expectedScore(ratingB, ratingA)));
  return { deltaA, deltaB };
}

module.exports = { expectedScore, calculateEloChange, DEFAULT_K_FACTOR };
