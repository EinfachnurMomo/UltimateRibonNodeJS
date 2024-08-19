/* jshint esversion: 10 */
const {globalVariables} = require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('express-handlebars');
const {mongoDbUrl, PORT} = require('./config/config');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const {selectOption} = require('./config/customFunctions');
const fileUpload = require('express-fileupload');
const app = express();
const passport = require('passport');
const User = require('./models/UserModel').User;

/* Config Mongoose connection to MongoDB */
mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(response =>{
        console.log("Datenbank verbindung war erfolgreich.");
    }).catch(err => {
        console.log("Datenbank verbindung fehlgeschlagen!");
});

/* Config Express */
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

/* Flash and Session */
app.use(session({
    secret: 'anysecret',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(globalVariables);
app.use(fileUpload());

/* Setup view Engine to use HandleBars */
app.engine('handlebars', hbs({ defaultLayout: 'default', helpers: {select: selectOption}}));
app.set('view engine', 'handlebars');

/* Method Override Middleware */
app.use(methodOverride('newMethod'));

/* Routes */
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`Server wurde auf Port ${PORT} gestartet`);
});