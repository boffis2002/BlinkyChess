// Vercel entrypoint. The bracket catch-all filename ([...path].js) is a
// Next.js-only convention — plain Vercel Functions don't recognize it, so
// every request under /api/* is routed HERE instead via a vercel.json
// rewrite. An Express app instance is itself a valid (req, res) handler,
// so it can be exported directly — no extra adapter needed.
const createApp = require('./_app');

module.exports = createApp();
