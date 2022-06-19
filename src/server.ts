import router from './router';

import express from 'express';

import session from 'express-session';
import csurf from 'csurf';
import expressRateLimit from 'express-rate-limit';

import dotenv from 'dotenv';

const app = express();

app.enable('trust proxy');

dotenv.config();

const limiter = expressRateLimit({
  windowMs: 60 * 1000, // 1分間に
  max: 1000, // 100回まで
});

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET as string, // トークンを署名するためのキー
  resave: false,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    maxAge: 60 * 60 * 1000, // 1時間
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
}));

app.use(limiter);

app.use(csurf({cookie: false}));

const PORT = process.env.PORT || 8080;

app.use('/', router);
app.use('/downloads', express.static('downloads'));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
