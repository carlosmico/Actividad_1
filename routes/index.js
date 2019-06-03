var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index.hbs', { title: 'Express' });
});

/* GET register page */
router.get('/register', function(req, res, next) {
    res.render('register.hbs', { title: 'Express' });
});

module.exports = router;