var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index.hbs', { title: 'Express' });
});

/* GET login page */
router.get('/login', function(req, res, next) {
    res.render('login.hbs', { title: 'Express' });
});

/* GET register page */
router.get('/register', function(req, res, next) {
    res.render('register.hbs', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
    res.send("Esta es la respuesta de una prueba!");
});

router.get('/test', function(req, res, next) {
    res.send("Esta es la respuesta de una prueba!");
});


module.exports = router;