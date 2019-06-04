var express = require('express');
var router = express.Router();

const mongoose = require('../backend/app');
const User = require('../backend/models/user');
const nodemail = require('../config/nodemailer');
const config = require('../config/password');
const bcrypt = require('bcrypt');

/* Save new User. */
router.post('/signup', function(req, res, next) {
    console.log(req.body);
    new User({
        ...req.body,
        confirmedEmail: false
    }).save().then(
        (user) => {
            nodemail.sendMail({
                from: `${config.GMAIL.email}`,
                to: `${user.email}`,
                subject: "Registro Completado",
                html: `
                    <h1>Bienvenido a GeeksHubs Travels</h1>

                    <p>Porfavor, active su cuenta en el siquiente link: 
                    <a href="http://localhost:3000/users/activate/${user._id}">Click aquí para activar tu cuenta<a/>
                    </p>
                `
            }).catch(console.log);

            // res.status(201).send(user);
            res.redirect("verifyEmail");
        }
    ).catch(err => {
        if (err.code === 11000) {
            console.log('Ya existe un usuario con el email introducido');
            res.redirect("register", { registerErr: "Ya existe un usuario con el email introducido" });
        }
    });
});

/* Verify email */
router.get('/register', function(req, res, next) {
    res.render('verifyEmail.hbs');
});

/* Verify email */
router.get('/verifyEmail', function(req, res, next) {
    res.render('verifyEmail.hbs');
});

/* Email confirmation*/
router.get('/activate/:id', function(req, res) {
    User.findByIdAndUpdate(req.params.id, { confirmedEmail: true }).then(user => {
        res.redirect("/users/userVerified");
    });
});

/* User Verified */
router.get('/userVerified', function(req, res, next) {
    res.render('userVerified.hbs');
});


/* LOGIN */
router.post('/signin', function(req, res, next) {
    let userReq = req.body;

    User.findOne({ email: userReq.email }).then((user) => {
        console.log(user);
        if (user === null) {
            res.render('login', { notify: "Email incorrecto" });
        } else if (user.confirmedEmail === false) {
            res.render('login', { notify: "Porfavor, verifique el email asociado al usuario." });
        } else {
            bcrypt.compare(userReq.password, user.password).then(isMatch => {
                if (isMatch) {
                    res.redirect("/");
                } else {
                    res.render('login', { notify: "Contraseña incorrecta" });
                }
            });
        }
    }).catch(console.log);
});


module.exports = router;