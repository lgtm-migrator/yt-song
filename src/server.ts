import router from './router';

import express from 'express';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.use('/', router);
app.use('/downloads', express.static('downloads'));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
