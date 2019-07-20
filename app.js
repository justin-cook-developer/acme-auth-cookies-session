const express = require('express');
const session = require('express-session');

const users = {};
const app = express();

app.use(
  session({
    secret: 'User App',
    saveUninitialized: true,
    resave: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message || 'Internal server error');
});
