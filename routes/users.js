var express = require('express');
var router = express.Router();

const mongoose = require('../backend/app');
const User = require('../backend/models/user');
const nodemail = require('../config/nodemailer');
const config = require('../config/password');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_JWT = require('../config/password').SECRET_JWT;

var signupErrCode;

/* Save new User. */
router.post('/signup', function(req, res, next) {
    console.log(req.body);
    new User({
        ...req.body,
        confirmedEmail: false
    }).save().then(
        (user) => {

            try {
                const emailToken = jwt.sign({ _id: user._id }, SECRET_JWT, { expiresIn: '1h' });

                const urlVerification = `http://localhost:3000/users/activate/${emailToken}`;

                nodemail.sendMail({
                    from: `${config.GMAIL.email}`,
                    to: `${user.email}`,
                    subject: "Registro Completado",
                    html: `
                        <h1>Bienvenido a GeeksHubs Travels</h1>
    
                        <p>Porfavor, active su cuenta en el siquiente link: 
                        <a href="${urlVerification}">Click aquí para activar tu cuenta<a/>
                        </p>
                    `
                }).catch(console.log);

                // res.status(201).send(user);
                res.redirect("verifyEmail");
            } catch (err) {
                console.log(err);
            }
        }
    ).catch(err => {
        console.log(err);

        signupErrCode = err.code;

        res.redirect("register");
    });
});

router.get('/register', function(req, res) {
    console.log("Signuperrcode: " + signupErrCode)
    switch (signupErrCode) {
        case 11000:
            res.render('register', { registerErr: "Ya existe un usuario con este email" })
            break;

        default:
            res.render('register');
    }
});

/* Verify email */
router.get('/verifyEmail', function(req, res, next) {
    res.render('verifyEmail.hbs');
});

/* Email confirmation*/
router.get('/activate/:token', function(req, res) {
    const token = req.params.token;

    try {
        const payload = jwt.verify(token, SECRET_JWT);

        User.findByIdAndUpdate(payload._id, { confirmedEmail: true }, { new: true }).then(user => {
            console.log(`Usuario actualizado: ${user}`);
            res.redirect("/users/userVerified");
        });
    } catch (err) {
        console.log(err)
            //res.status(400).send(err);
    }
});

/* User Verified */
router.get('/userVerified', function(req, res, next) {
    res.render('userVerified.hbs');
});

/* === Password Recovery === */
router.get('/emailRecovery', function(req, res) {
    res.render('emailRecovery.hbs');
});

router.get('/passwordRecovery/:recoveryToken', function(req, res) {
    res.render('passwordRecovery.hbs');
});

router.post('/sendTokenRecovery', function(req, res) {
    const emailReq = req.body.email;

    //Buscamos el usuario con el email recibido, si no existe redirigimos a la página de emailRecovery mostrando warning
    User.findOne({ email: emailReq }).then(user => {
        if (user) {
            console.log(`Usuario a restablecer pwd: ${user}`)

            //Generamos el token de acceso a la página passwordRecovery
            const recoveryToken = jwt.sign({ _id: user._id }, SECRET_JWT, { expiresIn: "1h" });

            const url = `http://localhost:3000/users/passwordRecovery/${recoveryToken}`;

            //Enviamos el mail al usuario con la url + token para restablecer
            nodemail.sendMail({
                from: `${config.GMAIL.email}`,
                to: `${user.email}`,
                subject: "Recuperar contraseña",
                html: `
                    <h1>Estimado usuario '${user.username}'</h1>

                    <p>Para poder restaurar su contraseña acceda a la dirección que le facilitamos a continuación: 
                    <a href="${url}">Click aquí para restablecer tu cuenta<a/>
                    </p>
                `
            }).catch(console.log);

            res.redirect('/users/mailRecoverySend')
        } else {
            res.redirect('/users/emailRecovery');
            // res.render('emailRecovery.hbs', { recoveryErr: 'No existe ningún usuario con este email' });
        }
    });
});

router.get('/mailRecoverySend', function(req, res) {
    res.render('mailRecoverySend');
});

/* Password Changed */
router.post('/passwordChanged', function(req, res) {
    const recoveryToken = req.headers.referer.split("passwordRecovery/")[1];

    const payload = jwt.verify(recoveryToken, SECRET_JWT);

    const newPassword = req.body.newPassword;

    User.findById(payload._id).then(user => {
        user.password = newPassword;
        user.save().then(res.render('passwordChanged.hbs')).catch(err => res.status(500).send(err));
    }).catch(err => res.status(500).send(err));
});

/* LOGIN */
router.post('/signin', function(req, res, next) {
    let userReq = req.body;

    User.findOne({ email: userReq.email }).then((user) => {
        console.log(user);
        if (user === null) {
            res.render('login', { notify: "Credenciales erroneas" });
        } else if (user.confirmedEmail === false) {
            res.render('login', { notify: "Porfavor, verifique el email asociado al usuario." });
        } else {
            bcrypt.compare(userReq.password, user.password).then(isMatch => {
                if (isMatch) {
                    const token = user.generateAuthToken(); //calls the method generateAuthToken from the UserModel
                    user['token'] = token; //here we create a user property which is going to contain the generated token
                    //res.json(user); // if both the username/email and the password are correct, it responds with the user as a json.
                    res.redirect(`/users/welcome/${user._id}`);
                } else {
                    res.render('login', { notify: "Contraseña incorrecta" });
                }
            });
        }
    }).catch(console.log);
});

router.get('/welcome/:_id', function(req, res) {
    const user = User.findById(req.params._id).then(user => {
        res.render("welcome.hbs", {
            username: user.username,
            email: user.email,
            creationDate: user.createdAt
        });
    });
});

module.exports = router;