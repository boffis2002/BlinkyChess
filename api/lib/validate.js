// Small guards applied before any request body value reaches a MongoDB query —
// without a typeof check, a crafted body like {"username": {"$ne": null}} could
// otherwise alter a query's meaning.

function isValidUsername(value) {
  return typeof value === 'string' && value.trim() === value && value.length >= 1 && value.length <= 32 && !value.includes(' ');
}

function isValidPassword(value) {
  return typeof value === 'string' && value.length >= 1 && value.length <= 200 && !value.includes(' ');
}

function isPositiveInt(value, { min = 0, max = Infinity } = {}) {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}

module.exports = { isValidUsername, isValidPassword, isPositiveInt };
