const express = require('express');
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'User App',
    saveUninitialized: true,
    resave: false,
  })
);

app.get('/', (req, res) => res.send('HI'));

app.use('/api/sessions', require('./api-sessions'));

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message || 'Internal server error');
});

module.exports = app;
