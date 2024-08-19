/* jshint esversion: 10 */
const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel').User;

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'default';
    next();
});

// Home
router.route('/').get(defaultController.index);

// Info
router.route('/info').get(defaultController.info);

// Chapter
router.route('/chapter').get(defaultController.chapter);

// About-Us
router.route('/about-us').get(defaultController.aboutus);

// Impressum
router.route('/impressum').get(defaultController.impressum);

// Datenschutzerklaerung
router.route('/datenschutzerklaerung').get(defaultController.datenschutzerklaerung);

// Define local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback : true
}, (req, email, password, done) => {
    User.findOne({email: email}).then(user => {
        if (!user) {
            return done(null, false, req.flash('error-message', 'Es wurde kein Account mit dieser Email gefunden!'));
        }
        bcrypt.compare(password, user.password, (err, passwordMatched) => {
            if (err) {
                return err;
            }
            
            if (!passwordMatched) {
                return done(null, false, req.flash('error-message', 'Falscher Benutzername oder Passwort!'));
            }

            return done(null, user, req.flash('success-message', 'Du hast dich erfolgreich eingeloggt!'));
        });
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

//login
router.route('/login').get(defaultController.loginGet).post(passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true,
    session: true
}), defaultController.loginPost);

// Register
router.route('/register').get(defaultController.registerGet).post(defaultController.registerPost);

module.exports = router;