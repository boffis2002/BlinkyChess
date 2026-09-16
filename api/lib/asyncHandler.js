// Express 4 doesn't catch rejected promises from async route handlers on its
// own — without this, a malformed id (new ObjectId() throwing) or any other
// unexpected rejection would crash the process instead of producing a
// response. Wrap every async handler with this so failures reach the central
// error handler in _app.js.
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
