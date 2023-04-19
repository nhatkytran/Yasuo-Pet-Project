process.on('uncaughtException', error => {
  console.error('\n--- UNCAUGHT EXCEPTION! Shutting down... ---\n');
  console.error(error);

  process.exit(1);
});

const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, 'config.env') });

const app = require('./app');

const { PORT } = process.env;

const port = PORT || 3000;
const server = app.listen(port, () =>
  console.log(`App running on port ${port}...`)
);

process.on('unhandledRejection', error => {
  console.error('\n--- UNHANDLED REJECTION! Shutting down... ---\n');
  console.error(error);

  server.close(() => process.exit(1));
});
