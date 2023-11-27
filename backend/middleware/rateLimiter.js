const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes depuis cette adresse IP, veuillez réessayer plus tard.',
});

module.exports = limiter;