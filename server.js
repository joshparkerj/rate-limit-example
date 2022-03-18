const express = require('express');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');

const app = express();

app.use(rateLimit({ windowMs: 1000, max: 1 }));

app.use('/api', routes);

module.exports = {
  start: (cb) => app.listen(8080, cb),
  stop: () => app.close(),
};
