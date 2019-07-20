const express = require('express');
const session = require('express-session');

const users = {};
const app = express();

const makeErr = next => (msg, status) => {
  const err = new Error(msg);
  err.status = status;
  next(err);
};

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

app.get('/api/sessions', (req, res, next) => {
  if (req.session && req.session.username) {
    res.json({ username: req.session.username });
  } else {
    makeErr(next)('User not logged in.', 401);
  }
});

app.post('/api/sessions', (req, res, next) => {
  const { username, password } = req.body;
  const sendErr = makeErr(next);

  if (username && password) {
    req.session.reload(err => console.error(err));

    if (users[username]) {
      if (users[username] === password) {
        req.session.username = username;
      } else {
        sendErr('Incorrect password.', 401);
        return;
      }
    } else {
      users[username] = password;
      req.session.username = username;
    }

    req.session.save(err => console.error(err));
    res.status(204).json({ username: req.session.username });
  } else {
    sendErr('You must provide a username and password.', 400);
  }
});

app.delete('/api/sessions', (req, res, next) => {
  if (req.session) {
    req.session.destroy(err => console.error(err));
    res.sendStatus(204);
  } else {
    makeErr(next)('User not logged in.', 401);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message || 'Internal server error');
});

module.exports = app;
