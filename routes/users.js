var express = require('express');
var router = express.Router();

const mongoose = require('../backend/index');
const User = require('../backend/models/user');

/* Save new User. */
router.post('/signup', function(req, res, next) {
    console.log(req.body);

    new User(req.body).save().then(user => res.status(201).send(user)).catch(console.log);
});

module.exports = router;