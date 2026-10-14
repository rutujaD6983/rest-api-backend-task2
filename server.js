require('dotenv').config();
const app = require('./src/app');
const { initDb, closeDb } = require('./src/db');

const port = Number(process.env.PORT) || 3000;

initDb()
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`REST API listening on http://localhost:${port}`);
      console.log('Health check: GET /api/health');
      console.log('Items endpoint: GET /api/items');
    });

    const shutdown = (signal) => {
      console.log(`\n${signal} received. Shutting down...`);
      server.close(() => {
        closeDb();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  })
  .catch((error) => {
    console.error('Failed to initialize SQLite database:', error);
    process.exit(1);
  });
