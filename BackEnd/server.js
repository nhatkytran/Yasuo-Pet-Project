process.on('uncaughtException', error => {
  console.error('\n--- UNCAUGHT EXCEPTION! Shutting down... ---\n');
  console.error(error);
  process.exit(1);
});

const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, 'config.env') });
const { PORT } = process.env;

const app = require('./app');

const port = PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
  console.log(`GraphQL endpoint: ${port}/graphql`);
});

process.on('unhandledRejection', error => {
  console.error('\n--- UNHANDLED REJECTION! Shutting down... ---\n');
  console.error(error);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.error('\n--- SIGTERM RECEIVED! Shutting down... ---\n');
  if (server) server.close(() => console.log('SIGTERM - Process terminated!'));
});
