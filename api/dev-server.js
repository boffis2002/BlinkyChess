const createApp = require('./_app');

const PORT = process.env.API_PORT || 3001;
const app = createApp();

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
