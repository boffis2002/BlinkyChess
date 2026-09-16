// Vercel entrypoint: any request under /api/* is routed to this function
// (bracket catch-all is a Vercel filesystem convention, not framework-specific).
// An Express app instance is itself a valid (req, res) handler, so it can be
// exported directly — no extra adapter needed.
const createApp = require('./_app');

module.exports = createApp();
