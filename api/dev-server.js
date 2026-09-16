const createApp = require('./_app');

const PORT = process.env.API_PORT || 3001;
const app = createApp();

app.listen(PORT, () => {
  console.log(`New API listening on http://localhost:${PORT} (existing site on 8989 is untouched)`);
});
