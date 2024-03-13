const path = require('path');
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const globalErrorHandler = require('./controllers/errorController');
const { AppError } = require('./utils');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');

const session = require('express-session');
const passport = require('passport');
const { sessionOptions } = require('./config/database');
require('./config/passport');
require('./config/redis');

const { ApolloServer } = require('@apollo/server');
const {
  expressMiddleware: apolloMidlleware,
} = require('@apollo/server/express4');
const resolvers = require('./graphql/resolvers');
const typeDefs = fs.readFileSync(
  path.join(__dirname, 'graphql/schema.graphql'),
  'utf-8'
);

const {
  abilitiesRouter,
  allGamesRouter,
  errorToAdminRouter,
  exploreGamesRouter,
  galleryRouter,
  ruinedRouter,
  skinsRouter,
  subwebRouter,
  userRouter,
} = require('./routes');

const { webhookCheckout } = require('./controllers/userController');

const app = express();
const { NODE_ENV } = process.env;

// Set security HTTP Headers
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

if (NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Stripe Webhook implementation
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Data sanitization against NoSQL query injection --> Dot or Dollar sign in MongoDB
app.use(mongoSanitize());

// Data sanitization against XSS --> Malicious code HTML,...
app.use(xss());

// Template Engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Compress data before sending to user
if (NODE_ENV !== 'development') app.use(compression());

// Enable proxy to allow express-rate-limit from accurately identifying users
app.enable('trust proxy');

// Cors
app.use(
  cors({
    origin: 'http://127.0.0.1:8080',
    credentials: true,
  })
);
app.options('*', cors());

// Express session
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

// Limit requests from same API
app.use(
  '/',
  rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP! Please try again in an hour.',
  })
);

(async () => {
  app.get('/', (req, res) => {
    if (NODE_ENV === 'development') {
      console.log(req.session);
      console.log('isAuthenticated:', req.isAuthenticated());
    }

    res.status(200).render('pageAPI');
  });

  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  await apolloServer.start();
  app.use('/graphql', apolloMidlleware(apolloServer));

  app.use('/api/v1/errorToAdmin', errorToAdminRouter);
  app.use('/api/v1/abilities', abilitiesRouter);
  app.use('/api/v1/allGames', allGamesRouter);
  app.use('/api/v1/exploreGames', exploreGamesRouter);
  app.use('/api/v1/gallery', galleryRouter);
  app.use('/api/v1/ruined', ruinedRouter);
  app.use('/api/v1/skins', skinsRouter);
  app.use('/api/v1/subweb', subwebRouter);
  app.use('/api/v1/users', userRouter);

  app.all('*', (req, _, next) =>
    next(new AppError(`${req.originalUrl} not found!`, 404))
  );

  app.use(globalErrorHandler);
})();

module.exports = app;
