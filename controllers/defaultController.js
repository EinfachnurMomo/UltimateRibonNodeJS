/* jshint esversion: 10 */
const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel').User;

module.exports = {
    // Home
    index: async (req, res) => {
        const posts = await Post.find().lean();
        const categories = await Category.find();
        res.render('default/index', {posts: posts, categories: categories});
    },

    // Info
    info: async (req, res) => {
        res.render('default/info');
    },

    // Chapter
    chapter: async (req, res) => {
        res.render('default/chapter');
    },

    // About-Us
    aboutus: async (req, res) => {
        res.render('default/aboutus');
    },

    // Impressum
    impressum: async (req, res) => {
        res.render('default/impressum');
    },

    // Datenschutzerklaerung
    datenschutzerklaerung: async (req, res) => {
        res.render('default/datenschutzerklaerung');
    },

    // Login
    loginGet: (req, res) => {
        res.render('default/login', {message: req.flash('error')});
    },

    loginPost: (req, res) => {
        //
    },

    // Register
    registerGet: (req, res) => {
        res.render('default/register');
    },

    registerPost: (req, res) => {
        let errors = [];

        if (!req.body.firstName) {
            errors.push({message: 'Bitte gebe einen Vornamen an!'});
        }

        if (!req.body.lastName) {
            errors.push({message: 'Bitte gebe einen Nachnamen an!'});
        }

        if (!req.body.email) {
            errors.push({message: 'Bitte gebe eine Email an!'});
        }

        if (req.body.password !== req.body.passwordConfirm) { 
            errors.push({message: 'Die Passwörter stimmen nicht überein!'});
        }

        if (errors.length > 0) {
            res.render('default/register', {
                errors: errors,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            });
        }
        else {
            User.findOne({email: req.body.email}).then(user => {
                if (user) {
                    req.flash('error-message', 'Diese Email ist bereites registriert, versuche dich doch damit einzuloggen :´)');
                    res.redirect('/login');
                }
                else {
                    const newUser = User(req.body);
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            newUser.password = hash;
                            newUser.save().then(user => {
                                req.flash('success-message', 'Du hast dich erfolgreich Registriert!');
                                res.redirect('/login');
                            });
                        });
                    });
                }
            });
        }
    }
};