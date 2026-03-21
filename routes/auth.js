const express = require('express');
const passport = require('passport');
const router = express.Router();

// Initiates Google OAuth flow
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google redirects here after login
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard'); // success
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

module.exports = router;